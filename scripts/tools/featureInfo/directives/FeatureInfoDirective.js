angular.module('visorINTA.tools.featureInfo.FeatureInfoDirective', [])
.directive('featureInfoTool', function($rootScope,ToolsManager,GeoServerUtils) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
			layerList : '=',
		},
		templateUrl:"templates/tools/featureInfoTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.toolTitle);
			visorBoxCtrlr.setBoxType('tool');


			scope.$on('visorBoxClicked', function (event, data) {
	    		if (data.type == 'tool' && data.id == scope.toolName){
			        // Cambio estado de la herramienta
      				ToolsManager.toogleTool(data.id);
	    			if (ToolsManager.isToolEnabled(scope.toolName)){
						visorBoxCtrlr.setIsOpen(true);
						scope.openTool();
	    			} else {
    					visorBoxCtrlr.setIsOpen(false);
	    				scope.closeTool();
	    			}
	    		}
	  		});

	  		console.log(scope.layerList);

			scope.listenEvents = function(){
				scope.mapListener = scope.map.on('singleclick', function(evt) {
					scope.updateState(scope.stateList['REQUESTING_DATA']);
					scope.infoReceived = [];
		  			var layersToRequest = [];
		  			var featureInfoConfig = scope.getFeatureInfoConfig();
		  			if (featureInfoConfig != "default"){
		  				for (layerConfig in featureInfoConfig){
		  					layerObject = $rootScope.getLayerObjectFromConfig(layerConfig);
		  					if (scope.layerIsActive(layerObject)){
		  						layersToRequest.push(layerObject);
		  					}
			  			}
			  		}
			  		if (layersToRequest.length > 0 ){
			  			// WARNING -> Hace una peticion independiente por cada capa presente en la config
			  			//			  del proyecto
			  			GeoServerUtils.getFeatureInfo(layersToRequest,evt.coordinate,scope.map.getView())
			  			.then(function success(response) {
						    scope.bindData(response);
					    })
					   	.catch(function error(msg) {
					       scope.updateState(scope.stateList['ERROR_DATA']);
					   	});
				   } else {
		  				scope.updateState(scope.stateList['NO_LAYERS']);
		  				scope.$apply(); // angular no se entera de que cambio el estado sin esta linea
				   }
	  			})
			}
	  		

			scope.getFeatureInfoConfig = function(){
				var featureInfoConfig = "default"; // uso el string default, como nulo
				var model = $rootScope.getProyectModel();
				if (model.modelo){
	  				var pluginConfig = model.modelo[0].toolbar["9"] || null;
	  				var featureInfoConfig = (pluginConfig) ? pluginConfig.config[0].valor : "default";
	  			}
	  			return featureInfoConfig;
			}

	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        	if (scope.state != scope.stateList['DATA_RECEIVED']){
        			scope.updateState();
	        	}
	        	scope.listenEvents();
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){
	        	scope.map.unByKey(scope.mapListener);
	        }


	        scope.init = function(){

	        }

		},
		controller: function($scope){
			$scope.toolName = "featureInfoTool";
			$scope.toolTitle = "Informacion";

			$scope.updateState = function(config){
				$scope.state = config || $scope.stateList['TOOL_READY'];
			}

			// Recibe respuesta getFeatureInfo
			$scope.bindData = function(data){
				var existData = false; // flag - existe data en el punto solicitado
				$scope.infoReceived = []; // limpio info anterior
				var featureInfoConfig = $scope.getFeatureInfoConfig();
				for (i in data){ // data contiene respuesta de varias peticiones getFeatureInfo
					var infoFeatureResponse = data[i];
					for (layerConfig in featureInfoConfig){
						layerObjectConfig = $rootScope.getLayerObjectFromConfig(layerConfig);
						layerTitle = layerObjectConfig.get('title');
						if (layerTitle == infoFeatureResponse.data.layerTitle
							&& infoFeatureResponse.data.features.length){
							existData = true;
							var layerConfig = featureInfoConfig[layerConfig];
							$scope.bindLayerData(layerTitle,layerConfig,infoFeatureResponse.data.features[0].properties);
						}
					}
				}
				newState = (existData) ? 'DATA_RECEIVED' : 'NO_DATA';
				$scope.updateState($scope.stateList[newState]);
			}


			$scope.bindLayerData = function(layerTitle,layerConfig,dataReceived){
				// objecto que almacena la info recibida desde el servidor
				var data = {
					'title':layerTitle,
					'tabID':'infofeature_' + layerTitle,
					'info':{

					}
				}
				for (propertyTitle in layerConfig){ // 
					propertyName = layerConfig[propertyTitle]; // nombre original de la propiedad
					propertyValue = dataReceived[propertyName];
					data['info'][propertyTitle] = propertyValue;
				}
				$scope.infoReceived.push(data);
			}

			$scope.layerIsActive = function(layerObject){
				for (i in $scope.layerList){
					lyr = $scope.layerList[i];
					if (lyr.get('id') == layerObject.get('id')){
						return true;
					}
				}
				return false;
			}


			$scope.stateList = {
				'REQUESTING_DATA' : {text:'Pidiendo informacion solicitada...',status:'requesting_data',label:'info'},
				'DATA_RECEIVED' : {text:'',status:'data_received',label:'info'},
				'ERROR_DATA': {text:'Ha ocurrido un error mientras se pedia informacion',status:'no_data',label:'danger'},
				'NO_DATA': {text:'No existe informacion para la coordenada solicitada',status:'no_data',label:'warning'},
				'NO_LAYERS': {text:'No hay capas activas sobre las cuales pedir informacion',status:'no_layers',label:'info'},
				'TOOL_READY' : {text:'Haga click en un punto del mapa para recibir informacion',status:'tool_ready',label:'warning'},
			}

			$scope.updateState($scope.stateList['TOOL_READY']);

			// Almaceno listener a los clicks del mapa
			$scope.mapListener = null;


			/* Almacena la informacion recibida por peticiones getFeatureInfo.
			 Es un lista que contiene objectos de la forma:
			{
	        			"tabID" : "info_suelos",
	        			"title" : "Suelos",
	        			"infoType": "tuple",
	        			"info": {
	        				"Field1": "value1",
	        				"Field2": "value2",
	        				"FieldN": "valueN",
	        			}
    		},
			Cada objeto, debe guardar informacion de cada capa sobre la cual se pidieron datos
    		*/
			$scope.infoReceived = [];


		}
	}

});
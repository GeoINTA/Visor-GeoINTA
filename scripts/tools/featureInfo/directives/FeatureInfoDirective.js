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

	  		scope.map.on('singleclick', function(evt) {
	  			var layersToRequest = [];
	  			var featureInfoConfig = scope.getFeatureInfoConfig();
	  			if (featureInfoConfig != "default"){
	  				for (layerConfig in featureInfoConfig){
	  					layerObject = $rootScope.getLayerObjectFromConfig(layerConfig);
	  					layersToRequest.push(layerObject);
		  			}
		  			// WARNING -> Hace una peticion independiente por cada capa presente en la config
		  			//			  del proyecto
		  			GeoServerUtils.getFeatureInfo(layersToRequest,evt.coordinate,scope.map.getView())
		  			.then(function success(response) {
					    scope.bindData(response);
				    })
				   	.catch(function error(msg) {
				       console.error("No se ha podido pedir informacion -- " + msg);
				   	});
	  			} else {
	  				console.log("No se ha configurado informacion para este proyecto");
	  			}
	  		})

			scope.getFeatureInfoConfig = function(){
				var model = $rootScope.getProyectModel();
	  			var pluginConfig = model.modelo[0].toolbar["9"] || null;
	  			var featureInfoConfig = (pluginConfig) ? pluginConfig.config[0].valor : "default";
	  			return featureInfoConfig;
			}

	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        	
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){
	        }


	        scope.init = function(){

	        }

		},
		controller: function($scope){
			$scope.toolName = "featureInfoTool";
			$scope.toolTitle = "Informacion";


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


			// Recibe respuesta getFeatureInfo
			$scope.bindData = function(data){
				$scope.infoReceived = []; // limpio info anterior
				var featureInfoConfig = $scope.getFeatureInfoConfig();
				for (i in data){ // data contiene respuesta de varias peticiones getFeatureInfo
					var infoFeatureResponse = data[i];
					for (layerConfig in featureInfoConfig){
						layerObjectConfig = $rootScope.getLayerObjectFromConfig(layerConfig);
						layerTitle = layerObjectConfig.get('title');
						if (layerTitle == infoFeatureResponse.data.layerTitle
							&& infoFeatureResponse.data.features.length){
							var layerConfig = featureInfoConfig[layerConfig];
							$scope.bindLayerData(layerTitle,layerConfig,infoFeatureResponse.data.features[0].properties);
						}
					}
				}
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

		}
	}

});
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
		  			GeoServerUtils.getFeatureInfo(layersToRequest,evt.coordinate,scope.map.getView())
		  			.then(function success(response) {
		  				console.log(response);
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
	        	scope.infoReceived = [
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
	        		{
	        			"tabID" : "info_clima",
	        			"title" : "Clima",
	        			"infoType": "tuple",
	        			"info": {
	        				"Field1": "value1",
	        				"FieldN": "valueN",
	        			}
	        		}
	        	];
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

			$scope.infoReceived = []; // almacena la informacion recibida



			// Recibe respuesta getFeatureInfo
			$scope.bindData = function(data){
				var featureInfoConfig = $scope.getFeatureInfoConfig();
				for (i in data){ // data contiene respuesta de varias peticiones getFeatureInfo
					var infoFeatureResponse = data[i];
					console.log(infoFeatureResponse.data.layerTitle);
					for (layerConfig in featureInfoConfig){
						layerTitle = $rootScope.getLayerObjectFromConfig(layerConfig);
						if (layerTitle == infoFeatureResponse.data.layerTitle){
							var layerFields = featureInfoConfig[layerConfig];
							console.log(layerTitle);
						}
					}
				}
			}

		}
	}

});
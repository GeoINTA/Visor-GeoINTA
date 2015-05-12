angular.module('visorINTA.tools.importWms.importWmsDirective', [])
.directive('importWmsTool', function($rootScope,ToolsManager,MapUtils,GeoServerUtils) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
			layersList:'='
		},
		templateUrl:"templates/tools/importWmsTemplate.html",
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


	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){

	        }

	        scope.importWMSLayer = function(){
	        	var newLayer = MapUtils.createWMSLayerObject({
	        			serverURL: scope.serverRequested,
	        			layerName: scope.layerSelected.name,
	        			layerTitle:scope.layerSelected.title,
	        			style: scope.styleSelected,
	        			visible:true,
	        			opacity:1
	        	});
	        	$rootScope.addImportedLayer(newLayer,"WMS");
	        	//scope.map.addLayer(newLayer);
	        	//$rootScope.addActiveLayer(newLayer);
	        	//console.log(scope.serverRequested);
	        	//console.log(scope.layerSelected);
	        	//console.log(scope.styleSelected);
	        }


		},
		controller: function($scope){
			$scope.toolName = "importWmsTool";
			$scope.toolTitle = "Importar capa WMS";

			$scope.serverCapabilities = {};
			$scope.serverRequested = "";
			$scope.layerSelected = {};
			$scope.styleSelected = [];

			$scope.loadServerCapabilities = function(){
				if ($scope.userServerURL){
					$scope.fullServerURL = 'http://' + $scope.userServerURL;
					var $btn = $('#loadCapabilitiesBtn').button('loading');
					$scope.serverCapabilities = {};
					$scope.serverCapabilities.layers = {};
					GeoServerUtils.getServerCapabilities($scope.fullServerURL)
					.success(function(data) {
			      		for (i in data.WMS_Capabilities.Capability.Layer.Layer){
			      			layerData = data.WMS_Capabilities.Capability.Layer.Layer[i];
			      			$scope.serverCapabilities.layers[layerData.Name] = {
			      					title:layerData.Title,
			      					name:layerData.Name,
			      					styles:[]
							};
							for (j in layerData.Style_asArray){
								styleData = layerData.Style_asArray[j];
								$scope.serverCapabilities.layers[layerData.Name].styles.push(styleData.Name);
							}
			      		}
			      		$scope.serverRequested = $scope.fullServerURL;
			      		//$scope.layerSelected = $scope.serverCapabilities.layers[0];
			      		//$scope.styleSelected = $scope.layerSelected.styles[0];

				    }).error(function(data, status) {
				      console.error('Error peticionando capacidades del servidor', status, data);
				    }).finally(function() {
					  $btn.button('reset');
					});
				}
			}

			$scope.setLayerSelected = function(layer){
				$scope.layerSelected = layer;
				$scope.styleSelected = $scope.layerSelected.styles[0];
			}

			$scope.setStyleSelected = function(style){
				$scope.styleSelected = style;
			}

		}
	}

});
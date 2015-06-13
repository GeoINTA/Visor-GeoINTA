angular.module('visorINTA.tools.importWms.importWmsDirective', [])
.directive('importWmsTool', function($rootScope,MapUtils,GeoServerUtils) {
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

			scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});


	        // Acciones a realizar cuando se abre la herramienta
	        scope.openBox = function(){
	        	if (!scope.serverList.length > 0){
	        		scope.serverList = $rootScope.getGeoServers();
	        	}
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeBox = function(){

	        }

	        scope.importWMSLayer = function(){
	        	var newLayer = MapUtils.createWMSLayerObject({
	        			serverURL: scope.serverRequested,
	        			layerOrigin: "IMPORTED",
	        			layerName: scope.layerSelected.name,
	        			layerTitle:scope.layerSelected.title,
	        			style: scope.styleSelected,
	        			visible:true,
	        			opacity:1
	        	});
	        	$rootScope.addImportedLayer(newLayer,"WMS");
	        }


	        scope.serverListSelected = function(serverUrl){
	        	needle = 'http://'; // string a quitar de la url
	        	pos = serverUrl.indexOf(needle);
	        	if (pos >= 0)
	        		serverUrl = serverUrl.substr(needle.length);
	        	scope.userServerURL = serverUrl;
	        }


		},
		controller: function($scope){
			$scope.toolName = "importWmsTool";
			$scope.toolTitle = "Importar capa WMS";

			$scope.serverList = [];
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
						if (data.WMS_Capabilities){ // Si servidor retorna error, no existe
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
				      		$scope.layerSelected = $scope.serverCapabilities.layers[Object.keys($scope.serverCapabilities.layers)[0]];
				      		$scope.styleSelected = $scope.layerSelected.styles[0];
				      		$scope.layerSelectdIndex = 0;
				      		$scope.styleSelectedIndex = 0;
			      		}

				    }).error(function(data, status) {
				      console.error('Error peticionando capacidades del servidor', status, data);
				    }).finally(function() {
					  $btn.button('reset');
					});
				}
			}

			$scope.setLayerSelected = function(layer,index){
				$scope.layerSelected = layer;
				$scope.styleSelected = $scope.layerSelected.styles[0];
				$scope.layerSelectdIndex = index;
				$scope.styleSelectedIndex = 0;
			}

			$scope.setStyleSelected = function(style,index){
				$scope.styleSelected = style;
				$scope.styleSelectedIndex = index;
			}

		}
	}

});
angular.module('visorINTA.directives.PrintManagerDirective', [])
.directive('printManager', function($rootScope, networkServices, MapUtils,$http) {
	return {
		restrict: 'EA',
		scope : {
			map:"=",
			layersList:"=",
			geoservers:"=",
			importedLayers: '='
		},
		templateUrl:"templates/menu/printManager.html",
		link: function(scope, iElement, iAttrs, ctrl) {

			var specBase = {
				    "attributes": {"map": {
				        "center": [],
				        "scale": 4000000,
				        "dpi": 150,
				        "layers": [],
				        "longitudeFirst": true,
				        "projection": "EPSG:4326"
				    }},
				    "layout": "main"
			}


			scope.getDefaultLayerParams = function(){
				return {
					type: "WMS",
					version:"1.1.1",
					customParams: {
						"EXCEPTIONS": "INIMAGE",
						"TRANSPARENT": "true"
					}
				}
			}

			
			scope.getMapCenter = function(){
				center = ol.proj.transform(scope.map.getView().getCenter(), 'EPSG:900913', 'EPSG:4326');;
				return center;
			}

			scope.getMapScale = function(){
			    var resolution = scope.map.getView().getResolution();
			    var units = scope.map.getView().getProjection().getUnits();
			    var dpi = 25.4 / 0.28;
			    var mpu = ol.proj.METERS_PER_UNIT[units];
			    var rawScale = resolution * mpu * 39.37 * dpi;
			    var scale = scope.mapServerScale(rawScale);
			    return scale;
			}

			// El servidor de impresion solo soporta ciertas escalas.
			// Dada una escala, esta funcion la mapea a la escala mas cercana
			// soportada por el servidor
			scope.mapServerScale = function(clientScale){
				if (!clientScale){
					return scope.serverPrintScales[0];
				} else {
					var candidate = null;;
					for (i in scope.serverPrintScales){
						if (scope.serverPrintScales[i] >= clientScale){
							candidate =  (i == 0) ? scope.serverPrintScales[0]: scope.serverPrintScales[i-1];
							return candidate;
						}
					}
					if (!candidate){
						return scope.serverPrintScales[scope.serverPrintScales.length - 1];
					}
				}
			}


			scope.getPrintableBaseLayer = function() {
				var tmpData = scope.getDefaultLayerParams();
				tmpData.layers = ['capabaseargenmap'];
				tmpData.baseURL = "http://wms.ign.gob.ar/geoserver/wms";
				return tmpData;
			}


			scope.getGridLayer = function(){
				grid =  {
				  "type": "grid",
				  "gridType": "points",
				  "numberOfLines": [2,2],
				  "renderAsSvg": true,
				  "haloColor" : "#CCFFCC",
				  "labelColor" : "black",
				  "labelFomat": "%251.0f %25s",
				  "indent": 10,
				  "haloRadius" : 4,
				  "font" : {
					"name" : ["Arial", "Helvetica", "Nimbus Sans L", "Liberation Sans", "FreeSans", "Sans-serif"],
					"size" : 8,
					"style" : "BOLD"
				  }
				}
				return grid;
			}


			scope.getPrintableLayersMetadata = function(){
				layersSpecMetadata = {"layers":[],"legends":[]};
				//printableLayers = scope.layersList.concat(scope.importedLayers);
				printableLayers = scope.layersList;
				if (scope.printGrid){
					layersSpecMetadata.layers.push(scope.getGridLayer());
				}
				for (var i=printableLayers.length; i--;){ // itero en reversa,
					if (printableLayers[i].getVisible()){
						layerInfo = MapUtils.getLayerParams(printableLayers[i].get('id'));
						// Solo agrego aquellas capas perteneciente a un geoserver geointa
						var geoserverInfo = (layerInfo["server"] == MapUtils.IMPORTED_LAYER_SERVER) 
											?  $rootScope.lookupGeoServer(printableLayers[i].get("sourceURL"),true)
											: $rootScope.lookupGeoServer(layerInfo['server'],false);
						if (geoserverInfo){
							var tmpData = scope.getDefaultLayerParams();
							tmpData.opacity = printableLayers[i].getOpacity();
							tmpData.layers = [layerInfo["layerName"]];
							tmpData.styles =  [layerInfo["layerStyle"]];
							tmpData.baseURL = geoserverInfo['url'];
							layersSpecMetadata.layers.push(tmpData);
							layersSpecMetadata.legends.push({
								'icons':[MapUtils.getLayerLegend(printableLayers[i])],
								'name': printableLayers[i].get('title'),
								'iconBeforeName':false
							})
					    }
					}
				}
				if (scope.printIncludeBaselayer){
					layersSpecMetadata.layers.push(scope.getPrintableBaseLayer());
				}
				return layersSpecMetadata;
			}

			scope.getMapTitle = function(){
				if (scope.printTitle){
					return scope.printTitle.substring(0, scope.TITLE_MAX_LENGTH);
				}
				return "";
			}

			scope.getMapDescription = function(){
				if (scope.printDescription){
					return scope.printDescription.substring(0, scope.DESCRIPTION_MAX_LENGTH);
				}
				return "";
			}

			scope.createSpec = function(){
				var spec = specBase;
				layersSpecMetadata = scope.getPrintableLayersMetadata();
				spec.attributes.map.layers = layersSpecMetadata.layers;
				//spec.legends[0].classes = layersSpecMetadata.legends;
				spec.attributes.title = scope.getMapTitle();
				spec.attributes.description = scope.getMapDescription();
				spec.attributes.map.center = scope.getMapCenter();
				spec.attributes.map.scale = scope.getMapScale();
				spec.showLegends = scope.printIncludeLegend || false;
				return spec;
			}

			scope.exportPDF = function(){
				scope.currentStatus = scope.status.BUSY;
				scope.reportCreated = false;
				scope.printStatusMessage = scope.getBusyLabel(0);
				//////////////
				newSpec = scope.createSpec();
				//console.log(newSpec);
				newSpecString = JSON.stringify(newSpec);
				$.ajax({
					type: "POST",
					url: networkServices.printServer + networkServices.printReportPath,
					data:newSpecString,
					dataType: 'json',
					//processData: false,
					//contentType: 'application/x-www-form-urlencoded',
					success: function(data){
						scope.reportData = data;
						scope.pollReport();
					},
					error: function(){
						scope.currentStatus = scope.status.IDLE;
					},
					// no existe callback finally?
	        	});
			}

			// Escanea status de un tabajo de impresion.
			// Brinda url de descarga al usuario cuando el mismo está listo.
			scope.pollReport = function(){
				var statusURL = scope.reportData.statusURL;
				$.ajax({
			            type: "GET",
			            url: networkServices.printServer + statusURL,
			            dataType: "json",
			            success: function (data) {
			                if (data.status == "finished"){
			                	scope.currentStatus = scope.status.READY;
			                	var downloadURL = networkServices.printServer + data.downloadURL;
								$('#exportPDFAnchor').attr({target: '_blank',
								href : downloadURL});
								scope.reportCreated = true;
								scope.currentStatus = scope.status.IDLE;
								scope.$apply();
			                } else {
			                	scope.printStatusMessage = scope.getBusyLabel(data.elapsedTime / 1000);
			                	scope.$apply();
			                	setTimeout(function () {
			                    scope.pollReport();
			                }, 1500)
			                }
			            },
			            error: function () {
			                setTimeout(function () {
			                    scope.pollReport();
			                }, 1500)
			            }
			        });
			}


			scope.cancelPDF = function(){
				//
			}

			scope.getBusyLabel = function(secs){
				return "Procesando... (" + secs.toFixed(2) +  "s)"; 
			}

		},
		controller: function($scope){

			$scope.TITLE_MAX_LENGTH = 40;
			$scope.DESCRIPTION_MAX_LENGTH = 400;

			$scope.status = {
				"IDLE": 0,
				"BUSY": 1,
			}

			$scope.labelsAvailable = true;

			$scope.currentStatus = $scope.status.IDLE;
			$scope.reportCreated = false;
			$scope.printStatusMessage = "Cancelar";

			$scope.reportData = {};

			// Escalas aceptadas por el servidor de impresion (geoserver printing)
			$scope.serverPrintScales = [5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 1000000, 2000000, 5000000, 10000000, 12000000, 15000000, 20000000, 25000000];
		},
	};
});

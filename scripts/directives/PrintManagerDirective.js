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

			var specLayout = "Visor Layout";

			var specBase = {
			    layout: "Visor Layout",
			    srs: "EPSG:4326",
			    units: "m",
			    geodetic: true,
			    outputFilename: "mapa-visorgeointa",
			    outputFormat: "pdf",
			    mergeableParams: {
			        cql_filter: {
			            defaultValue: "INCLUDE",
			            separator: ";",
			            context: "http://geointa.inta.gov.ar/geoserver/wms"
			        }
			    },
			    layers: [],
			    pages: [
			        {
			            center: [],
			            scale: 4000000.0,
			            dpi: 150,
			            geodetic: true,
			            strictEpsg4326: false,
			            mapTitle:"",
			            comment:""
			        }
			    ],
			    legends: [
			        /*{
			            classes: [
			                {
			                    icons: [
			                        "http://geointa.inta.gov.ar/geoserver/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&WIDTH=20&HEIGHT=20&VERSION=1.0.0&LAYER=imagenes%3ADelta%20Humedo&STYLE=delta_escenarios",
			                    ],
			                    name: "an icon name",
			                    iconBeforeName: true
			                }
			            ],
			            name: "a class name"
			        }*/
			    ]
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
				return {
						type: "WMS",
			            layers: ['capabaseargenmap'],
			            baseURL: "http://wms.ign.gob.ar/geoserver/wms",
			            format: "image/png"

				}
			}


			scope.getPrintableLayers = function(){
				layers = [];
				printableLayers = scope.layersList.concat(scope.importedLayers);
				console.log(printableLayers);
				for (i in printableLayers){
					if (printableLayers[i].getVisible()){
						layerInfo = MapUtils.getLayerParams(printableLayers[i].get('id'));
						// Solo agrego aquellas capas perteneciente a un geoserver geointa
						var geoserverInfo = $rootScope.lookupGeoServer(printableLayers[i].get('sourceURL'),true);
						if (geoserverInfo){
							layerData = {
								type:"WMS",
								opacity: printableLayers[i].getOpacity(),
								layers:[layerInfo["layerName"]],
								format:"image/png",
								styles: [layerInfo["layerStyle"]],
								baseURL:geoserverInfo['url'],

							}
							layers.push(layerData);
					    }
					}
				}
				if (scope.printIncludeBaselayer){
					layers.push(scope.getPrintableBaseLayer());
				}
				return layers;
			}

			scope.createSpec = function(){
				var spec = specBase;
				spec.layers = scope.getPrintableLayers();
				spec.pages[0].mapTitle = scope.printTitle;
				spec.pages[0].comment = scope.printDescription;
				spec.pages[0].center = scope.getMapCenter();
				spec.pages[0].scale = scope.getMapScale();
				return spec;
			}

			scope.exportPDF = function(){
				//////////////
				var $btn = $('#exportPDFBtn').button('loading');
				scope.pdfCreated = false;
				//////////////
				newSpec = scope.createSpec();
				console.log(newSpec);
				newSpecString = JSON.stringify(newSpec);
				$.ajax({
					type: "POST",
					url: networkServices.printServer + "/create.json",
					data:newSpecString,
					processData: false,
					contentType: 'application/x-www-form-urlencoded',
					success: function(data){
						$('#exportPDFAnchor').attr({target: '_blank',
						href : data.getURL});
						scope.pdfCreated = true;
						$btn.button('reset');
						scope.$apply();
					},
					error: function(){
						/*alert("error");
						$btn.button('reset');*/
						scope.pdfCreated = false;
						$btn.button('reset');
						scope.$apply();
					},
					// no existe callback finally?
	        	});
			}

		    scope.requestPDF = function(spec){
		    	return $http.post(networkServices.printServer + "/create.json?spec=" + spec, {
        		});
		    }
		},
		controller: function($scope){
			$scope.pdfCreated = false;

			// Escalas aceptadas por el servidor de impresion (geoserver printing)
			$scope.serverPrintScales = [25000,50000,100000,200000,500000,1000000,2000000,4000000,8000000];
		},
	};
});
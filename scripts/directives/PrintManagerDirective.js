angular.module('visorINTA.directives.PrintManagerDirective', [])
.directive('printManager', function($rootScope, networkServices, MapUtils,$http) {
	return {
		restrict: 'EA',
		scope : {
			map:"=",
			layersList:"=",
			geoservers:"=",
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
			    layers: [{
			            type: "WMS",
			            layers: ['topp:Departamentos'],
			            baseURL: "http://geointa.inta.gov.ar/geoserver/wms",
			            format: "image/png"
			        }],
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
			        {
			            classes: [
			                {
			                    icons: [
			                        "http://localhost:8000/geointa.png"
			                    ],
			                    name: "an icon name",
			                    iconBeforeName: true
			                }
			            ],
			            name: "a class nam"
			        }
			    ]
			}

			var spec = {
			    layout: "Visor Layout",
			    srs: "EPSG:4326",
			    units: "m",
			    geodetic: true,
			    outputFilename: "political-boundaries",
			    outputFormat: "pdf",
			    mergeableParams: {
			        cql_filter: {
			            defaultValue: "INCLUDE",
			            separator: ";",
			            context: "http://geointa.inta.gov.ar/geoserver/wms"
			        }
			    },
			    layers: [
			        {
			            type: "WMS",
			            layers: ['topp:Departamentos','geointa:lluvias_hoy'],
			            baseURL: "http://geointa.inta.gov.ar/geoserver/wms",
			            format: "image/png"
			        }
			    ],
			    pages: [
			        {
			            center: [-60.0,-34.2],
			            scale: 1000000,
			            dpi: 150,
			            geodetic: true,
			            strictEpsg4326: false,
			            mapTitle:"MAPITA",
			            comment:"COMENTARIO",
			        }
			    ],
			    legends: []
			}

			scope.getMapCenter = function(){
				center = ol.proj.transform(scope.map.getView().getCenter(), 'EPSG:900913', 'EPSG:4326');;
				return center;
			}


			scope.getPrintableBaseLayer = function() {
				return {
						type: "WMS",
			            layers: ['topp:Departamentos','geointa:lluvias_hoy'],
			            baseURL: "http://geointa.inta.gov.ar/geoserver/wms",
			            format: "image/png"

				}
			}


			scope.getPrintableLayers = function(){
				layers = [];
				for (i in scope.layersList){
					if (scope.layersList[i].getVisible()){
						layerInfo = MapUtils.getLayerParams(scope.layersList[i].get('id'));
						// Solo agrego aquellas capas perteneciente a un geoserver geointa
						var geoserverInfo = $rootScope.lookupGeoServer(layerInfo["server"]);
						if (geoserverInfo){
							layerData = {
								type:"WMS",
								layers:[layerInfo["layerName"]],
								format:"image/png",
								baseURL:geoserverInfo['url'],

							}
							layers.push(layerData);
					    }
					}
				}
				layers.push({
			            type: "WMS",
			            layers: ['topp:Departamentos','geointa:lluvias_hoy'],
			            baseURL: "http://geointa.inta.gov.ar/geoserver/wms",
			            format: "image/png"
			        });
				return layers;
			}

			scope.createSpec = function(){
				var spec = specBase;
				spec.layers = scope.getPrintableLayers();
				spec.pages[0].mapTitle = scope.printTitle;
				spec.pages[0].comment = scope.printDescription;
				spec.pages[0].center = scope.getMapCenter();
				console.log(spec);
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


				/*$.ajax({
			        url: networkServices.printServer + "/print.pdf?spec=" + newSpecString,
			        type: "GET",
			        method:'POST',
				params:{proxyParams:getUrlParams(infoUrl),contenttype:'text/html'},
			        processData: false,
			        contentType: 'application/json',
			        success: function (response) {
			        	console.log(response);
			        },
			        error: function(jqXHR, textStatus, errorThrown) {
			           console.log(textStatus, errorThrown);
			        }
			    });*/

		},
		controller: function($scope){
			$scope.pdfCreated = false;
		},
	};
});
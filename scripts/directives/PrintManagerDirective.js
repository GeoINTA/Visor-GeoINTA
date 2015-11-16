angular.module('visorINTA.directives.PrintManagerDirective', [])
.directive('printManager', function(networkServices, $http) {
	return {
		restrict: 'EA',
		scope : {
			map:"=",
			layersList:"=",
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
			            scale: 1000000,
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

			scope.getMapCenter = function(){
				center = ol.proj.transform(scope.map.getView().getCenter(), 'EPSG:900913', 'EPSG:4326');;

				console.log(center);
				return center;
			}

			scope.createSpec = function(){
				spec = specBase;
				spec.pages[0].mapTitle = scope.printTitle;
				spec.pages[0].comment = scope.printDescription;
				spec.pages[0].center = scope.getMapCenter();
				console.log(spec);
				return spec;
			}

			scope.exportPDF = function(){
				console.log(JSON.stringify(spec));
				newSpec = scope.createSpec();
				console.log(newSpec);
				newSpecString = JSON.stringify(spec);
				$.ajax({
					type: "POST",
					
					url: networkServices.printServer + "/create.json",
					data:newSpecString,
					processData: false,
					contentType: 'application/x-www-form-urlencoded',
					success: function(data){
					console.log(data);
					/*$('a#exportPDFURL').attr({target: '_blank',
					href : data.getURL});
					$btn.button('reset');
					$('#exportPDFURL').show();*/
					},
					error: function(){
					/*alert("error");
					$btn.button('reset');*/
					}
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
					
		},
	};
});
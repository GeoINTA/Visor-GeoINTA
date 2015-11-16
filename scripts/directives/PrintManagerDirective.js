angular.module('visorINTA.directives.PrintManagerDirective', [])
.directive('printManager', function(networkServices) {
	return {
		restrict: 'EA',
		scope : {
			layersList:"=",
		},
		templateUrl:"templates/menu/printManager.html",
		link: function(scope, iElement, iAttrs, ctrl) {


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
			            comment:"COMENTARIO"
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

			scope.exportPDF = function(){
				console.log(networkServices);
				console.log(JSON.stringify(spec));
				$.ajax({
			        url: networkServices.printServer + "/create.json",
			        type: "POST",
			        data: JSON.stringify(spec),
			        processData: false,
			        contentType: 'application/json',
			        success: function (response) {
			        	console.log(response);
			        },
			        error: function(jqXHR, textStatus, errorThrown) {
			           console.log(textStatus, errorThrown);
			        }
			    });
			}

		},
		controller: function($scope){
					
		},
	};
});
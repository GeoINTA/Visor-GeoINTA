angular.module('visorINTA.tools.region.RegionDirective', [])
.directive('regionTool', function($rootScope, MapUtils) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
			baseLayers: '=',
		},
		templateUrl:"templates/tools/regionTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.toolTitle);
			visorBoxCtrlr.setBoxType('tool');

			var map = scope.map;


			scope.$on('visorBoxEvent', function (event, data) {
				console.log(data);
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});

			
	        // Acciones a realizar cuando se abre la herramienta
	        scope.openBox = function(){
				scope.listenerClick = map.on('click', function(event) {
				  coordinate = event.coordinate;
				  raster.changed();
				});
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeBox = function(){
	        	if(scope.listenerClick){
	        		map.unByKey(scope.listenerClick);
	        	}
	        }

	        // NOCOMPILE
			function growRegion(inputs, data) {
			  var image = inputs[0];
			  var seed = data.pixel;
			  var delta = parseInt(data.delta);
			  if (!seed) {
			    return image;
			  }

			  seed = seed.map(Math.round);
			  var width = image.width;
			  var height = image.height;
			  var inputData = image.data;
			  var outputData = new Uint8ClampedArray(inputData);
			  var seedIdx = (seed[1] * width + seed[0]) * 4;
			  var seedR = inputData[seedIdx];
			  var seedG = inputData[seedIdx + 1];
			  var seedB = inputData[seedIdx + 2];
			  var edge = [seed];
			  while (edge.length) {
			    var newedge = [];
			    for (var i = 0, ii = edge.length; i < ii; i++) {
			      // As noted in the Raster source constructor, this function is provided
			      // using the `lib` option. Other functions will NOT be visible unless
			      // provided using the `lib` option.
			      var next = nextEdges(edge[i]);
			      for (var j = 0, jj = next.length; j < jj; j++) {
			        var s = next[j][0], t = next[j][1];
			        if (s >= 0 && s < width && t >= 0 && t < height) {
			          var ci = (t * width + s) * 4;
			          var cr = inputData[ci];
			          var cg = inputData[ci + 1];
			          var cb = inputData[ci + 2];
			          var ca = inputData[ci + 3];
			          // if alpha is zero, carry on
			          if (ca === 0) {
			            continue;
			          }
			          if (Math.abs(seedR - cr) < delta && Math.abs(seedG - cg) < delta &&
			              Math.abs(seedB - cb) < delta) {
			            outputData[ci] = 255;
			            outputData[ci + 1] = 0;
			            outputData[ci + 2] = 0;
			            outputData[ci + 3] = 255;
			            newedge.push([s, t]);
			          }
			          // mark as visited
			          inputData[ci + 3] = 0;
			        }
			      }
			    }
			    edge = newedge;
			  }
			  return new ImageData(outputData, width, height);
			}

			function next4Edges(edge) {
			  var x = edge[0], y = edge[1];
			  return [
			    [x + 1, y],
			    [x - 1, y],
			    [x, y + 1],
			    [x, y - 1]
			  ];
			}

			console.log(scope.baseLayers);
			var raster = new ol.source.Raster({
			  sources: [scope.baseLayers[0].getSource()],
				  operationType: 'image',
				  operation: growRegion,
				  // Functions in the `lib` object will be available to the operation run in
				  // the web worker.
				  lib: {
				    nextEdges: next4Edges
				  }
				});

			var rasterImage = new ol.layer.Image({
				  opacity: 0.7,
				  source: raster
			});

			map.addLayer(rasterImage);

			var coordinate;


			raster.on('beforeoperations', function(event) {
			  // the event.data object will be passed to operations
			  var data = event.data;
			  data.delta = thresholdControl.value;
			  if (coordinate) {
			    data.pixel = map.getPixelFromCoordinate(coordinate);
			  }
			});

			var thresholdControl = document.getElementById('regionTresholdRange');
			console.log(thresholdControl);

			function updateControlValue() {
			  //document.getElementById('threshold-value').innerText = thresholdControl.value;
			}
			updateControlValue();

			thresholdControl.addEventListener('input', function() {
			  updateControlValue();
			  raster.changed();
			});


		},
		controller: function($scope){
			$scope.toolName = "regionTool";
			$scope.toolTitle = "Marcador de regiones";

			$scope.listenerClick = null;

		}
	}

});
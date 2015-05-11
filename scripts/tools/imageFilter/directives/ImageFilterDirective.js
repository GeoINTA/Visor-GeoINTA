angular.module('visorINTA.tools.imageFilter.ImageFilterDirective', [])
.directive('imageFilterTool', function($rootScope,ToolsManager) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
			layerList:'='
		},
		templateUrl:"templates/tools/imageFilterTemplate.html",
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

	  		var map;

			
	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        	
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){

	        }

	        scope.applyFilter = function(filter,layer){
	        	kernel = scope.getFilterKernel(filter);
	        	scope.layerSelected = $rootScope.getLayerBy("title",layer);
	        	console.log(scope.layerSelected.get('title'));
	        	if (kernel){
		        	selectedKernel = scope.normalizeKernel(kernel);
	  				map.render();
					scope.layerSelected.on('postcompose', function(event) {
  						scope.convolve(event.context, selectedKernel);
					});
  				}
	        }

	        scope.convolve = function(context, kernel){
	        	console.log("convolve");
				var canvas = context.canvas;
				var width = canvas.width;
				var height = canvas.height;

				var size = Math.sqrt(kernel.length);
				var half = Math.floor(size / 2);

				var inputData = context.getImageData(0, 0, width, height).data;

				var output = context.createImageData(width, height);
				var outputData = output.data;

				for (var pixelY = 0; pixelY < height; ++pixelY) {
					var pixelsAbove = pixelY * width;
					for (var pixelX = 0; pixelX < width; ++pixelX) {
						var r = 0, g = 0, b = 0, a = 0;
						for (var kernelY = 0; kernelY < size; ++kernelY) {
							for (var kernelX = 0; kernelX < size; ++kernelX) {
								var weight = kernel[kernelY * size + kernelX];
								var neighborY = Math.min(
								height - 1, Math.max(0, pixelY + kernelY - half));
								var neighborX = Math.min(
								width - 1, Math.max(0, pixelX + kernelX - half));
								var inputIndex = (neighborY * width + neighborX) * 4;
								r += inputData[inputIndex] * weight;
								g += inputData[inputIndex + 1] * weight;
								b += inputData[inputIndex + 2] * weight;
								a += inputData[inputIndex + 3] * weight;
							}
						}
						var outputIndex = (pixelsAbove + pixelX) * 4;
						outputData[outputIndex] = r;
						outputData[outputIndex + 1] = g;
						outputData[outputIndex + 2] = b;
						outputData[outputIndex + 3] = kernel.normalized ? a : 255;
					}
				}
				context.putImageData(output, 0, 0);
	        }

	        scope.getFilterKernel = function(filterName){
	        	for (i in scope.filterTypes){
	        		filter = scope.filterTypes[i];
	        		if (filter.value == filterName){
	        			return filter.kernel;
	        		}
	        	}
	        	return null;
	        }

	        scope.normalizeKernel = function(kernel){	        	
				var len = kernel.length;
				var normal = new Array(len);
				var i, sum = 0;
				for (i = 0; i < len; ++i) {
					sum += kernel[i];
				}
				if (sum <= 0) {
					normal.normalized = false;
					sum = 1;
				} else {
					normal.normalized = true;
				}
				for (i = 0; i < len; ++i) {
					normal[i] = kernel[i] / sum;
				}
				return normal;
	        }

	        scope.getObjectLayerSelected = function(){
	        	if (scope.layerSelected){
	        		return $rootScope.getLayerByTitle(scope.layerSelected);
	        	}
	        	return null;
	        }

	        scope.init = function(){
	        	map = scope.map;
	  		}

	        scope.init();

            
		},
		controller: function($scope){
			$scope.toolName = "imageFilterTool";
			$scope.toolTitle = "Aplicar filtro";
			$scope.layerSelected = {};
			$scope.filterSelected = "none";

			$scope.filterTypes = [
				{
					value:"none",
					title:"Ninguno",
					kernel:[
					    0, 0, 0,
					    0, 0, 0,
					    0, 0, 0
					  ]
				},
				{
					value:"sharpen",
					title:"Sharpen",
					kernel:[
					    0, -1, 0,
					    -1, 5, -1,
					    0, -1, 0
					  ]
				},
				{
					value:"sharpenless",
					title:"Sharpenless",
					kernel:[
					    0, -1, 0,
					    -1, 10, -1,
					    0, -1, 0
					  ]
				},
				{
					value:"blur",
					title:"Blur",
					kernel:[
						1, 1, 1,
						1, 1, 1,
						1, 1, 1
					  ]
				},
				{
					value:"shadow",
					title:"Shadow",
					kernel:[
						1, 2, 1,
						0, 1, 0,
						-1, -2, -1	
					  ]
				},
				{
					value:"emboss",
					title:"Realce",
					kernel:[
						-2, 1, 0,
						-1, 1, 1,
						0, 1, 2
					  ]
				},
				{
					value:"edgedetect",
					title:"Deteccion de bordes",
					kernel:[
						0, 1, 0,
						1, -4, 1,
						0, 1, 0
					  ]
				},
			];
		}
	}

});
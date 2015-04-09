angular.module('visorINTA.tools.spyLayer.SpyLayerDirective', [])
.directive('spyLayerTool', function($rootScope,$timeout,ToolsManager) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
			layerList:'='
		},
		templateUrl:"templates/tools/spyLayerTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.toolTitle);
			visorBoxCtrlr.setBoxType('tool');
			var map;
			var radius;
			var mousePosition = null;

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

	  		scope.layerSelectedChange = function(newLayer){
	  				scope.unbindLayerListening();
	  				scope.layerSelected = newLayer;
	  				scope.addSpyLayerToMap();
	  		}



	        scope.addSpyLayerToMap = function(){
	        	layer = scope.getObjectLayerSelected();
				$(map.getViewport()).on('mousemove', function(evt) {
				  mousePosition = map.getEventPixel(evt.originalEvent);
				  map.render();
				}).on('mouseout', function() {
				  mousePosition = null;
				  map.render();
				});
	        	// before rendering the layer, do some clipping
				layer.on('precompose', scope.onPreCompose);

				// after rendering the layer, restore the canvas context
				layer.on('postcompose', scope.onPostCompose);
	        }

	        scope.onPreCompose = function(event){
				var ctx = event.context;
				var pixelRatio = event.frameState.pixelRatio;
				ctx.save();
				ctx.beginPath();
				if (mousePosition) {
				// only show a circle around the mouse
				ctx.arc(mousePosition[0] * pixelRatio, mousePosition[1] * pixelRatio,
				    75 * pixelRatio, 0, 2 * Math.PI);
				ctx.lineWidth = 5 * pixelRatio;
				ctx.strokeStyle = 'rgba(0,0,0,0.5)';
				ctx.stroke();
				}
				ctx.clip();
	        }

	        scope.onPostCompose = function(event){
				  var ctx = event.context;
				  ctx.restore();
	        }

	        // Metodo que hace que la capa seleccionada deje de escuchar los eventos
	        // 'precompose' y 'postcompose'
	        scope.unbindLayerListening = function(){
	        	layer = scope.getObjectLayerSelected();
	        	layer.un('precompose',scope.onPreCompose);
	        	layer.un('postcompose',scope.onPostCompose);
	        }
	        

	        scope.getObjectLayerSelected = function(){
	        	if (scope.layerSelected){
	        		return $rootScope.getLayerByName(scope.layerSelected);
	        	}
	        	return null;
	        }

	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        	if (scope.layerList.length){
	        		scope.layerSelected = scope.layerList[0].get('name');
	        		scope.addSpyLayerToMap();
	        	}	
	        }


	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){
	        	scope.unbindLayerListening();
	        }

	        scope.init = function(){
	        	map = scope.map;
	        	radius = 75;
	  		}

	        scope.init();

		},
		controller: function($scope){
			$scope.toolName = "spyLayerTool";
			$scope.toolTitle = "Espiar capa";
			$scope.layerSelected = "";
		}
	}

});
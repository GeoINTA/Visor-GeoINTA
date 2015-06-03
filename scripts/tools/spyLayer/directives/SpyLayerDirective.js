angular.module('visorINTA.tools.spyLayer.SpyLayerDirective', [])
.directive('spyLayerTool', function($rootScope,$timeout) {
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

			scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
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
	        	if (layer){
	        		layer.un('precompose',scope.onPreCompose);
	        		layer.un('postcompose',scope.onPostCompose);
	        	}
	        }
	        

	        scope.getObjectLayerSelected = function(){
	        	if (scope.layerSelected){
	        		return $rootScope.getLayerBy("title",scope.layerSelected);
	        	}
	        	return null;
	        }

	        // Acciones a realizar cuando se abre la herramienta
	        scope.openBox = function(){
	        	if (scope.layerList.length){
	        		scope.layerSelected = scope.layerList[0].get('title');
	        		scope.addSpyLayerToMap();
	        	}	
	        }


	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeBox = function(){
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
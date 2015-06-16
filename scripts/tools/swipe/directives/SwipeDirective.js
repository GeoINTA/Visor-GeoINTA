angular.module('visorINTA.tools.swipe.SwipeDirective', [])
.directive('swipeTool', function($rootScope) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
			layerList:'='
		},
		templateUrl:"templates/tools/swipeTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.toolTitle);
			visorBoxCtrlr.setBoxType('tool');

			var map;
            scope.swipe = $('#swipeRange');

            scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});


	        scope.addSwipeToMap = function(){
	        	layer = scope.getObjectLayerSelected();
	        	if (layer){
					layer.on('precompose', scope.onPreCompose);
					layer.on('postcompose', scope.onPostCompose);
				}
	        }

	  		scope.layerSelectedChange = function(newLayer){
  				scope.unbindLayerListening();
  				scope.layerSelected = newLayer;
  				scope.addSwipeToMap();
	  		}

	        scope.unbindLayerListening = function(){
	        	layer = scope.getObjectLayerSelected();
	        	if (layer){
	        		layer.un('precompose',scope.onPreCompose);
	        		layer.un('postcompose',scope.onPostCompose);
	        	}
	        }

	        scope.onPreCompose = function(event){
	        	var ctx = event.context;
				var width = ctx.canvas.width * ($('#swipeRange').val() / 100);
				ctx.save();
				ctx.beginPath();
				ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
				ctx.clip();
	        }


	        scope.onPostCompose = function(event){
	        	var ctx = event.context;
				ctx.restore();
	        }

	        scope.getObjectLayerSelected = function(){
	        	if (scope.layerSelected){
	        		return $rootScope.getLayerBy("title",scope.layerSelected);
	        	}
	        	return null;
	        }


	        // Acciones a realizar cuando se abre la herramienta
	        scope.openBox = function(){
	        	$("#swipeRange").on("input change", function() {
	        	  console.log('change');
				  map.render();
	        	});
	        	if (scope.layerList.length){
	        		scope.layerSelected = scope.layerList[0].get('title');
	        		scope.addSwipeToMap();
	        	}	
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeBox = function(){
	        	scope.unbindLayerListening();
	        }

	        scope.init = function(){
	        	map = scope.map
	  		}

	        scope.init();

		},
		controller: function($scope){
			$scope.toolName = "swipeTool";
			$scope.toolTitle = "Cortina";
			$scope.layerSelected = "";
		}
	}

});
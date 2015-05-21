angular.module('visorINTA.directives.LayerMenuListDirective', [])
.directive('layerMenuList', function($timeout,MapUtils) {
	return {
		restrict: 'EA',
		scope : {
			map : '=map',
			layersList:"=",
			showCheckbox:"="
		},
		templateUrl:"templates/menu/layerMenuList.html",
		//template:"<li class='list-group-item' ng-repeat='layer in reverse(layersNames)'>{{layer}}</li>",
		link: function(scope, iElement, iAttrs, ctrl) {
			bindLayersControls();
			

			scope.$watchCollection('layersList', function(newValue, oldValue) {
                if (newValue === oldValue){ // al inicio, los dos tienen el mismo valor
      				return;
				};
            	bindLayersControls();
            });


            function bindLayersControls(){
            	$timeout(function(){
		            	for (var i = 0 ; i < scope.layersList.length; i++){
							var layerObject = scope.layersList[i];
							var element = document.getElementById('opacity' + layerObject.get('title'));
							$(element).on("change", function() {
								layer = MapUtils.getLayerByTitle(scope.map,$(this).attr('name'));
		      					layer.setOpacity($(this).val()); // max = 1, min = 0
		    				});
							if (scope.showCheckbox){
								var inputCheck = document.getElementById("chck" + layerObject.get('title'));
								inputCheck.addEventListener('change', function() {
								  var checked = this.checked;
								  layer = MapUtils.getLayerByTitle(scope.map,$(this).attr('name'));
								  if (checked !== layer.getVisible()) {
								    layer.setVisible(checked);
								  }
								});

								layerObject.on('change:visible', function() {
								  var visible = this.getVisible();
								  inputCheck = document.getElementById("chck" + this.get('title'));
								  if (inputCheck && (visible !== inputCheck.checked)) {
								    inputCheck.checked = visible;
								  }
								});
							}
						}
            	});
            };
      		
		},
		controller: function($scope){
			$scope.reverse = function(array) {
	            var copy = [].concat(array);
	            return copy.reverse();
        	}

        	$scope.getLayerNames = function(){
        		var names = [];
        		for (var i = $scope.layersList.length - 1; i >= 0  ; i--){
        			names.push($scope.layersList[i].get('title'));
        		}
        		return names;
        	}
 

  		},

	}
});
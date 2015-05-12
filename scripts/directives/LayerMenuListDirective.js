angular.module('visorINTA.directives.LayerMenuListDirective', [])
.directive('layerMenuList', function($timeout) {
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
					var opacity = new ol.dom.Input(document.getElementById('opacity' + layerObject.get('title')));
					
					opacity.bindTo('value', layerObject, 'opacity').transform(parseFloat, String);
					if (scope.showCheckbox){
						var inputCheck = new ol.dom.Input(document.getElementById("chck" + layerObject.get('title')));
						inputCheck.bindTo('checked', layerObject, 'visible');	
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
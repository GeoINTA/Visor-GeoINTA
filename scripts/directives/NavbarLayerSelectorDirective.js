angular.module('visorINTA.directives.NavbarLayerSelectorDirective', [])
.directive('navbarLayerSelector', function() {
	return {
		restrict: 'EA',
		scope : {
			layersList:"=",
		},
		templateUrl:"templates/navbarLayerSelector.html",
		link: function(scope, iElement, iAttrs, ctrl) {


		    scope.updateBaseLayer = function(){
		    	baseLayerSelected = scope.baseLayerSelected;
		    	if (baseLayerSelected != ""){
		    		for (var i = 0 ; i < scope.layersList.length ; i++){
		    			layer = scope.layersList[i];
		    			console.log(layer.get('title') == baseLayerSelected);
		    			layer.setVisible(layer.get('title') == baseLayerSelected);
		    		}
		    	}
		    }
		},
		controller: function($scope){

			$scope.baseLayerSelected = $scope.layersList[0].get('title');

			for (var i = 0 ; i < $scope.layersList.length ; i++){
				console.log($scope.layersList[i].get('title'));
			}
		},
	};
});
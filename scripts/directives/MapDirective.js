angular.module('visorINTA.directives.mapDirective', [])
  .directive('visorMap', function() {
  	return {
  		restrict: 'EA',
  		scope :{
  			mapconfig:'=',
  			map:'=',
  		},
		link: function(scope, element, attrs) {
			var map = scope.map;
			var view = scope.map.getView();
			map.setTarget(element[0]);
		},
  		controller: function($scope){
  		},
	}
});
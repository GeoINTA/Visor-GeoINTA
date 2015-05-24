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

      scope.updateMapPositions = function(){
         var newHeight = $('body').height() - $('#visorHeader').outerHeight();
         $(element[0]).height(newHeight);
         // Controles
         $('.visor-mouse-position').css({left:($('.ol-scale-line').position().right + 15)});
      }

      scope.updateMapPositions();

      $( window ).resize(function() {
        scope.updateMapPositions();
      });

		},
  		controller: function($scope){
  		},
	}
});
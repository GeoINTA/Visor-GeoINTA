angular.module('visorINTA.directives.mapDirective', [])
  .directive('visorMap', function() {
  	return {
  		restrict: 'EA',
  		scope :{
  			mapconfig:'=',
  			map:'=',
  		},
		link: function(scope, element, attrs) {

      // Define alto y largo del mapa principal
      scope.calcMapDimensions = function(){
         var newHeight = $('body').height() - $('#visorHeader').outerHeight();
         $(element[0]).height(newHeight);
      }

      // Actualiza posiciones de los controles del mapa
      scope.updateMapPositions = function(){
         $('.visor-mouse-position').css({left:($('.ol-scale-line').position().right + 15)});
      }


      var map = scope.map;
      var view = scope.map.getView();

      // Agrego controles al mapa
      var fullScreen = new ol.control.FullScreen();
      var mousePosition = new ol.control.MousePosition({
              coordinateFormat: ol.coordinate.createStringXY(4),
              projection: 'EPSG:4326',
              undefinedHTML: '&nbsp;',
              className:'visor-mouse-position'
      });
      var scaleLine =  new ol.control.ScaleLine();
      
      map.addControl(fullScreen);
      map.addControl(mousePosition);
      map.addControl(scaleLine);

     
      // // // // // //
      scope.calcMapDimensions();
      map.setTarget(element[0]);
      scope.updateMapPositions();

      $( window ).resize(function() {
        scope.calcMapDimensions();
        scope.updateMapPositions();
      });

		},
  		controller: function($scope){
  		},
	}
});
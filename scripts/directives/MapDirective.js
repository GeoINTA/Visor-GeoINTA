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
        var leftOffset = -140; // px que quiero correr a la izq los controles
        var fullWidth = $(window).width();
        $('.ol-scale-line').css({left:(fullWidth/2)+leftOffset+140});
        $('.visor-mouse-position').css({left:(fullWidth/2)+leftOffset});
        /*$('.visor-mouse-position').position({
            my:        "top bottom",
            at:        "right bottom",
            of:        $('.ol-scale-line'), // or $("#otherdiv)
            collision: "fit"
        })*/
      }

      // Inicia plugin OLGM (mapas de google dentro de Openlayers)
      scope.initOLGM = function(){
        var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
        olGM.activate();
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

      scope.initOLGM();
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
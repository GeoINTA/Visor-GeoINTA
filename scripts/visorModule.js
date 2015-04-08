angular.module('visorINTA', [
  "visorINTA.MainController",
  "ngRoute",
  'ngSanitize',
  'ngAnimate',
  'ngQuantum',
  "visorINTA.factories.ProyectsFactory",
  "visorINTA.directives.menudirectives",
  "visorINTA.directives.mapDirective",
  "visorINTA.directives.LayerMenuListDirective",
  "visorINTA.directives.LayersTreeDirective",
  "visorINTA.directives.ProyectListDirective",
  "visorINTA.utils.MapUtilsService",
  "visorINTA.tools.toolsModule"

]).config(['$routeProvider', function ($routeProvider) {
   $routeProvider.when('/:lat?/:lng?/:zoom?',          {templateUrl: "./templates/home.html"});
   $routeProvider.otherwise({redirectTo: '/'});
   
}]).constant("mapConfig", {
      center: [-6673603.47305675,-4154372.4878888335],
      projection: 'EPSG:900913',
      displayProjection :'EPSG:4326',
      zoom:4,
    })
    .constant("networkServices",{
        "gestor": "http://geointa.inta.gov.ar/gestor/servicioVisor"
    });
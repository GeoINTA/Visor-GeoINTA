angular.module('visorINTA', [
  "visorINTA.MainController",
  "visorINTA.SearchController",
  "ngRoute",
  'ngSanitize',
  'ngAnimate',
  'ngQuantum',
  'ui.mask',
  "visorINTA.factories.ProyectsFactory",
  "visorINTA.factories.MainInterceptor",
  "visorINTA.directives.menudirectives",
  "visorINTA.directives.NavbarSearchDirective",
  'visorINTA.directives.SearchInfoBoxDirective',
  "visorINTA.directives.LayerInfoBoxDirective",
  "visorINTA.directives.NavbarLayerSelectorDirective",
  "visorINTA.directives.PrintManagerDirective",
  "visorINTA.directives.mapDirective",
  "visorINTA.directives.LayerMenuListDirective",
  "visorINTA.directives.LayersTreeDirective",
  "visorINTA.directives.ProyectListDirective",
  "visorINTA.directives.VisorBoxDirective",
  "visorINTA.utils.LayerUtilsService",
  "visorINTA.utils.MapUtilsService",
  "visorINTA.utils.ProyectUtilsService",
  "visorINTA.utils.GeoServerService",
  "visorINTA.utils.SearchService",
  "visorINTA.tools.toolsModule",
  'bootstrapLightbox',
])
.config(['$locationProvider','$routeProvider','$httpProvider', function ($locationProvider,$routeProvider,$httpProvider) {
   $locationProvider.html5Mode({
       enabled: true,
       requireBase: false
   });
   $routeProvider.otherwise({redirectTo: '/'});
   $httpProvider.interceptors.push('MainInterceptor');
   
}])
.constant("mapConfig", {
      center: [-6673603.47305675,-4154372.4878888335],
      projection: 'EPSG:900913',
      displayProjection :'EPSG:4326',
      zoom:4,
      baseResolutions: [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875, 305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219, 19.109257067871095, 9.554628533935547, 4.777314266967774, 2.388657133483887, 1.1943285667419434, 0.5971642833709717]
})
.constant("networkServices",{
        "proxyUrl" : "http://visor.geointa.inta.gob.ar/proxy.php",
        //"proxyUrl":"http://localhost/neo_visor_new/proxy.php",
        "gestor": "http://geointa.inta.gov.ar/gestor/servicioVisor",
        "searchService": " http://geointa.inta.gov.ar/visor/nomenclador/nomenclador.php",
        "printServer": "http://visor.geointa.inta.gob.ar",
        "printReportPath": "/mapfish/print/simple/report.pdf"
})
.constant("boxActions",{
    "OPEN" : "open",
    "CLOSE" : "close",
    "TOOGLE" : "toogle"
});

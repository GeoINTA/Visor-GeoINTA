angular.module('visorINTA.MainController', [])
  .controller('MainController', ['$rootScope','$scope','$loading','mapConfig','ProyectsFactory','MapUtils', function($rootScope,$scope,$loading,mapConfig,ProyectsFactory,MapUtils) {

    // Layers
    // El mapa guarda tres grupos de capas:
    //    - Capas base
    //    - Capas no base (capas insertadas en el mapa, no base)
    //          - De estas capas "no base", algunas pueden estar visibles, y otras no.
    //            Las que estan visibles, se guardan dentro de la variable activeLayers
    //    - Capas importadas (capas agregadas por el usuario, no pertenecen a un proyecto en particular).

    $scope.baseLayers = []; // capas base del mapa
    $scope.mapLayers = []; // todas las capas (no base) del mapa, indepte de si estan activas (visibles) o no.
                           // cuando se carga un proyecto, todas las capas se cargan aqui.
    $scope.activeLayers = []; // capas (no base) activas actualmente.

    // Proyects
    $scope.proyects = []; // lista de todos los proyectos disponibles
    $scope.activeProyect = {}; //almacena objeto que se corresponde con el proyecto activo
    $scope.proyectsModel = {}; // modelos de los proyectos del sistema (contiene capas, modelo, y config. de capas para cada uno).
                                // de toda la lista de proyectos, se va pidiendo su modelo "on-demand" al servicio correspondiente.
    $scope.activeProyectModel = {}; // modelo del proyecto activo

    // Servers
    $scope.geoServers = {} // contiene la lista de servidores disponibles. Cada server contiene su URL, y una URL cache                               


    $scope.loading = new $loading({
                busyText: 'Cargando proyecto...',
                theme: 'success',
                timeout: false,
                //delayHide:1000,
                showSpinner: true,
    });

    $scope.proyectos = function() {
      console.log("proyectos");
    };
 
    $scope.capas = function() {
         console.log("capas");     
    };
 
    $scope.herramientas = function() {
        console.log("herramientas");
    };


    $scope.getBaseLayersGroup = function(){
      console.log("Base layers");

    }

    var createMap = function(){
      var layers = [];
      var layer1 = new ol.layer.Tile({
              preload: 4,
              source: new ol.source.OSM(),
              name:"OSM GO",
          });
      var layer2 = new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'}),
            name: "Satelite",
      });
      layers.push(layer1);
      layers.push(layer2);
      var baseLayers = new ol.layer.Group({nombre:'baseLayers',layers:layers});
      var map = new ol.Map({
        controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            undefinedHTML: '&nbsp;'
          })
      ]),
        layers: [
          layer1,
          layer2
        ],
        projection:mapConfig.projection,
        displayProjection:mapConfig.displayProjection,
        view: new ol.View({
          center: mapConfig.center,
          zoom: mapConfig.zoom
        }),
      });
      $scope.baseLayers.push(layer1);
      $scope.baseLayers.push(layer2);
      return map;  
    }




    $scope.addLayerToMap = function(){

    }


    $scope.updateActiveLayersToMenu = function(){
        console.log("ACTUALIZANDO");
    }

    $scope.buscar = function(){
      alert($scope.activeProyect.nombre);
      console.log($scope);
    }

    // Reseteo el estado del mapa
    // Deja activas solo las capas base
    // Limpia variables
    $scope.cleanMap = function(){
      $scope.activeLayers = [];
    }


    $scope.loadActiveProyectLayers = function(){
      $scope.cleanMap();
      console.log($scope.mapLayers);
      for (var i=0; i < $scope.activeProyectModel.capas.length;i++){
        layerConfig = $scope.activeProyectModel.capasConfig[$scope.activeProyectModel.capas[i]];
        tripleta = $scope.activeProyectModel.capas[i].split("::");
        nombreServidor = tripleta[0];
        server = $scope.lookupGeoServer(nombreServidor);
        nombreCapa = tripleta[1];
        nombreEstilo = (tripleta[2] == "SIN_ESTILO") ? "" : tripleta[2];
        if(server.urlCache && layerConfig.useCache == "true"){
            urlServidor = server.urlCache;
        } else {
            urlServidor = server.url;
        }
        extent = [$scope.activeProyectModel.modelo[0].oeste,$scope.activeProyectModel.modelo[0].sur,$scope.activeProyectModel.modelo[0].este,$scope.activeProyectModel.modelo[0].norte];
        extentGoogle = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:900913"));
        //bbox_rep = $scope.map.getView()getMaxExtent();
        //if($scope.map.getLayersByName($scope.activeProyectModel.capas[i]).length == 0){
         // layer_temp = new OpenLayers.Layer.WMS($scope.activeProyectModel.capas[i],urlServidor,{layers: nombreCapa,transparent: true,styles:nombreEstilo}, {opacity:1,visibility: true});
          layer_temp = new ol.layer.Tile({
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                  url: urlServidor,
                  params: {'LAYERS': nombreCapa, 'TILED': true,'VERSION':'1.1.1','SRS':'900913'},
                  serverType: 'geoserver'
                })),
                opacity:1,
                visible: false,
                name: $scope.activeProyectModel.capasConfig[$scope.activeProyectModel.capas[i]].nombre,
              })
          $scope.map.addLayer(layer_temp); 
          $scope.mapLayers.push(layer_temp);
          //$scope.activeLayers.push(layer_temp);
          //$scope.map.getView().fitExtent(extentGoogle, $scope.map.getSize());
        //}
      }
    }

    // Se fija en la variable geoServers, si existe el servidor con el nombre pasado como parametro.
    // Si existe, retorna un objecto con sus propiedades correspondientes, sino, retorna null.
    $scope.lookupGeoServer = function(name){
      for (var i = 0 ; i < $scope.geoServers.length; i++) {
         if ($scope.geoServers[i].nombre == name){
            return $scope.geoServers[i];
         }
       }
       return null; 
    }


    // Se fija en la variable {proyectsConfig} si ya se tiene la configuracion del proyecto pedido.
    // retorna null si no se la tiene
    $scope.getProyectModel = function(id){
        $scope.loading.show();
        var model = $scope.proyectsModel[id] || null;
        if (model == null){
           model = $scope.requestProyectModel(id);
           $scope.proyectsModel[$scope.activeProyect.id]  = model; // guardo el nuevo modelo pedido, para no volver a pedirlo en el futuro
        }
        $scope.loading.hide();
        return model;
    }


    $scope.requestProyectModel = function(id){
      return ProyectsFactory.getProyect(id);
    }

    // El proyecto activo se mantiene en la variable {activeProyect}.
    // Cuando este cambia hay que:
    //    - Actualizar el modelo correspondiente al proyecto activo.
    //        (el modelo, esta compuesto por las claves "modelo" (el arbol),"capas" y "capasConfig").
    //        - Para ello, hay que pedirselo al gestor (si aún no se lo a hecho).
    //         (se guardan los modelos de cada proyecto ya pedidos al gestor en la variable
    //          {proyectsModel}).
    //    - Una vez obtenido el modelo:
    //          - Limpiar el mapa (sacar capas de los modelos anteriores, dejar solo las base)
    //          - Agregar 
    $scope.updateActiveProyect = function(){
        $scope.activeProyectModel = $scope.getProyectModel($scope.activeProyect.id);
        $scope.loadActiveProyectLayers();

    }

    //// ROOT FUNCTIONS ///


    $rootScope.addActiveLayer = function(layer){
      if (layer){
          $scope.activeLayers.push(layer);
          if (!layer.getVisible()){
            layer.setVisible(true);
          }
          $scope.$apply();
      }
    }


    $rootScope.removeActiveLayer = function(layer){
        for (var i = 0; i < $scope.activeLayers.length; i++) {
            tmpLayer = $scope.activeLayers[i];
            if (tmpLayer.get('name') == layer.get('name')){
              $scope.activeLayers.splice(i,1);
            }
        }
        $scope.$apply();
    }

    //      ###       WATCHERS       ###      //

    // watch cambio de proyecto activo
    $scope.$watch("activeProyect", function(newProyect, oldProyect){
        if (newProyect === oldProyect){ // al inicio, los dos tienen el mismo valor
          return;
        }
        $scope.updateActiveProyect();
    });



    $scope.map = createMap();
    $scope.proyects = ProyectsFactory.getProyects();
    $scope.geoServers = ProyectsFactory.getGeoServers();



}]);
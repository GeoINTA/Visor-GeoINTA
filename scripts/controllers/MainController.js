angular.module('visorINTA.MainController', [])
  .controller('MainController', ['$rootScope','$location','$scope','$loading','$timeout','mapConfig','ProyectsFactory','MapUtils','ProyectUtils', function($rootScope,$location,$scope,$loading,$timeout,mapConfig,ProyectsFactory,MapUtils,ProyectUtils) {
    
    // Layers

    $scope.baseLayers = []; // capas base del mapa
    $scope.proyectLayers = [];  // cuando se carga un proyecto, todas las capas se cargan aqui.
    $scope.activeLayers = []; // capas (no base) activas actualmente.
    $scope.importedLayers = []; // capas importadas por el usuario

    // Proyects
    $scope.proyects = []; // lista de todos los proyectos disponibles
    $scope.activeProyect = {}; //almacena objeto que se corresponde con el proyecto activo
    $scope.proyectsModel = {}; // modelos de los proyectos del sistema (contiene capas, modelo, y config. de capas para cada uno).
                                // de toda la lista de proyectos, se va pidiendo su modelo "on-demand" al servicio correspondiente.
    $scope.activeProyectModel = {}; // modelo del proyecto activo

    // Servers
    $scope.geoServers = {} // contiene la lista de servidores disponibles. Cada server contiene su URL, y una URL cache                               


    // Info Layer
    $scope.layerInfoActive = [];

    // DEBUGGING
    $scope.verboseMode = true;

    $scope.bingKey = 'An980uGYXOk9yd-vHLUeV2J_ebho9xTXZObprH56yX3FQrhw_FxHYBPQVVvB4TG8';


    $scope.loading = new $loading({
                busyText: 'Cargando proyecto...',
                theme: 'primary',
                timeout: false,
                //delayHide:1000,
                showSpinner: true,
    });


    $scope.getBaseLayersGroup = function(){
      console.log("Base layers");

    }

    // QUERY URL -
    // Funciones que manipulan valores recibidios en el query de la url


    // Obtiene valores del query recibido en la pagina
    // Se fija la existencia de valores específicos, necesarios (opcionales) para la app
    // lat y lng deben ser valores en proyeccion EPSG:4326
    $scope.getQueryValues = function(){
      $scope.queryValues = {};
      $scope.queryValues['proyectID'] = parseInt($location.search().p) || null;
      // Coords
      $scope.queryValues['lat'] = parseFloat($location.search().lat) || null;
      $scope.queryValues['lng'] = parseFloat($location.search().lng) || null;
      $scope.queryValues['zoom'] = null;
    }

    $scope.validateMapQueryValues = function(){
      if (!MapUtils.validateCoordinates($scope.queryValues['lat'],$scope.queryValues['lng'])){
        $scope.queryValues['lat'] = null;
        $scope.queryValues['lng'] = null;
      }
      $scope.queryValues['zoom'] = parseInt($location.search().z) || null;
      if ($scope.queryValues['zoom'] < 0 || $scope.queryValues['zoom'] > 16){
        $scope.queryValues['zoom'] = null;
      }
    }


    $scope.checkInitProyectLoad = function(){
      if ($scope.queryValues['proyectID']){
        $scope.activeProyect.id = $scope.queryValues['proyectID'];
        $scope.requestActiveProyect();
      }
    }

    // Se fija si se recibieron en el query parametros de lat y lng.
    // En ese caso, retorna una tupla de la forma [] 
    $scope.getInitMapCenter = function(projectionTransform){
      center = null;
      if ($scope.queryValues['lat'] && $scope.queryValues['lng']){
          center = [$scope.queryValues['lat'],$scope.queryValues['lng']];
          if (projectionTransform){
            center = ol.proj.transform(center, 'EPSG:4326', projectionTransform);
      }
      return center;  
      }
   }

    $scope.getInitMapZoom = function(){
      return $scope.queryValues['zoom'];
    }

    var createMap = function(){
      var layers = [];
      var osm = new ol.layer.Tile({
              preload: 4,
              source: new ol.source.OSM(),
              title:"Open Street Map",
              id:MapUtils.constructLayerIdentifier("BASE","base_layer_OSM","no_style"),
              visible:false
          });
      var aerial = new ol.layer.Tile({
                source: new ol.source.BingMaps({
                  key: $scope.bingKey,
                  imagerySet: 'Aerial'
                }),
                title:"Bing Aereo",
                id:MapUtils.constructLayerIdentifier("BASE","bing_aerial","no_style"),
                visible:true,
                opacity:1,
      })
      var labelsAerial = new ol.layer.Tile({
                source: new ol.source.BingMaps({
                  key: $scope.bingKey,
                  imagerySet: 'AerialWithLabels'
                }),
                title:"Bing Aereo con etiquetas",
                id:MapUtils.constructLayerIdentifier("BASE","bing_aerial_labels","no_style"),
                visible:false,
                opacity:1,
            })
      var argenmap = new ol.layer.Tile({
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                  url: "http://wms.ign.gob.ar/geoserver/wms",
                  params: {'LAYERS': "capabaseargenmap", 'TILED': true,'VERSION':'1.1.1','SRS':'900913','STYLES':""},
                })),
                legendURL : "http://wms.ign.gob.ar/geoserver/wms",
                opacity: 1,
                visible: false,
                title: "IGN Argenmap",
                id :MapUtils.constructLayerIdentifier("IGN","capabaseargenmap","no_style"),
      });
      var sig_ign = new ol.layer.Tile({
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                  url: "http://wms.ign.gob.ar/geoserver/wms",
                  params: {'LAYERS': "capabasesigign", 'TILED': true,'VERSION':'1.1.1','SRS':'900913','STYLES':""},
                })),
                legendURL : "http://wms.ign.gob.ar/geoserver/wms",
                opacity: 1,
                visible: false,
                title: "IGN SIG",
                id :MapUtils.constructLayerIdentifier("IGN","capabasesigign","no_style"),
      });
      var mosaicos = new ol.layer.Tile({
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                  url: "http://geointa.inta.gov.ar/geoserver/wms",
                  params: {'LAYERS': "imagenes:mosaico_de_areas_con_agua", 'TILED': true,'VERSION':'1.1.1','SRS':'900913','STYLES':""},
                })),
                legendURL : "http://wms.ign.gob.ar/geoserver/wms",
                opacity: 1,
                visible: false,
                title: "Mosaicos",
                id :MapUtils.constructLayerIdentifier("GeoINTA","imagenes:mosaico_de_areas_con_agua","no_style"),
      });     
      var map = new ol.Map({
        layers: [
          aerial,
          labelsAerial,
          osm,
          argenmap,
          sig_ign,
          mosaicos,
        ],
        projection:mapConfig.projection,
        displayProjection:mapConfig.displayProjection,
        view: new ol.View({
          center: $scope.getInitMapCenter(mapConfig.projection) || mapConfig.center,
          zoom: $scope.getInitMapZoom() || mapConfig.zoom
        }),
      });
      $scope.baseLayers.push(aerial);
      $scope.baseLayers.push(labelsAerial);
      $scope.baseLayers.push(osm);
      $scope.baseLayers.push(argenmap);
      $scope.baseLayers.push(sig_ign);
      $scope.baseLayers.push(mosaicos);
      $scope.addGoogleLayers(map);
      return map;  
    }

    $scope.addGoogleLayers = function(map){
      var googleLayer = new olgm.layer.Google({
        visible:false,
        title: "Google Terreno"
      });
      var googleSat = new olgm.layer.Google({
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        visible:false,
        title: "Google Satélite"
      });
      var googleHybrid = new olgm.layer.Google({
        mapTypeId: google.maps.MapTypeId.HYBRID,
        visible:false,
        title: "Google Híbrido"
      });
      map.addLayer(googleLayer);
      map.addLayer(googleSat);
      map.addLayer(googleHybrid);
      $scope.baseLayers.push(googleLayer);
      $scope.baseLayers.push(googleSat);
      $scope.baseLayers.push(googleHybrid);
    }


    $scope.updateActiveLayersToMenu = function(){
        console.log("ACTUALIZANDO");
    }

    $scope.buscar = function(){
      /*for (var k = 0 ; k < $scope.activeLayers.length ; k++){
        console.log($scope.activeLayers[k].get('id'));
      }*/
      $scope.map.getLayers().forEach(function(layer,idx) {
            console.log(layer.get('id') +  ' , ' + idx);
        });
    }

    // Reseteo el estado del mapa
    // Deja visibles solo las capas base
    // Limpia variables
    //    - Capas activas
    $scope.cleanMap = function(){
      // Limpio capas activas (no elimino capas de herramientas)
      $scope.activeLayers = MapUtils.getToolLayers($scope.activeLayers);
      // Limpio capas del proyecto
      for (var k=0; k < $scope.proyectLayers.length; k++){
          $scope.map.removeLayer($scope.proyectLayers[k]);
      }
      $scope.proyectLayers = [];
      // Limpio capas importadas
      for (var j=0; j < $scope.importedLayers.length; j++){
        $scope.map.removeLayer($scope.importedLayers[j]);
      }
      $scope.importedLayers = [];
    }


    $scope.loadActiveProyectLayers = function(){
      for (var i=0; i < $scope.activeProyectModel.capas.length;i++){
        var layerObject, layerIdentifier;
        layerConfig = $scope.activeProyectModel.capasConfig[$scope.activeProyectModel.capas[i]];
        tripleta = $scope.activeProyectModel.capas[i].split("::");
        nombreServidor = tripleta[0];
        server = $scope.lookupGeoServer(nombreServidor);
        nombreCapa = tripleta[1];
        nombreEstilo = (tripleta[2] == "SIN_ESTILO") ? "" : tripleta[2];
        if(server.urlCache && layerConfig.useCache == "true"){
            urlServidor = server.urlCache;
            cacheOptions = {resolutions:mapConfig.baseResolutions};
        } else {
            urlServidor = server.url;
            cacheOptions = null;
        }
        extent = [$scope.activeProyectModel.modelo[0].oeste,$scope.activeProyectModel.modelo[0].sur,$scope.activeProyectModel.modelo[0].este,$scope.activeProyectModel.modelo[0].norte];
        extentGoogle = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:900913"));
        layerIdentifier =  MapUtils.constructLayerIdentifier(nombreServidor,nombreCapa,nombreEstilo);
        layerObject = MapUtils.createWMSLayerObject({
                                    serverURL: urlServidor,
                                    legendURL: server.url, // como leyenda asigno url servidor (no cache)
                                    layerOrigin: nombreServidor,
                                    layerName: nombreCapa,
                                    layerTitle: $scope.activeProyectModel.capasConfig[$scope.activeProyectModel.capas[i]].nombre,
                                    style: nombreEstilo,
                                    visible:false,
                                    opacity:1
                                },
                                cacheOptions
                );
          $scope.proyectLayers.push(layerObject);
          $rootScope.addActiveLayer(layerObject);
          $scope.map.getView().fit(extentGoogle, $scope.map.getSize());
      }
      ProyectUtils.setProyectLayers($scope.proyectLayers);
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
    $scope.requestActiveProyect = function(){
        var activeID = $scope.activeProyect.id;
        if ($scope.proyectsModel[activeID]){
            $scope.updateActiveProyect($scope.proyectsModel[activeID]);
        } else {
          $scope.loading.show();
          ProyectsFactory.getProyect(activeID)
              .success(function(data) {
                $scope.proyectsModel[activeID]  = data; // guardo el nuevo modelo pedido, para no volver a pedirlo en el futuro
                $scope.updateActiveProyect(data);
              }).error(function(data, status) {
                console.error('Error peticionando proyecto ' + id, status, data);
                $scope.activeProyectModel = {};
              }).finally(function() {
                  $scope.loading.hide();
              });
        }
    }

    $scope.updateActiveProyect = function(data){
      $scope.activeProyectModel = data;
      $scope.cleanMap();
      $scope.loadActiveProyectLayers();
    }


    $scope.requestProjectsList = function(){
        ProyectsFactory.getProyects()
        .success(function(data) {
          $scope.proyects = data.proys;  
        }).error(function(data, status) {
          console.error('Error peticionando lista de proyectos', status, data);
        })
    }

    $scope.requestGeoServers = function(){
        ProyectsFactory.getGeoServers()
        .success(function(data) {
          $scope.geoServers = data;
          // PROYECT LOAD
          $scope.checkInitProyectLoad();
        }).error(function(data, status) {
          console.error('Error peticionando lista de geoservidores', status, data);
        })
    }

    // Se fija si la capa ya existe en el vector.
    // Compara campo 'id' de la capa.
    $scope.layerInArray = function(vector,layerObject){
      for (var i = 0 ; i < vector.length; i++){
        lyrTemp = vector[i];
        if (lyrTemp.get('id') == layerObject.get('id')){
          return true;
        }
      }
    return false;
    }

    //// ROOT FUNCTIONS -  ///
    // Funciones que pueden ser llamadas por cualquier modulo de la app, que injecten
    // dentro $rootScope

    // Retorna true si la capa existe en el mapa.
    // Compara campo 'id' de cada capa
    $rootScope.layerExists = function(layerObject){
        return MapUtils.layerExists(layerObject);
    }

    $rootScope.addActiveLayer = function(layer){
      $timeout(function(){
        if (layer){
            if (!$scope.layerInArray($scope.activeLayers,layer)){
              $scope.activeLayers.push(layer);
              $scope.map.addLayer(layer); 
            }
            if (!layer.getVisible()){
              layer.setVisible(true);
            }
        }
      })
    }  

    $rootScope.removeActiveLayer = function(layer){
        for (var i = 0; i < $scope.activeLayers.length; i++) {
            tmpLayer = $scope.activeLayers[i];
            if (tmpLayer.get('id') == layer.get('id')){
              $scope.activeLayers.splice(i,1);
              $scope.map.removeLayer(layer);
              //layer.setVisible(false);
            }
        }
        $scope.$apply();
    }


    // Metodo que inserta a la capa en el mapa,
    // y la establece como activa.
    // Luego, las guarda en la lista importedLayers
    $rootScope.addImportedLayer = function(layerObject,type){
          $rootScope.addActiveLayer(layerObject);
          $scope.importedLayers.push(layerObject);
    }

    $rootScope.getActiveLayers = function(){
      return $scope.activeLayers;
    }

    $rootScope.getGeoServers = function(){
      return $scope.geoServers;
    }

    $rootScope.getLayerBy = function(field,value){
      return MapUtils.getLayerBy($scope.map,field,value);  
    }


    $rootScope.getProyectModel = function(){
        return $scope.activeProyectModel;
    }


    $rootScope.getLayerObjectFromConfig = function(configName){
       for (layer in $scope.activeProyectModel.capasConfig){
          if (layer == configName){
            return $rootScope.getLayerBy('title',$scope.activeProyectModel.capasConfig[layer].nombre);
          }
       }
       return null;
    }

    $rootScope.initBoxAction = function(boxID,type,action){
      console.log(boxID);
      $scope.$broadcast('visorBoxClicked',{id:boxID,type:'info',action:action});
    }


    $rootScope.updateLayerInfoActive = function(layer){
      $scope.layerInfoActive[0] = layer;
    }

    $rootScope.getLayerInfoActive = function(){
      return $scope.layerInfoActive;
    }

    //      ###       WATCHERS       ###      //



    $scope.getQueryValues();
    $scope.validateMapQueryValues();
    $scope.map = createMap();
    $scope.requestProjectsList();
    $scope.requestGeoServers();



}]);
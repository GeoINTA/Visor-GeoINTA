angular.module('visorINTA.MainController', [])
  .controller('MainController', ['$rootScope','$scope','$loading','mapConfig','ToolsManager','ProyectsFactory','MapUtils', function($rootScope,$scope,$loading,mapConfig,ToolsManager,ProyectsFactory,MapUtils) {

    // Layers

    $scope.baseLayers = []; // capas base del mapa
    $scope.infoLayers = []; // todas las capas (no base) del mapa, indepte de si estan activas (visibles) o no.
                           // cuando se carga un proyecto, todas las capas se cargan aqui.
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


    // Tools

    $scope.toolsManager = ToolsManager;

    // DEBUGGING
    $scope.verboseMode = true;


    $scope.loading = new $loading({
                busyText: 'Cargando proyecto...',
                theme: 'success',
                timeout: false,
                //delayHide:1000,
                showSpinner: true,
    });


    $scope.getBaseLayersGroup = function(){
      console.log("Base layers");

    }

    var createMap = function(){
      var layers = [];
      var layer1 = new ol.layer.Tile({
              preload: 4,
              source: new ol.source.OSM(),
              title:"OSM GO",
              name:MapUtils.constructLayerIdentifier("base_layer_OSM","no_style")
          });
      var layer2 = new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'}),
            title: "Satelite",
            name:MapUtils.constructLayerIdentifier("base_layer_satellite","no_style")
      });
      layers.push(layer1);
      layers.push(layer2);
      var baseLayers = new ol.layer.Group({nombre:'baseLayers',layers:layers});
      var map = new ol.Map({
        controls: ol.control.defaults().extend([
        new ol.control.FullScreen(),
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


    $scope.isToolEnabled = function(tool){
      return $scope.toolsManager.isToolEnabled(tool);
    }

    $scope.toogleTool = function(toolID){
      // Aviso a los controladores hijos que se ha seleccionado una herramienta
      $scope.$broadcast('visorBoxClicked',{type:'tool',id:toolID});
    }


    $scope.updateActiveLayersToMenu = function(){
        console.log("ACTUALIZANDO");
    }

    $scope.buscar = function(){
      alert($scope.activeProyect.nombre);
      console.log($scope);
    }

    // Reseteo el estado del mapa
    // Deja visibles solo las capas base
    // Limpia variables
    //    - Capas activas
    $scope.cleanMap = function(){
      $scope.activeLayers = []; // saco todas las capas activas
      for (var k=0; k < $scope.infoLayers.length; k++) // limpio capas 'no base'
        $scope.infoLayers[k].setVisible(false);
      for (var j=0; j < $scope.importedLayers.length; j++) // limpio capas 'no base'
        $scope.map.removeLayer($scope.importedLayers[j]);
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
        } else {
            urlServidor = server.url;
        }
        extent = [$scope.activeProyectModel.modelo[0].oeste,$scope.activeProyectModel.modelo[0].sur,$scope.activeProyectModel.modelo[0].este,$scope.activeProyectModel.modelo[0].norte];
        extentGoogle = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:900913"));
        layerIdentifier =  MapUtils.constructLayerIdentifier(nombreCapa,nombreEstilo);
        layerObject = $rootScope.getLayerBy('id',layerIdentifier);
        if(!layerObject){
          layerObject = MapUtils.createWMSLayerObject({
                serverURL: urlServidor,
                layerName: nombreCapa,
                layerTitle: $scope.activeProyectModel.capasConfig[$scope.activeProyectModel.capas[i]].nombre,
                style: nombreEstilo,
                visible:false,
                opacity:1
            });
          }
          $scope.map.addLayer(layerObject); 
          $scope.infoLayers.push(layerObject);
          $scope.map.getView().fitExtent(extentGoogle, $scope.map.getSize());
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
        /*$scope.loading.show();
        var model = $scope.proyectsModel[id] || null;
        if (model == null){ // Todavia no pedi este proyeto, lo pido al servicio que me da el gestor
           ProyectsFactory.getProyect(id)
              .success(function(data) {
                console.log(data);
                model =  data; 
                $scope.proyectsModel[$scope.activeProyect.id]  = model; // guardo el nuevo modelo pedido, para no volver a pedirlo en el futuro
              }).error(function(data, status) {
                console.error('Error peticionando proyecto ' + id, status, data);
                model = null;
              })
        }
        console.log('model');
        console.log(model);
        $scope.loading.hide();*/
    }

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

    // Los JSON de los proyectos que recibo desde el gestor no son válidos,
    // tienen valores que no necesito (si los necesita el visor viejo).
    // Este metodo elimina estos valores que no necesito
    $scope.cleanProyectData = function(data){
      console.log(data);
      return JSON.parse(data);
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
        /*var activeID = $scope.activeProyect.id;
        ProyectsFactory.getProyect(activeID)
              .success(function(data) {
                $scope.activeProyectModel = $scope.cleanProyectData(data);
                $scope.proyectsModel[activeID]  = data; // guardo el nuevo modelo pedido, para no volver a pedirlo en el futuro
                console.log("ACTIVE");
                console.log($scope.activeProyectModel);
              }).error(function(data, status) {
                console.error('Error peticionando proyecto ' + id, status, data);
                $scope.activeProyectModel = {};
              })*/
        $scope.activeProyectModel = $scope.getProyectModel($scope.activeProyect.id);
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
        }).error(function(data, status) {
          console.error('Error peticionando lista de geoservidores', status, data);
        })
    }

    // Metodo que inserta en el modelo del proyecto actual, la capa recibida,
    // dentro de la rama especificada en 'type'
    $scope.insertImportedLayerToModel = function(layerObject,type){
      console.log($scope.activeProyectModel);
      var model = ($scope.activeProyectModel.modelo) ? $scope.activeProyectModel.modelo[0] : null; // puede ser nulo
      console.log(model);
      if (!model){
      } else {
        console.log(model);
        //model["Capas importadas"][type].push(newNode);
      }
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


    $rootScope.addLayer = function(layerObject){
      try {
          var exist = $rootScope.getLayerBy('title',layerObject);
          if (!exist){
            $scope.map.addLayer(layerObject);
            return true;
          }
          return false;
      } catch(err){
          return false;
      }
    }

    $rootScope.addActiveLayer = function(layer){
      if (layer){
          if (!$scope.layerInArray($scope.activeLayers,layer)){
            $scope.activeLayers.push(layer);
          }
          if (!layer.getVisible()){
            layer.setVisible(true);
          }
          try{
            $scope.$apply();
          } catch(err){

          }
      }
    }


    // Metodo que inserta a la capa en el mapa,
    // y la establece como activa.
    // Luego, las guarda en la lista importedLayers
    $rootScope.addImportedLayer = function(layerObject,type){
       if ($rootScope.addLayer(layerObject,true)){
          $rootScope.addActiveLayer(layerObject);
          $scope.importedLayers.push(layerObject);
       }

    }

    $rootScope.getActiveLayers = function(){
      return $scope.activeLayers;
    }


    $rootScope.removeActiveLayer = function(layer){
        for (var i = 0; i < $scope.activeLayers.length; i++) {
            tmpLayer = $scope.activeLayers[i];
            if (tmpLayer.get('id') == layer.get('id')){
              $scope.activeLayers.splice(i,1);
            }
        }
        $scope.$apply();
    }

    $rootScope.getLayerBy = function(field,value){
      return MapUtils.getLayerBy($scope.map,field,value);  
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
    $scope.requestProjectsList();
    $scope.requestGeoServers();



}]);
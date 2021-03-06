angular.module('visorINTA.utils.MapUtilsService', [])
.service('MapUtils', function(LayerUtils){

    this.LAYER_ID_SEPARATOR = "__";
    this.IMPORTED_LAYER_SERVER = "IMPORTEDLAYER";
    this.TOOL_LAYER_SERVER = "TOOLLAYER";



    this.getLayerBy = function(map,field,value){
        return LayerUtils.getLayerBy(map.getLayers().getArray(),field,value);
    }


	this.getLayerByTitle = function(map,value) {
		return this.getLayerBy(map,'title',value);
    }

    this.getLayerIndex = function(map,layerID){
        var lyrIdx = -1;
        map.getLayers().forEach(function(layer,idx) {
            if (layer.get('id') == layerID) {
                lyrIdx = idx;
            }
        });
        return lyrIdx;
    }



    this.constructLayerIdentifier = function(origin,name,style){
        return origin + this.LAYER_ID_SEPARATOR + name + this.LAYER_ID_SEPARATOR + style;
    }

    // layerOrID puede ser un objeto layer de openlayers,
    // o un string que se refiere a un id de una capa
    this.getLayerParams = function(layerOrId){
        identifier =  (! typeof layerOrId == "string") ? layerOrId.get('id'): layerOrId;
        params = identifier.split(this.LAYER_ID_SEPARATOR);
        return {
            "server":params[0],
            "layerName":params[1],
            "layerStyle":params[2]
        }
    }
 

    this.getImportedLayerServer = function(){
        return this.IMPORTED_LAYER_SERVER;
    }

    this.getToolLayerServer = function(){
        return this.TOOL_LAYER_SERVER;
    }

    this.isImportedLayer = function(layerID){
        if (this.getLayerParams(layerID)['server'] == this.IMPORTED_LAYER_SERVER){
            return true;
        }
        return false;
    }

    this.isToolLayer = function(layerID){
        if (this.getLayerParams(layerID)['server'] == this.TOOL_LAYER_SERVER){
            return true;
        }
        return false;
    }


    this.getToolLayers = function(vector){
      var toolLayers = [];
      for (var i=0; i < vector.length; i++){
        layer = vector[i];
        if (this.isToolLayer(layer.get('id'))){
            toolLayers.push(layer);
        }
      }
      return toolLayers;
    } 


    // Crea un objecto layer WMS, a partir de data
    //(urlservidor,nombre de la capa,estilo,...)
    // layerTitle es el titulo publico con el que se muestra a la capa
    // layerName es el nombre de la capa tal cual aparece en el servidor
    // id es una composicion dada por el nombre y el estilo de la capa
    this.createWMSLayerObject = function(data,cacheOptions){
        // Cache
        var gwcGrid = null;
        if (cacheOptions){
            gwcGrid = new ol.tilegrid.TileGrid({
                    resolutions: cacheOptions.resolutions,
                    origin: cacheOptions.origin || [-60.0185,-34.8765],
                    tileSize: 256
            })
        }
        // build layer
    	layer = new ol.layer.Tile({
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                  url: data.serverURL,
                  params: {'LAYERS': data.layerName, 'TILED': true,'VERSION':'1.1.1','SRS':'900913','STYLES':data.style},
                })),
                sourceURL: data.serverURL, // guardo en una propiedad la url del servidor
                tileGrid: gwcGrid,
                legendURL : data.legendURL || "",
                opacity:data.opacity,
                visible: data.visible,
                title: data.layerTitle,
                id:this.constructLayerIdentifier(data.layerOrigin,data.layerName,data.style),
        });
        return layer;
    }


    // Recibe coordenadas en EPSG:4326 y chequea si son correctas
    this.validateCoordinates = function(lat,lng){
        if ( (lat < -90 || lat > 90) || (lng < -180 || lng > 180) ){
            return false;
        }
        return true;
    }

    //////////////////////////// LAYER LEGENDS!

    this.baseLegendParams = {
                SERVICE: 'WMS',
                REQUEST: 'GetLegendGraphic',
                FORMAT: 'image/png',
                WIDTH : '20',
                HEIGHT: '20',
                VERSION: '1.0.0',
    }


    this.getLayerLegend = function(layer){
        if (layer){
            layerURL = layer.get('legendURL');
            source = this.baseLegendParams;
            layerMetadata = this.getLayerParams(layer.get('id'));
            source['LAYER'] = layerMetadata['layerName'];
            source['STYLE'] = layerMetadata['layerStyle'];
            legendURL = layerURL + '?' + this.encodeQueryData(source);
            return legendURL;
        }
        return "";
    }

    this.getLayerLegendParams = function(layer){
        if (layer){
            layerURL = layer.get('legendURL');
            source = this.baseLegendParams;
            layerMetadata = this.getLayerParams(layer.get('id'));
            source['LAYER'] = layerMetadata['layerName'];
            source['STYLE'] = layerMetadata['layerStyle'];
            return this.encodeQueryData(source);
        }
        return "";
    }

    ////////////////////////////


    this.encodeQueryData = function(data){
        var ret = [];
        for (var d in data)
          ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        return ret.join("&");
    }
});
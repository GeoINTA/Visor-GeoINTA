angular.module('visorINTA.utils.MapUtilsService', [])
.service('MapUtils', function(){

    this.LAYER_ID_SEPARATOR = "__";

    this.layerExists = function(map,layerObject){
        var exist = false;
        map.getLayers().forEach(function(layer) {
            if (layer.get('id') == layerObject.get('id')){
                exist = true;
            }
        });
        return exist;
    }

	this.getLayerByTitle = function(map,value) {
		layer = this.getLayerBy(map,'title',value);
		return layer;
    }


    this.getLayerBy = function(map,field,value){
    	lyr = null;
		map.getLayers().forEach(function(layer) {
		    if (layer.get(field) == value) {
		    	lyr = layer; // no se xq no funciona si retorno directo desde aca
		    }
	  	});
	  	return lyr;
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
                tileGrid: gwcGrid,
                opacity:data.opacity,
                visible: data.visible,
                title: data.layerTitle,
                id:this.constructLayerIdentifier(data.layerOrigin,data.layerName,data.style)
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
});
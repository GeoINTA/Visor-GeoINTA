angular.module('visorINTA.utils.MapUtilsService', [])
.service('MapUtils', function(){

	this.getLayerByName = function(map,value) {
		layer = this.getLayerBy(map,'name',value);
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

    // Crea un objecto layer WMS, a partir de los parametros recibidos
    //(urlservidor,nombre de la capa,estilo,...)
    // layerTitle es el nombre con el que se quiere identificar a la capa
    this.createWMSLayerObject = function(layerTitle,params){
    	layer = new ol.layer.Tile({
                source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
                  url: params.serverURL,
                  params: {'LAYERS': params.layerName, 'TILED': true,'VERSION':'1.1.1','SRS':'900913','STYLES':params.style},
                  serverType: 'geoserver',
                })),
                opacity:1,
                visible: true,
                name: layerTitle,
        });
        return layer;
    }
});
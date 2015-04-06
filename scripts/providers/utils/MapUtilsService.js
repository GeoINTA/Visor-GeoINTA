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
});
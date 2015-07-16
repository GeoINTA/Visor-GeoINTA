angular.module('visorINTA.utils.LayerUtilsService', [])
.service('LayerUtils', function(){

    this.getLayerBy = function(collection,field,value){
        lyr = null;
        for (var i = 0 ; i < collection.length; i++) {
            layer = collection[i];
            if (layer.get(field) == value) {
                lyr = layer; // no se xq no funciona si retorno directo desde aca
            }
        }
        return lyr;
    }



});
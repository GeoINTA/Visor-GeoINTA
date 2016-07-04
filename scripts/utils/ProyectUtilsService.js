angular.module('visorINTA.utils.ProyectUtilsService', [])
.service('ProyectUtils', function(LayerUtils){

    this.proyectLayers = [];

    this.getProyectLayers = function(){
        return this.proyectLayers;
    }

    // ATENCION! Se utiliza solo cuando se carga proyecto
    this.setProyectLayers = function(layersList){
        this.proyectLayers = layersList;
    }


    this.getLayerBy = function(field,value){
        return LayerUtils.getLayerBy(this.proyectLayers,field,value);
    }

    this.getLayerByTitle = function(value){
        return LayerUtils.getLayerBy(this.proyectLayers,'title',value);
    }  

});
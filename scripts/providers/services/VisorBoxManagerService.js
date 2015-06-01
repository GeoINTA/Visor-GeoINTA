angular.module('visorINTA.utils.VisorBoxManagerService', [])
.service('VisorBoxManager', function(boxActions){

    this.boxList =  {}


    // Ejecuta la accion requerida y retorna el estado de la caja
    this.doAction = function(action,boxID){
        switch (action){
            case boxActions['OPEN']: this.enableBox(true,boxID);
                                    break;
            case boxActions['CLOSE']: this.enableBox(false,boxID);
                                    break;
            case boxActions['TOOGLE']: this.toogleBox(boxID);
                                    break;
        }
        return this.getBoxIsEnabled(boxID);
    }

    this.addBox = function(boxID,isActive){
        active = isActive || false;
        this.boxList[boxID] = {};
        this.boxList[boxID].isEnabled = active;
    }

    this.toogleBox = function(boxID){
        state = ! this.getBoxIsEnabled(boxID);
        this.enableBox(state,boxID);
    }

    this.enableBox = function(boolActive,boxID){
        this.boxList[boxID].isEnabled = boolActive;
    }

    this.getBoxIsEnabled = function(boxID){
        return this.boxList[boxID].isEnabled;
    }

});
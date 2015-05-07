angular.module('visorINTA.utils.GeoServerService', [])
.service('GeoServerUtils', ['$http',function($http){

	// Retorna un objeto, el cual es una lista de capas, y cada una de ellas con su lista de estilos
	this.getServerCapabilities = function(serverURL){
		return this.requestData(serverURL,{request:'getCapabilities',service:'WMS'});
	}


	// Los geoservers proveen un servicio y responden con archivos XML (siempre).
	// Aqui, manejo la respuesta para parsear el xml y convertirlo en un objeto json/javascript
	this.requestData = function(serverURL,params){
		return $http.get(serverURL, {
                params : params,
                transformResponse: function (data, headers) {
                    data = x2js.xml_str2json(data);
                    return data;
                }
        })
	}


}]);
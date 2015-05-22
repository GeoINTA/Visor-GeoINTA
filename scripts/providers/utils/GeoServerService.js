angular.module('visorINTA.utils.GeoServerService', [])
.service('GeoServerUtils',function($http,$q){

	// Retorna un objeto, el cual es una lista de capas, y cada una de ellas con su lista de estilos
	this.getServerCapabilities = function(serverURL){
		return this.requestData(serverURL,{request:'getCapabilities',service:'WMS'});
	}


	this.getFeatureInfo = function(layers,coords,mapView){
		promises = [];
		angular.forEach(layers, function(layer){
			//var deffered = $q.defer();
			layerSource = layer.getSource();
			viewResolution = mapView.getResolution();
			var infoUrl = layerSource.getGetFeatureInfoUrl(
			      coords, viewResolution, 'EPSG:3857',
			      {'INFO_FORMAT': 'application/json'});
			var request = $http({
				url: infoUrl,
				method:'POST',
                transformResponse: function (data, headers) {
                	data = JSON.parse(data);
                    data.layerTitle = layer.get('title');
                    return data;
                }
			});
			promises.push(request);
		});
		return $q.all(promises);
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


});
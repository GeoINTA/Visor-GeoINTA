angular.module('visorINTA.utils.GeoServerService', [])
.service('GeoServerUtils',function($http,$q,networkServices){


	// Retorna un objeto, el cual es una lista de capas, y cada una de ellas con su lista de estilos
	this.getServerCapabilities = function(serverURL){
		return this.requestData(serverURL,{proxyParams:{request:'getCapabilities',service:'WMS'}});
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
				url: getUrlBase(infoUrl),
				method:'POST',
				params:{proxyParams:getUrlParams(infoUrl),contenttype:'text/html'},
                transformResponse: function (data, headers) {
                	data = JSON.parse(data);
                    data.layerTitle = layer.get('title');
                    data.layerId = layer.get('id');
                    return data;
                }
			});
			promises.push(request);
		});
		return $q.all(promises);
	}

	function getUrlBase(serverURL){
		return serverURL.split('?')[0];
	}

	function getUrlParams(serverURL){
		outParams = {};
		paramsString = serverURL.split('?')[1];
		individualParams = paramsString.split('&');
		for (i in individualParams){
			keyValueParam = individualParams[i].split('=');
			outParams[keyValueParam[0]] = keyValueParam[1];
		}
		return outParams;
	}


	// Los geoservers proveen un servicio y responden con archivos XML (siempre).
	// Aqui, manejo la respuesta para parsear el xml y convertirlo en un objeto json/javascript
	this.requestData = function(serverURL,params){
		url = serverURL;
		return $http.get(url, {
                params : params,
                transformResponse: function (data, headers) {
                    data = x2js.xml_str2json(data);
                    return data;
                }
        })
	}


});
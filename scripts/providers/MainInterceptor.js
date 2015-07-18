angular.module('visorINTA.factories.MainInterceptor',[])
.factory('MainInterceptor', function(networkServices) {  

  	return {

  		request : function(config){
  			if (config.params && config.params.proxyParams){ // true cuando se desea utilizar el proxy
  				config.url =  networkServices.proxyUrl + '?url=' +  config.url;
          newParams = [];
          for (param in config.params.proxyParams){
            newParams.push(param + "=" + config.params.proxyParams[param]);
          }
          config.url += '?' + encodeURIComponent(newParams.join('&'));
          delete config.params.proxyParams;
  			}
  			return config;
  		}

  	};

});
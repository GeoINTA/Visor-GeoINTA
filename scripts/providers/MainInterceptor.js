angular.module('visorINTA.factories.MainInterceptor',[])
.factory('MainInterceptor', function(networkServices) {  

  	return {

  		request : function(config){
  			useProxy = (config.params) ? config.params.useProxy : false;
  			if (useProxy){
          delete config.params.useProxy; // elimino para que no se agrege como parametro luego
  				config.url =  networkServices.proxyUrl + '?url=' +  config.url;
          newParams = [];
          for (param in config.params){
            newParams.push(param + "=" + config.params[param]);
          }
          config.url += '?' + encodeURIComponent(newParams.join('&'));
          config.params = {};
          console.log(config);
  			}
  			return config;
  		}

  	};

});
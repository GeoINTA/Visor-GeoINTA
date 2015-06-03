angular.module('visorINTA.factories.MainInterceptor',[])
.factory('MainInterceptor', function(networkServices) {  

  	return {

  		request : function(config){
  			useProxy = (config.params) ? config.params.useProxy : false;
  			if (useProxy){
  				console.log('Use proxy');
  				console.log(config.url);
  				config.url =  networkServices.proxyUrl + '?url=' +  config.url;
  				console.log(config);
  				 			config.transformResponse =  function (data, headers) {
                	console.log('transform');
                    data = x2js.xml_str2json(data);
                    return data;
                }
  			}
  			return config;
  		}

  	};

});
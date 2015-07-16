
// Factory encargado de interactuar con el gestor para pedir datos de los proyectos
angular.module('visorINTA.factories.ProyectsFactory',[])
.factory('ProyectsFactory',['networkServices','$http', function(networkServices,$http){
     
    var proyectsFactory = {};

    var geoServers =  [{"nombre":"GeoINTA","url":"http:\/\/geointa.inta.gov.ar\/geoserver\/wms","urlCache":"http:\/\/geointa.inta.gov.ar\/geoserver\/gwc\/service\/wms"},{"nombre":"GeoBariloche","url":"http:\/\/sipan.inta.gob.ar\/geoserver\/wms","urlCache":""},{"nombre":"INTA Rafaela","url":"http:\/\/geointa.inta.gov.ar\/geoserversf\/wms","urlCache":"http:\/\/geointa.inta.gov.ar\/geoserversf\/gwc\/service\/wms"},{"nombre":"GeoAnguil","url":"http:\/\/geointa.inta.gov.ar\/geoserverLP\/wms","urlCache":"http:\/\/geointa.inta.gov.ar\/geoserverLP\/gwc\/service\/wms"},{"nombre":"GeoSantiago","url":"http:\/\/geointa.inta.gov.ar\/geosantiago\/wms","urlCache":"http:\/\/geointa.inta.gov.ar\/geosantiago\/gwc\/service\/wms"},{"nombre":"GeoParana","url":"http:\/\/geointa.inta.gov.ar\/geoparana\/wms","urlCache":"http:\/\/geointa.inta.gov.ar\/geoparana\/gwc\/service\/wms"},{"nombre":"RIDES","url":"http:\/\/rides.producciontucuman.gov.ar\/ArcGIS\/services\/Informacion_Productiva\/mapserver\/WMSServer","urlCache":""},{"nombre":"EEA Famailla","url":"http:\/\/geointa.inta.gov.ar\/geotucuman\/wms","urlCache":"http:\/\/geointa.inta.gov.ar\/geotucuman\/gwc\/service\/wms"},{"nombre":"IGN","url":"http:\/\/wms.ign.gob.ar\/geoserver\/wms","urlCache":"http:\/\/wms.ign.gob.ar\/geoserver\/gwc\/service\/wms"},{"nombre":"Mapoteca","url":"http:\/\/geointa.inta.gov.ar\/wmsserver\/srv_mapoteca_v2\/MapServer\/WMSServer?SRS=EPSG:102113","urlCache":""},{"nombre":"Geoservidor Cordoba","url":"http:\/\/wms.geointa.inta.gob.ar\/geocordoba\/wms","urlCache":""},{"nombre":"GeoSalta","url":"http:\/\/geosalta.inta.gob.ar\/geoserver\/wms","urlCache":"http:\/\/geosalta.inta.gob.ar\/geoserver\/gwc\/service\/wms"}]
     
    proyectsFactory.getProyects = function(){
    	// hacer peticion al gestor
    	// la url esta en networkServices.gestor
    	// por ahora, json de prueba
    	//var jsonProyectos = {"success":true,"proys":[{"id":160,"nombre":"Vuelo INTA Castelar","desc":"Vuelo sobre INTA Castelar. Marzo de 2014.\nMosaicos Canal Visible e IRc\n"},{"id":77,"nombre":"Cuencas h\u00eddricas de las provincias de Salta y Jujuy ","desc":"Identificaci\u00f3n y caracterizaci\u00f3n de la unidad f\u00edsica \u201ccuenca\u201d a partir de la informaci\u00f3n disponible, y en un formato factible de\nactualizar en el tiempo y en el espacio.\n"},{"id":136,"nombre":"Cartas de Suelos de Entre R\u00edos","desc":"Cartas de Suelos de ER Escala 1:100.000 publicadas entre 1986-2011 dentro del convenio INTA-Gobierno de ER. La base de datos provee informaci\u00f3n de unidades cartogr\u00e1ficas de suelos --definidos a nivel de series, consociaciones y asociaciones de series, y complejos-- e incluye datos de \u00edndices de productividad (IP) convencionales y potenciales de las mismas."},{"id":153,"nombre":"SIT Tucum\u00e1n","desc":"Informaci\u00f3n georeferenciada de cultivos e industrias de la Pcia. de Tucum\u00e1n."},{"id":58,"nombre":"Mapa de Proyectos Regionales con Enfoque Territorial ","desc":"Mapa de los  Proyectos Regionales con Enfoque Territorial (PRET) de INTA"},{"id":98,"nombre":"SIG Superficies cultivadas de Floricultura","desc":"Superficies y Evoluci\u00f3n cultivada de floricultura (plantas ornamentales y flores de corte) en base al Censo Nacional Agropecuario 1988 y 2002."},{"id":83,"nombre":"Cartas de suelos del Valle de Lerma - Salta ","desc":"Como parte del trabajo que viene realizando el Laboratorio de Teledetecci\u00f3n y SIG de la EEA INTA Salta, se elabor\u00f3 la cartograf\u00eda digital de la \u201cCarta de suelos de la Rep\u00fablica Argentina, Provincia de Salta - Valle de Lerma\u201d (1999, 2000 y 2004 - J.R. Vargas Gil). Paralelamente, se elabor\u00f3 la base de datos a partir de la memoria descriptiva del mismo estudio de suelo. "},{"id":143,"nombre":"Delta del r\u00edo Paran\u00e1","desc":"Cartograf\u00eda de susceptibilidad h\u00eddrica en el Delta del r\u00edo Paran\u00e1"},{"id":164,"nombre":"Unidades Fisonomicas de la Puna","desc":"El objetivo de este trabajo es cartografiar los diferentes tipos fison\u00f3micos presentes y caracterizar su funcionamiento a partir de la estimaci\u00f3n de la productividad primaria neta aerea (PPNA). 2010"},{"id":800,"nombre":"Cartas de suelos de los Valles Calchaquies - Salta","desc":"Cartas de suelos de los Valles Calchaquies - Salta\n"},{"id":804,"nombre":"BioCombustibles","desc":"Residuos y cultivos agr\u00edcolas tradicionales para la producci\u00f3n de bioenerg\u00eda. (PNEG1411)"},{"id":803,"nombre":"Cuencas H\u00eddricas Argentinas","desc":"Repositorio de cartograf\u00eda sobre cuencas h\u00eddricas argentinas"},{"id":805,"nombre":"Suelos Balcarce","desc":"El presente trabajo es el resultado de digitalizar en el Laboratorio de Geom\u00e1tica las Cartas de Suelos escala 1:50.000 de la provincia de Buenos Aires, generadas a principios de los a\u00f1os 80\u2032 por el Inst. de Suelos \u2013 INTA Castelar."},{"id":807,"nombre":"Riesgo Agropecuario","desc":"Descripci\u00f3n"},{"id":82,"nombre":"Cobertura y uso del suelo de Argentina","desc":"Se presenta el trabajo realizado en el per\u00edodo 2006 \u2013 2009 para elaborar cartograf\u00eda digital del territorio nacional, relativa a la ocupaci\u00f3n de las tierras y uso actual de los suelo a escala exploratoria (E 1:500.000), mediante el sistema de clasificaci\u00f3n de ocupaci\u00f3n de tierras \u201cLand Cover Classification System - LCCS\u201d, (Di Gregorio et al., 1998). "},{"id":806,"nombre":"Anegamiento Cuenca del Salado","desc":"El mapa de riesgo h\u00eddrico y de suelos escala 1:25.000 fueron generados a partir de la interpretaci\u00f3n de 25 a\u00f1os de im\u00e1genes provenientes del sat\u00e9lite Landsat."},{"id":100,"nombre":"RIAN Informes sobre cultivos","desc":"Seguimiento de sistemas productivos: Semanalmente se eval\u00faa lacondici\u00f3n de los principales componentes de los sistemas productivos del pa\u00eds. Los resultados del monitoreo se visualizan en mapas y tablas con escalas crom\u00e1ticas de condici\u00f3n."},{"id":69,"nombre":"Suelos de la Rep\u00fablica Argentina","desc":"Suelos de la Rep\u00fablica Argentina. Inventario del recurso suelo del pa\u00eds, proporciona una clasificaci\u00f3n de los suelos y evaluaci\u00f3n de las tierras. Escala gr\u00e1fica 1:500.000 y las provincias de Neuqu\u00e9n, Mendoza, San Juan, La Rioja, Chubut y Santa Cruz est\u00e1n a escala 1:1.000.000.\n"},{"id":857,"nombre":"Suelos de C\u00f3rdoba ","desc":"Publicado originalmente como parte del Atlas de Suelos de la Rep\u00fablica Argentina (1990), enriquecida y complementada en la publicaci\u00f3n Recursos Naturales de la Provincia de C\u00f3rdoba. LOS SUELOS. Nivel de Reconocimiento 1:500.000 (2003) y (2006) como parte del Convenio INTA-Secretar\u00eda de Ambiente de Cba. Inventario del recurso suelo de la Provincia a nivel de reconocimiento, proporciona una clasificaci\u00f3n de los suelos a nivel de Subgrupo y sus caracter\u00edsticas."},{"id":812,"nombre":"Suelos de la Pcia de Bs As 1:50.000","desc":"Cartograf\u00eda digital de Suelos y Fotomosaicos Georeferenciados. Escala 1:50.000 Cartograf\u00eda Digital: Mapa de suelos 1:50.000\n"},{"id":818,"nombre":"Perfiles SiSINTA","desc":"El SISINTA es un sistema de bases de datos, desarrollado espec\u00edficamente para almacenar informaci\u00f3n de suelos."},{"id":820,"nombre":"SIT Santiago del Estero v1","desc":"Contiene capas b\u00e1sicas de agrometeorolog\u00eda, recursos naturales,  infraestructura, poblaci\u00f3n y producci\u00f3n agropecuaria"},{"id":821,"nombre":"SIT Figueroa","desc":"Contiene capas generadas por el Nodo territorial de Figueroa"},{"id":79,"nombre":"Atlas Clim\u00e1tico","desc":"En este trabajo se presenta un Atlas Clim\u00e1tico Digital de la Rep\u00fablica Argentina con la finalidad de ofrecer herramientas para un manejo m\u00e1s adecuado del territorio. Se procura de esta manera poder colaborar en la determinaci\u00f3n, lo m\u00e1s certeramente posible, de las posibilidades de un uso sustentable del ambiente, tanto desde el punto de vista ecol\u00f3gico como social. "},{"id":819,"nombre":"Los Suelos de Salta y Jujuy","desc":"El presente Trabajo clasifica los suelos seg\u00fan el Soil Taxonomy y pretende ser una herramienta de trabajo que agilice la consulta del Estudio de Suelos, brindando informaci\u00f3n cartogr\u00e1fica, descriptiva, anal\u00edtica y taxon\u00f3mica de los suelos, al exponer su distribuci\u00f3n espacial georeferenciada para lograr un conocimiento integrado del territorio"}]};
    	//return jsonProyectos.proys;
      return this.requestData({isPrevisualizador:'true',modo:'proys'});
    }

    proyectsFactory.getProyect = function(id){
        return $http.get(networkServices.gestor, {
                params : {modo:'mod',id:id},
                transformResponse:function(data,header,status){
                    var expIcon = /mapfish\.\w+\.\w+\('([\w\:\\\/\.\?]+)',\s\{[\w\:\s']+\}\)/g;
                    var expInfo = /'(<img src="' \+ )?mapfish\.\w+\.\w+\("([\w\:\\\/\.\?]+)",\s\{[\s\w:"'\}\)\+]+>'?/g;
                    data = data.replace(expIcon,'"$1"'); // reemplazo por la url recibida
                    data = data.replace(expInfo,'"$2"'); // reemplazo por la url recibida
                    var jsonData = JSON.parse(data);
                    return jsonData;
                }
        })
    }

    proyectsFactory.getGeoServers = function(){
        return this.requestData({modo:'srvs'});
    }

    proyectsFactory.getServiceUrl = function(){
        return networkServices.gestor + '?callback=JSON_CALLBACK';
    }


    proyectsFactory.requestData = function(params,transformResponseFunction){
      if (transformResponseFunction){
        return $http.jsonp(this.getServiceUrl(), {
                params : params,
                transformResponse:function(data,header,status){
                    return data;
                }
        })
      } else {
        return $http.jsonp(this.getServiceUrl(), {
                  params : params
        })
      }
    }

    return proyectsFactory;
}]);
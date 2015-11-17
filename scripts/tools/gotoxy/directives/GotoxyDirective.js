angular.module('visorINTA.tools.gotoxy.GotoxyDirective', [])
.directive('gotoxyTool', function($rootScope) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
		},
		templateUrl:"templates/tools/gotoxyTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.toolTitle);
			visorBoxCtrlr.setBoxType('tool');

			var map;

            scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});

            scope.gotoPoint = function(){
            	var lat = scope.latValue;
            	var lon = scope.lonValue;
            	var zoom = scope.zoomLevelSelected;
            	var view = map.getView();
            	if (lat && lon){
            		view.setCenter(ol.proj.fromLonLat([lon, lat]));
            		view.setZoom(zoom);
            	}
            }


            scope.geolocationError = function(){
            	console.log("Error en gelocalizacion");
            }


            scope.startGeolocation = function(){
            	var $btn = $('#geolocationButton').button('loading');
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position){
					scope.lonValue = position.coords.longitude;
					scope.latValue = position.coords.latitude;
					scope.finalizeGeolocation($btn,1);
					scope.$apply();
					scope.decimalCoordinatesChange();
				},function(){
					console.log("Error en geolocalizacion");
					scope.finalizeGeolocation($btn,0);
				});
				} else {
				  scope.geolocationError();
				  console.log("El navegador NO SOPORTA geolocalizacion");
				  scope.finalizeGeolocation($btn,0);
				}
            }

            scope.finalizeGeolocation = function(btn, status){
            	btn.button('reset');
            	btnClass = "btn-" + (status ? 'success' : 'danger');
            	$("#geolocationButton").addClass(btnClass);
            }


            // Cambian valores decimales. Actualizo los sexagecimales
            scope.decimalCoordinatesChange = function(){
            	var lat = scope.latValue * -1;
            	var lon = scope.lonValue * -1;
            	if (lat && lon){
            		var gx = parseInt(lon);
					var mx = Math.floor((lon - gx) * 60);
					var sx = parseFloat((lon - mx/60 - gx) * 3600);
					scope.lonWVal = scope.formatSexagecimal(gx.toString()) 
					                + scope.formatSexagecimal(mx.toString())
					                + scope.formatSexagecimal(sx.toString());
					console.log(scope.lonWVal);

					var gy = parseInt(lat);
					var my = Math.floor( (lat - gy) * 60 );
					var sy = parseFloat( (lat - my/60 - gy) * 3600 );
					scope.latSVal = scope.formatSexagecimal(gy.toString()) 
					                + scope.formatSexagecimal(my.toString())
					                + scope.formatSexagecimal(sy.toString());
					console.log(scope.latSVal);
            	}
            }

            scope.formatSexagecimal = function(n){
			    return n >= 10 ? "" + n: "0" + n;
			}

            // Cambian los valores sexagecimales. Actualizo valores decimales
            scope.sexagecimalCoordinatesChange = function(){
            	var latS = scope.latSVal;
            	var lonW = scope.lonWVal;
            	if (latS && lonW){
            		var xg = parseInt(lonW.substr(0,2));
            		var xm = parseInt(lonW.substr(2,2));
            		var xs = parseInt(lonW.substr(4,2));
            		scope.lonValue = scope.formatDecimal((xg + xm/60 + xs/3600) * -1);
            		console.log(scope.lonValue);

            		var yg = parseInt(latS.substr(0,2));
					var ym = parseInt(latS.substr(2,2));
					var ys = parseInt(latS.substr(4,2));
					scope.latValue = scope.formatDecimal((yg + ym/60 + ys/3600 ) * -1);
					console.log(scope.latValue);
            	}
            }

            // Redondea a 7 decimales a float
            scope.formatDecimal= function(number){
            	return Math.round(number * 10000000) / 10000000;
            }


	        // Acciones a realizar cuando se abre la herramienta
	        scope.openBox = function(){	
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeBox = function(){
	        	
	        }

	        scope.init = function(){
	        	map = scope.map;
	  		}

	        scope.init();

		},
		controller: function($scope){
			$scope.toolName = "gotoxyTool";
			$scope.toolTitle = "Ir a coordenada";
			$scope.zoomLevelSelected = 12;

			$scope.zoomLevels = [
				{value:12,title:"Cerca"},
				{value:8,title:"Medio"},
				{value:4,title:"Lejos"},
			];
		}
	}

});
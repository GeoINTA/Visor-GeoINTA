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

            scope.decimalCoordinatesChange = function(){
            	alert("change");
            }

            scope.sexagecimalCoordinatesChange = function(){
            	var latS = scope.latSVal;
            	var lonW = scope.lonWVal;
            	console.log(lonW);
            	if (latS && lonW){
            		scope.lonValue = parseInt(lonW.substr(0,2))
            		                 + (parseInt(lonW.substr(2,4) / 60))
            		                 + (parseInt(lonW.substr(4,6) / 3600));
            		alert(scope.lonValue);
            	}
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
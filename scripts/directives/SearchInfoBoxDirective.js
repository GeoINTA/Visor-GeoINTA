angular.module('visorINTA.directives.SearchInfoBoxDirective', [])
.directive('searchInfoBox', function($rootScope,MapUtils) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			map : '=',
			data : '='
		},
		templateUrl:"templates/box/searchInfoBoxTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.boxTitle);
			visorBoxCtrlr.setBoxType('info');


			var map = scope.map;
			var view = map.getView();

			scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});


			// Toma lng y lat de un resultado cliqueado y mueve el mapa
			// hacia él
		    scope.moveToSearchResult = function(result){
		    	var newCenter = ol.proj.transform([parseFloat(result.lon),parseFloat(result.lat)], 'EPSG:4326', 'EPSG:900913');
	    		var pan = ol.animation.pan({
				    duration: 2000,
				    source: /** @type {ol.Coordinate} */ (view.getCenter())
			  	});
				map.beforeRender(pan);
				view.setCenter(newCenter);
		    }

	  		scope.openBox = function(){
	  			
	  		}

	  		scope.closeBox = function(){
	  			
	  		}

		},
		controller: function($scope){
			$scope.boxTitle = "Resultados de busqueda";


		}
	}
})
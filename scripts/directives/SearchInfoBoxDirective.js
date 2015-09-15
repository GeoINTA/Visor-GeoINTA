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
			var markerContainerID = "searchMarkerContainer";
			var markerElementID = "searchMarker";
			var markerLabelElementID = "searckMarkerLabel";

			scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});

	  		scope.showMarker = function(){
	  			$('#'+ markerElementID).show();
	  			$('#'+ markerLabelElementID).show();
	  		}

	  		scope.hideMarker = function(){
	  			$('#'+ markerElementID).hide();
	  			$('#'+ markerLabelElementID).hide();
	  		}

			$('#searchMarkerCheckbox').change(function() {
		        if($(this).is(":checked")) {
		            scope.showMarker();
		        } else {
		        	scope.hideMarker();
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
				view.setZoom(8);
				// Seteo centro marker
				scope.marker = new ol.Overlay({
				  position: newCenter,
				  positioning: 'center-center',
				  element: document.getElementById(markerElementID),
				  stopEvent: false
				});
				map.addOverlay(scope.marker);
				// Seteo centro label marker
				scope.markerLabel = new ol.Overlay({
				  position: newCenter,
				  element: document.getElementById(markerLabelElementID)
				});
				$(scope.markerLabelElement).text(result.name);
				map.addOverlay(scope.markerLabel);
		    }

		    scope.createMarkerElements = function(){
		    	scope.markerContainer = document.createElement('div');
		    	$(scope.markerContainer).attr('id', markerContainerID);
		    	$(scope.markerContainer).appendTo($("#toolsContainer"))
				scope.markerElement = document.createElement('div');
				$(scope.markerElement).attr('id', markerElementID);
				$(scope.markerElement).appendTo($(scope.markerContainer)) 
				scope.markerLabelElement = document.createElement('a');
				$(scope.markerLabelElement).attr('id', markerLabelElementID);
				$(scope.markerLabelElement).appendTo($(scope.markerContainer)) 
		    }

	  		scope.openBox = function(){
	  			
	  		}

	  		scope.closeBox = function(){
	  			
	  		}

	  		scope.createMarkerElements();

		},
		controller: function($scope){
			$scope.boxTitle = "Resultados de busqueda";

			$scope.markerContainer = null;
			$scope.markerElement = null;
			$scope.marker = null;
			$scope.markerLabelElement = null;
			$scope.markerLabel = null;

		}
	}
})
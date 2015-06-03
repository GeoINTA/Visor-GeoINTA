angular.module('visorINTA.directives.LayerInfoBoxDirective', [])
.directive('layerInfoBox', function() {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			activeLayer : '='
		},
		templateUrl:"templates/box/layerInfoBoxTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.boxTitle);
			visorBoxCtrlr.setBoxType('info');


			scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});


	  		scope.openBox = function(){
	  			console.log(scope.activeLayer);
	  		}

	  		scope.closeBox = function(){
	  			
	  		}

		},
		controller: function($scope){
			$scope.boxTitle = "Informacion de capa";
		}
	}
})
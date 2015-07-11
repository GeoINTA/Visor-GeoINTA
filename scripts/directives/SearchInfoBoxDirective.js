angular.module('visorINTA.directives.SearchInfoBoxDirective', [])
.directive('searchInfoBox', function($rootScope,MapUtils) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			map : '=',
			data : '='
		},
		templateUrl:"templates/box/SearchInfoBoxTemplate.html",
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
	  			
	  		}

	  		scope.closeBox = function(){
	  			
	  		}

		},
		controller: function($scope){
			$scope.boxTitle = "Resultados de busqueda";


		}
	}
})
angular.module('visorINTA.directives.NavbarSearchDirective', [])
.directive('navbarSearch', function($rootScope,boxActions) {
	return {
		restrict: "E",
		scope:{
			map : '=',
			activeLayerList : '=activeLayer'
		},
		templateUrl:"templates/navbarSearch.html",
		link:function(scope, iElement, iAttrs) {



			scope.search = function(){
				$rootScope.initBoxAction('searchInfoBox','info',boxActions["OPEN"]);

			}

		}
	}
})


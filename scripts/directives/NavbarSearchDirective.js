angular.module('visorINTA.directives.NavbarSearchDirective', [])
.directive('navbarSearch', function($rootScope,SearchService,boxActions) {
	return {
		restrict: "E",
		scope:{
			map : '=',
			data : '=',
			maxUserSearchs : '='
		},
		templateUrl:"templates/navbarSearch.html",
		link:function(scope, iElement, iAttrs) {

			scope.search = function(){
				if (scope.searchString && scope.searchString != ""){
					var $btn = $('#startSearchButton').button('loading');
					SearchService.search(scope.normalize(scope.searchString))
		  			.then(function success(response) {
		  				searchResult = response.data;
		  				if (searchResult.resultados){ // false si no hubo coincidencias
							$rootScope.initBoxAction('searchInfoBox','info',boxActions["OPEN"]);
							scope.appendData(searchResult);
		  				}
				    })
				   	.catch(function error(msg) {
				       console.log("No es posible realizar la busqueda. Chequee servicio");
		   			}).finally(function() {
					  $btn.button('reset');
					});
			   }
			}

			scope.normalize = function(searchString){
				return searchString;
			}


			scope.appendData = function(result){
				scope.data.unshift(result); // inserto al inicio de la lista
				// Si hay mas búsquedas de las que quiero, elimino la última
				if (scope.data.length > scope.maxUserSearchs){
					scope.data.splice(-1,1); 
				}
			}

		}
	}
})
.filter("round", function () {
        return function(input, precision) {
            return input ?
                parseFloat(input).toFixed(precision) :
                "";
        };
});


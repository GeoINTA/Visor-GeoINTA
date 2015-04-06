angular.module('visorINTA.directives.ProyectListDirective', ['visorINTA.factories.ProyectsFactory'])
.directive('proyectList',['ProyectsFactory', function(ProyectsFactory) {
	return {
		restrict: 'EA',
		scope : {
			map : '=map',
			proyects: '=',
			activeProyect : '=',
			updateActiveProyect : '&', // funcion a la que se llama cuando se selecciona un proyecto
		},
		templateUrl:"templates/menu/proyectList.html",
		link: function(scope, iElement, iAttrs, ctrl) {

		},
		controller: function($scope){
		},
	};
}]);
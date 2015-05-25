angular.module('visorINTA.directives.VisorBoxDirective', [])
.directive('visorBox', function() {
	return {
		restrict: "E",
		transclude:true,
		replace:true,
		scope:{

		},
		templateUrl:"templates/VisorBoxTemplate.html",
		link:function(scope, element, attrs) {
			$(element).draggable({ cursor: "move",handle:".panel-heading"});


			scope.visorBoxClosed = function(){
				boxID = $(element).attr('id');
				// Aviso a lo hijos que la caja se cierra
				scope.$broadcast('visorBoxClicked',{type:scope.boxType,id:boxID});
				
			}
		},
		controller: function($scope){
			$scope.title = "";
			$scope.boxType = "abstract";
			$scope.isOpen = false;


			// Titulo a mostrar en la caja
			this.setTitle = function(title){
				$scope.title = title;
			}

			// La caja puede contener diferentes tipos de contenido
			// Por ej: herramienta, cuadro de informacion
			// Es importante setearlo asi luego se sabe que tipo de caja esta
			// lanzando un evento
			this.setBoxType = function(type){
				$scope.boxType = type;
			}

			this.setIsOpen = function(bool){
				$scope.isOpen = bool;
			}

		}
	}
})
angular.module('visorINTA.directives.VisorBoxDirective', ['visorINTA.utils.VisorBoxManagerService'])
.directive('visorBox', function(boxActions,VisorBoxManager) {
	return {
		restrict: "E",
		transclude:true,
		replace:true,
		scope:{

		},
		templateUrl:"templates/VisorBoxTemplate.html",
		link:function(scope, element, attrs) {
			var boxID = $(element).attr('id');
			$(element).draggable({ cursor: "move"});


			scope.visorBoxClosed = function(){
				// Aviso a lo hijos que la caja se cierra
				scope.updateBoxState(boxActions['CLOSE']);
			}

			scope.updateBoxState = function(action){
				var isEnabled = VisorBoxManager.doAction(action,boxID);
				scope.setIsOpen(isEnabled);
				newState = (isEnabled) ? boxActions['OPEN'] : boxActions['CLOSE'];
				scope.emitEvent(newState);
			}

			// Emite eventos 'visorBoxEvent'
			// 'visorBoxEvent', solo es iniciado por esta directiva,
			// Notar que el evento 'visorBoxClicked' es iniciado desde afuera de aqui, y es escuchado
			// solamente
			scope.emitEvent = function(actionTriggered){
				scope.$broadcast('visorBoxEvent',{id:boxID,type:scope.boxType,action:actionTriggered});
			}


			scope.$on('visorBoxClicked', function (event, data) {
				if (data.id == boxID){
					scope.updateBoxState(data.action);
				}
	  		});

			VisorBoxManager.addBox(boxID);

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

			// TO FIX
			this.setIsOpen = function(bool){
				$scope.isOpen = bool;
			}

			$scope.setIsOpen = function(bool){
				$scope.isOpen = bool;
			}

		}
	}
})
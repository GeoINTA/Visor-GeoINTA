angular.module('visorINTA.tools.importWms.importWmsDirective', [])
.directive('importWmsTool', function(ToolsManager) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '='
		},
		templateUrl:"templates/tools/importWmsTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.toolTitle);
			visorBoxCtrlr.setBoxType('tool');


			scope.$on('visorBoxClicked', function (event, data) {
	    		if (data.type == 'tool' && data.id == scope.toolName){
			        // Cambio estado de la herramienta
      				ToolsManager.toogleTool(data.id);
	    			if (ToolsManager.isToolEnabled(scope.toolName)){
						visorBoxCtrlr.setIsOpen(true);
						scope.openTool();
	    			} else {
    					visorBoxCtrlr.setIsOpen(false);
	    				scope.closeTool();
	    			}
	    		}
	  		});


	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){

	        }


		},
		controller: function($scope){
			$scope.toolName = "importWmsTool";
			$scope.toolTitle = "Importar capa WMS";
		}
	}

});
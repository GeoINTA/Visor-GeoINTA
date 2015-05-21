angular.module('visorINTA.tools.featureInfo.FeatureInfoDirective', [])
.directive('featureInfoTool', function(ToolsManager) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '=',
			layerList : '=',
		},
		templateUrl:"templates/tools/featureInfoTemplate.html",
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
	        	scope.infoReceived = [
	        		{
	        			"tabID" : "info_suelos",
	        			"title" : "Suelos",
	        			"infoType": "tuple",
	        			"info": {
	        				"Field1": "value1",
	        				"Field2": "value2",
	        				"FieldN": "valueN",
	        			}
	        		},
	        		{
	        			"tabID" : "info_clima",
	        			"title" : "Clima",
	        			"infoType": "tuple",
	        			"info": {
	        				"Field1": "value1",
	        				"FieldN": "valueN",
	        			}
	        		}
	        	];
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){
	        }


	        scope.init = function(){

	        }

		},
		controller: function($scope){
			$scope.toolName = "featureInfoTool";
			$scope.toolTitle = "Informacion";

			$scope.infoReceived = []; // almacena la informacion recibida

		}
	}

});
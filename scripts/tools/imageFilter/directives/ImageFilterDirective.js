angular.module('visorINTA.tools.imageFilter.ImageFilterDirective', [])
.directive('imageFilterTool', function(ToolsManager) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '='
		},
		templateUrl:"templates/tools/imageFilterTemplate.html",
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

	        scope.applyFilter = function(){
	        }

            
		},
		controller: function($scope){
			$scope.toolName = "imageFilterTool";
			$scope.toolTitle = "Aplicar filtro";
			$scope.drawType = "Point";

			$scope.filterTypes = [
				{
					value:"sharpen",
					title:"Sharpen",
					kernel:[
					    0, -1, 0,
					    -1, 5, -1,
					    0, -1, 0
					  ]
				},
				{
					value:"sharpenless",
					title:"Sharpenless",
					kernel:[
					    0, -1, 0,
					    -1, 10, -1,
					    0, -1, 0
					  ]
				},
				{
					value:"blur",
					title:"Blur",
					kernel:[
						1, 1, 1,
						1, 1, 1,
						1, 1, 1
					  ]
				},
				{
					value:"shadow",
					title:"Shadow",
					kernel:[
						1, 2, 1,
						0, 1, 0,
						-1, -2, -1	
					  ]
				},
				{
					value:"emboss",
					title:"Realce",
					kernel:[
						-2, 1, 0,
						-1, 1, 1,
						0, 1, 2
					  ]
				},
				{
					value:"edgedetect",
					title:"Deteccion de bordes",
					kernel:[
						0, 1, 0,
						1, -4, 1,
						0, 1, 0
					  ]
				},
			];
		}
	}

});
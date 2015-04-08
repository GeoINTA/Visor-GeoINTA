angular.module('visorINTA.tools.toolsModule', [
		'visorINTA.tools.drawModule'
])

.service('ToolsManager', function () {

	this.tools = {
		"draw" : {"enabled":false}
	}

    this.enableTool = function (tool,boolValue) {
        this.tools[tool]["enabled"] = boolValue;
    }

    this.isToolEnabled = function(tool){
    	return this.tools[tool]["enabled"];
    }

    this.toogleTool = function(tool){
    	this.tools[tool]["enabled"] = !this.tools[tool]["enabled"];
    }

})

.directive('toolBox', function() {
	return {
		restrict: "E",
		transclude:true,
		replace:true,
		scope:{

		},
		template:"<div class='panel panel-default toolBox'><div class='panel-heading'><h3 class='panel-title'>{{title}}</h3></div><div ng-transclude class='panel-body'></div></div>",
		link:function(scope, element, attrs) {
			$(element).draggable({ cursor: "move",});
		},
		controller: function($scope){
			$scope.title = "";


			this.setTitle = function(title){
				$scope.title = title;
			}
		}
	}
})
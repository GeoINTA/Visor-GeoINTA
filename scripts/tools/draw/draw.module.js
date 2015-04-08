angular.module('visorINTA.tools.drawModule', [
		'visorINTA.tools.draw.DrawDirective'
	])
.controller('DrawController', ['$rootScope','$scope','ToolsManager', function($rootScope,$scope,ToolsManager) {

	$scope.toolName = "draw";

	$scope.run = function(){
		
	}


}]);
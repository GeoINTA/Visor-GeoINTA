angular.module('visorINTA.tools.spyLayerModule', [
		'visorINTA.tools.spyLayer.SpyLayerDirective'
	])
.controller('SpyLayerController', ['$rootScope','$scope','ToolsManager', function($rootScope,$scope,ToolsManager) {

	$scope.toolName = "spyLayerTool";

	$scope.run = function(){
		
	}


}]);
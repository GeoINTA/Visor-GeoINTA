angular.module('visorINTA.tools.measureModule', [
		'visorINTA.tools.measure.MeasureDirective'
	])
.controller('MeasureController', ['$rootScope','$scope','ToolsManager', function($rootScope,$scope,ToolsManager) {

	$scope.toolName = "measureTool";

	$scope.run = function(){
		
	}


}]);
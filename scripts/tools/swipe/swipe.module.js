angular.module('visorINTA.tools.swipeModule', [
		'visorINTA.tools.swipe.SwipeDirective'
	])
.controller('SwipeController', ['$rootScope','$scope','ToolsManager', function($rootScope,$scope,ToolsManager) {

	$scope.toolName = "swipeTool";

	$scope.run = function(){
		
	}


}]);
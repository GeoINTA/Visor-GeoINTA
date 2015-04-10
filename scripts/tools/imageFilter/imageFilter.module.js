angular.module('visorINTA.tools.imageFilterModule', [
		'visorINTA.tools.imageFilter.ImageFilterDirective'
	])
.controller('ImageFilterController', ['$rootScope','$scope','ToolsManager', function($rootScope,$scope,ToolsManager) {

	$scope.toolName = "imageFilter";

	$scope.run = function(){
		
	}


}]);
angular.module('visorINTA.tools.featureInfoModule', [
		'visorINTA.tools.featureInfo.FeatureInfoDirective'
	])
.controller('FeatureInfoController', ['$rootScope','$scope','ToolsManager', function($rootScope,$scope,ToolsManager) {

	$scope.toolName = "featureInfo";

	$scope.run = function(){
		
	}


}]);
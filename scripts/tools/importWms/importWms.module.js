angular.module('visorINTA.tools.importWmsModule', [
		'visorINTA.tools.importWms.importWmsDirective'
	])
.controller('ImportWmsController', ['$rootScope','$scope','ToolsManager', function($rootScope,$scope,ToolsManager) {

	$scope.toolName = "importWms";

	$scope.run = function(){
		
	}


}]);
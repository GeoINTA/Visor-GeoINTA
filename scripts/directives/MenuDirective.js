angular.module('visorINTA.directives.menudirectives', [])
  .directive('mainMenuElement', function() {
  	return {
  		restrict:'EA',
  		scope : {
  			menuElement : "=data",
  		},
  		templateUrl:'templates/menuElement.html',
  		controller: function($scope){
  		},
      replace:false,
  	}
});
 
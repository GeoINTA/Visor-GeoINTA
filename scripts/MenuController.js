angular.module('visorINTA.menuControllers', [])
.controller('MenuController', ['$scope', function($scope) {
 
    $scope.proyectos = function() {
      console.log("proyectos");
    };
 
    $scope.capas = function() {
         console.log("capas");     
    };
 
    $scope.herramientas = function() {
        console.log("herramientas");
    };
  }]);
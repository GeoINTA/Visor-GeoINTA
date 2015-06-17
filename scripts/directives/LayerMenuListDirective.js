angular.module('visorINTA.directives.LayerMenuListDirective', [])
.directive('layerMenuList', function($timeout,boxActions,MapUtils) {
	return {
		restrict: 'EA',
		scope : {
			map : '=map',
			layersList:"=",
			showCheckbox:"="
		},
		templateUrl:"templates/menu/layerMenuList.html",
		//template:"<li class='list-group-item' ng-repeat='layer in reverse(layersNames)'>{{layer}}</li>",
		link: function(scope, iElement, iAttrs, ctrl) {
			bindLayersControls();
			

			scope.$watchCollection('layersList', function(newValue, oldValue) {
                if (newValue === oldValue){ // al inicio, los dos tienen el mismo valor
      				return;
				};
            	bindLayersControls();
            });


            function bindLayersControls(){
            	$timeout(function(){
		            	for (var i = 0 ; i < scope.layersList.length; i++){
							var layerObject = scope.layersList[i];
							layerID = layerObject.get('id');
							var element = document.getElementById('opacity' + layerID);
							$(element).val(layerObject.getOpacity());
							$(element).on("change", function() {
								layer = MapUtils.getLayerBy(scope.map,'id',$(this).attr('name'));
		      					layer.setOpacity($(this).val()); // max = 1, min = 0
		    				});
							if (scope.showCheckbox){
								var inputCheck = document.getElementById("chck" + layerID);
								inputCheck.checked = layerObject.getVisible();
								inputCheck.addEventListener('change', function() {
								  var checked = this.checked;
								  layer = MapUtils.getLayerBy(scope.map,'id',$(this).attr('name'));
								  if (checked !== layer.getVisible()) {
								    layer.setVisible(checked);
								  }
								});

								layerObject.on('change:visible', function() {
								  var visible = this.getVisible();
								  inputCheck = document.getElementById("chck" + this.get('title'));
								  if (inputCheck && (visible !== inputCheck.checked)) {
								    inputCheck.checked = visible;
								  }
								});
							}
						}
            	});
            };
      		
		},
		controller: function($scope,$rootScope){
			$scope.layerTitleList = {};

			$scope.reverse = function(array) {
	            var copy = [].concat(array);
	            return copy.reverse();
        	}

        	$scope.getLayerIDs = function(){
        		var names = [];
        		for (var i = $scope.layersList.length - 1; i >= 0  ; i--){
        			names.push($scope.layersList[i].get('id'));
        		}
        		return names;
        	}

        	$scope.getLayerTitle = function(layerID){
        		layerTitle = $scope.layerTitleList[layerID] || null; // memoize
        		if (layerTitle){  
        			return layerTitle;
        		} else {
	        		for (var i = $scope.layersList.length - 1; i >= 0  ; i--){
	        			if ($scope.layersList[i].get('id') == layerID){
	        				title = $scope.layersList[i].get('title');
	        				$scope.layerTitleList[layerID] = title;
	        				return title;
	        			}
	        		}
	        	}
        		return 'no_id';
        	}
 			
 			// Muestra box con detalles de la capa
 			// Le avisa al controlador principal que haga visible la caja de informacion de capa
 			// Actualiza la capa de la cual tiene que mostrarse informacion
 			$scope.showLayerInfo = function(layer){
 				console.log(layer);
 				$rootScope.updateLayerInfoActive(layer);
 				$rootScope.initBoxAction('layerInfoBox','info',boxActions["OPEN"]);
 			}

  		},

	}
});
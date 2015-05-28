angular.module('visorINTA.directives.LayersTreeDirective', [])
.directive('layersTree', function($rootScope,MapUtils) {
	return {
		restrict: 'EA',
		scope : {
			map : '=map',
			layersTree:"=tree",
		},
		templateUrl:"templates/menu/layersTree.html",
		//template: '<div><ul><layer-tree-object ng-repeat="node in layersTree" node="node"></treeview-item></ul></div>',
		link: function(scope , element, iAttrs, ctrl) {
			$(element).off('click').on('click', 'label.tree-toggler', function() {
				$(this).parent().children('ul.tree').toggle(500);
			});

			$(element).on('change', '.treeLayerChck', function() {
				layerObject = MapUtils.getLayerByTitle(scope.map,this.name);
				if (this.checked){
					$rootScope.addActiveLayer(layerObject);
				} else {
					$rootScope.removeActiveLayer(layerObject);
				}
			});
    

		},
		controller: function($scope){
  		},

	}
})
.directive('layerTreeObject', function($rootScope,$compile,$timeout,MapUtils) {
	return {
		restrict: 'E',
		scope : {
			map : '=map',
			node : '=',
		},
		templateUrl:"templates/menu/layersTreeObject.html",
		link: function(scope, element, iAttrs, ctrl) {
			var node = scope.node;

			function initNode(){
				if (node.leaf){
					node.layerName = node.layerNames[0];
					node.layerObject = MapUtils.getLayerByTitle(scope.map,node.text);
					if (node.checked){
						$rootScope.addActiveLayer(node.layerObject);
					}
					bindNodeControls();
				}
			}
        		
        	function bindNodeControls(){	
        		// bind checkbox
				var inputCheck = document.getElementById("chckTree" + node.layerObject.get('title'));
				inputCheck.checked = node.checked;
				inputCheck.addEventListener('change', function() {
				  var checked = this.checked;
				  layer = MapUtils.getLayerByTitle(scope.map,$(this).attr('name'));
				  if (checked !== layer.getVisible()) {
				    layer.setVisible(checked);
				  }
				});

				node.layerObject.on('change:visible', function() {
				  var visible = this.getVisible();
				  inputCheck = document.getElementById("chckTree" + this.get('title'));
				  //console.log($(this).attr('name'));
				  if (visible !== inputCheck.checked) {
				    inputCheck.checked = visible;
				  }
				});
				//inputCheck.bindTo('checked', node.layerObject, 'visible');
				// cambio estado checkbox


    	}

    	$timeout(function(){
			initNode();
		});	


		// WATCH //

  		scope.$watch('node.children', function() {
  			list = $(element).children('li');
  			displayStyle = (node.children && node.expanded) ? "display:block" : "display:none";
            list.append($compile('<ul class="tree" style="'+displayStyle+'"><layer-tree-object map="map" ng-repeat="node in node.children" node="node"></layer-tree-object></ul>')(scope));
        });		





		},
		controller: function($scope){
  		},

	}
})
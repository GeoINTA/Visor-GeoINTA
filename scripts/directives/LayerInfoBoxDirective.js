angular.module('visorINTA.directives.LayerInfoBoxDirective', [])
.directive('layerInfoBox', function($rootScope,MapUtils) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			map : '=',
			activeLayerList : '=activeLayer'
		},
		templateUrl:"templates/box/layerInfoBoxTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.boxTitle);
			visorBoxCtrlr.setBoxType('info');


			scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});

	  		scope.$watch("activeLayerList", function(newType, oldType){
		        if (newType === oldType){ // al inicio, los dos tienen el mismo valor
		          return;
		        }
		        scope.activeLayer = scope.activeLayerList[0];
		        scope.updateLayerInfo();
		    },true);


		    scope.updateLayerInfo = function(){
		    	scope.updateLayerObject();
		    	scope.activeLayertitle = scope.getLayerTitle();
		    	scope.activeLayerLegend = scope.getLayerLegend();
		    }

		    scope.updateLayerObject = function(){
		    	scope.layerObject = MapUtils.getLayerBy(scope.map,'id',scope.activeLayer);
		    }

	  		scope.getLayerTitle = function(){
	  			layer = scope.layerObject;
	  			if (layer){
	  				return layer.get('title');
	  			}
	  			return "";
	  		}

	  		scope.getLayerLegend = function(){
	  			layer = scope.layerObject;
	  			if (layer){
	  				layerURL = layer.get('legendURL');
	  				source = scope.baseLegendParams;
	  				layerMetadata = MapUtils.getLayerParams(layer.get('id'));
	  				source['LAYER'] = layerMetadata['layerName'];
	  				source['STYLE'] = layerMetadata['layerStyle'];
	  				legendURL = layerURL + '?' + scope.encodeQueryData(source);
	  				return legendURL;
	  			} else {
	  				scope.layerLegendURL = null;
	  			}
	  		}


	  		scope.openBox = function(){
	  			
	  		}

	  		scope.closeBox = function(){
	  			
	  		}

		},
		controller: function($scope){
			$scope.boxTitle = "Informacion de capa";

			$scope.layerObject = null;
			$scope.activeLayertitle = "";
	    	$scope.activeLayerLegend = null;

			$scope.baseLegendParams = {
			    SERVICE: 'WMS',
			    REQUEST: 'GetLegendGraphic',
			    FORMAT: 'image/png',
			    WIDTH : '20',
			    HEIGHT: '20',
			    VERSION: '1.0.0',
			}

			$scope.encodeQueryData = function(data){
			   var ret = [];
			   for (var d in data)
			      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
			   return ret.join("&");
			}
		}
	}
})
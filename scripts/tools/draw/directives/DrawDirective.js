angular.module('visorINTA.tools.draw.DrawDirective', [])
.directive('drawTool', function($rootScope, MapUtils) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '='
		},
		templateUrl:"templates/tools/drawTemplate.html",
		link:function(scope, iElement, iAttrs,visorBoxCtrlr) {
			visorBoxCtrlr.setTitle(scope.toolTitle);
			visorBoxCtrlr.setBoxType('tool');


			scope.$on('visorBoxEvent', function (event, data) {
	    		if (data.action == 'open'){
	    			scope.openBox();
	    		} else {
	    			scope.closeBox();
	    		}
	  		});

			// Agrego interaccion al mapa
			var map = scope.map;
	        var source = new ol.source.Vector();
		    var draw = new ol.interaction.Draw({
		      source: source,
		      type: /** @type {ol.geom.GeometryType} */ ("Point")
		    });
		    var vector = null;

	        scope.initDrawLayer = function(){
				vector = new ol.layer.Vector({
					source: source,
					id: MapUtils.constructLayerIdentifier(MapUtils.getToolLayerServer(),'draw','no_style'),
					title:scope.toolTitle,
					style: new ol.style.Style({
						fill: new ol.style.Fill({
						  color: 'rgba(255, 255, 255, 0.2)'
						}),
						stroke: new ol.style.Stroke({
						  color: '#ffcc33',
						  width: 2
						}),
						image: new ol.style.Circle({
						  radius: 7,
						  fill: new ol.style.Fill({
						    color: '#ffcc33'
						  })
						})
					})
				});
				$rootScope.addActiveLayer(vector);
	        }

	        // Acciones a realizar cuando se abre la herramienta
	        scope.openBox = function(){
	        	if (vector == null){
	        		scope.initDrawLayer();
	        	}
	        	map.addInteraction(draw);	
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeBox = function(){
	        	map.removeInteraction(draw);
	        }

	        scope.clearMapFeatures = function(){
	        	source.clear();
	        }

            scope.$watch("drawType", function(newType, oldType){
		        if (newType === oldType){ // al inicio, los dos tienen el mismo valor
		          return;
		        }
		        scope.typeDrawChanged();
		    });

	        // Usuario cambia tipo de objecto a dibujar
	        scope.typeDrawChanged = function(){
	        	map.removeInteraction(draw);
	        	draw = new ol.interaction.Draw({
		      		source: source,
		      		type: /** @type {ol.geom.GeometryType} */ (scope.drawType)
		    	});
		    	map.addInteraction(draw);
	        }

		},
		controller: function($scope){
			$scope.toolName = "drawTool";
			$scope.toolTitle = "Dibujar";
			$scope.drawType = "Point";

			$scope.drawObjectsTypes = [
				{value:"Point",title:"Punto"},
				{value:"LineString",title:"Linea"},
				{value:"Polygon",title:"Poligono"},
				{value:"Circle",title:"Circulo"},
			];
		}
	}

});
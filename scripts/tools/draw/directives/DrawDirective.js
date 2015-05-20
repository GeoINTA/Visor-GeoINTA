angular.module('visorINTA.tools.draw.DrawDirective', [])
.directive('drawTool', function(ToolsManager) {
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


			scope.$on('visorBoxClicked', function (event, data) {
	    		if (data.type == 'tool' && data.id == scope.toolName){
			        // Cambio estado de la herramienta
      				ToolsManager.toogleTool(data.id);
	    			if (ToolsManager.isToolEnabled(scope.toolName)){
						visorBoxCtrlr.setIsOpen(true);
						scope.openTool();
	    			} else {
    					visorBoxCtrlr.setIsOpen(false);
	    				scope.closeTool();
	    			}
	    		}
	  		});

			// Agrego interaccion al mapa
			var map = scope.map;
	        var source = new ol.source.Vector();
		    var draw = new ol.interaction.Draw({
		      source: source,
		      type: /** @type {ol.geom.GeometryType} */ ("Point")
		    });
	        var vector = new ol.layer.Vector({
			  source: source,
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
	        map.addLayer(vector);

	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        	map.addInteraction(draw);	
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        scope.closeTool = function(){
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
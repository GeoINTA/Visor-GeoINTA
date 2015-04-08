angular.module('visorINTA.tools.draw.DrawDirective', [])
.directive('drawTool', function(ToolsManager) {
	return {
		restrict: "E",
		require:'^toolBox',
		scope:{
			title:'@',
			map: '='
		},
		templateUrl:"templates/tools/drawTemplate.html",
		link:function(scope, iElement, iAttrs,toolBoxCtrl) {
			toolBoxCtrl.setTitle(scope.toolTitle);


			scope.$on('toolClicked', function (event, data) {
				console.log(data);
	    		if (data == scope.toolName){
	    			ToolsManager.isToolEnabled(scope.toolName) ? openTool() : closeTool();
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
	        function openTool(){
	        	map.addInteraction(draw);	
	        }

	        // Acciones a realizar cuando se cierra la herramienta
	        function closeTool(){
	        	map.removeInteraction(draw);
	        }

            scope.$watch("drawType", function(newType, oldType){
		        if (newType === oldType){ // al inicio, los dos tienen el mismo valor
		          return;
		        }
		        scope.typeDrawChanged();
		    });

	        // Usuario cambia tipo de objecto a dibujar
	        scope.typeDrawChanged = function(){
	        	console.log(scope.drawType);
	        	map.removeInteraction(draw);
	        	draw = new ol.interaction.Draw({
		      		source: source,
		      		type: /** @type {ol.geom.GeometryType} */ (scope.drawType)
		    	});
		    	map.addInteraction(draw);
	        }

		},
		controller: function($scope){
			$scope.toolName = "draw";
			$scope.toolTitle = "Dibujar";
			$scope.drawType = "Point";

			$scope.drawObjectsTypes = [
				{value:"Point",title:"Punto"},
				{value:"LineString",title:"Linea"},
				{value:"Polygon",title:"Poligono"},
			];
		}
	}

});
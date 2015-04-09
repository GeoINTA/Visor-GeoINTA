angular.module('visorINTA.tools.measure.MeasureDirective', [])
.directive('measureTool', function(ToolsManager) {
	return {
		restrict: "E",
		require:'^visorBox',
		scope:{
			title:'@',
			map: '='
		},
		templateUrl:"templates/tools/measureTemplate.html",
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

			var map = scope.map;
			var draw;
			var source;
			var vector;
			var sketch;

			scope.addInteraction = function(){
				draw = new ol.interaction.Draw({
				    source: source,
				    type: /** @type {ol.geom.GeometryType} */ (scope.drawType),
				    style: new ol.style.Style({
				      fill: new ol.style.Fill({
				        color: 'rgba(255, 255, 255, 0.2)'
				      }),
				      stroke: new ol.style.Stroke({
				        color: 'rgba(0, 0, 0, 0.5)',
				        lineDash: [10, 10],
				        width: 2
				      }),
				      image: new ol.style.Circle({
				        radius: 5,
				        stroke: new ol.style.Stroke({
				          color: 'rgba(0, 0, 0, 0.7)'
				        }),
				        fill: new ol.style.Fill({
				          color: 'rgba(255, 255, 255, 0.2)'
				        })
				      })
				    })
			    });
			    map.addInteraction(draw);

			    draw.on('drawstart',function(evt) {
			        // set sketch
			        sketch = evt.feature;
			        scope.lastMeasure = 0;
			      }, this);

			     draw.on('drawend',function(evt) {
        			//measureTooltipElement.className = 'tooltip tooltip-static';
        			//measureTooltip.setOffset([0, -7]);
        			// unset sketch
        			sketch = null;
        			// unset tooltip so that a new one can be created
        			//measureTooltipElement = null;
        			//createMeasureTooltip();
        			//scope.updateMeasureValues();
      			}, this);
			}


			scope.handlePointerMove = function(evt){
				if (evt.dragging) {
			    return;
			  }
			  /** @type {string} */
			  //var helpMsg = 'Click to start drawing';
			  /** @type {ol.Coordinate|undefined} */
			  var tooltipCoord = evt.coordinate;
			  if (sketch) {
			    var output;
			    var geom = (sketch.getGeometry());
			    if (geom instanceof ol.geom.Polygon) {
			      output = scope.formatArea(/** @type {ol.geom.Polygon} */ (geom));
			      //helpMsg = continuePolygonMsg;
			      tooltipCoord = geom.getInteriorPoint().getCoordinates();
			    } else if (geom instanceof ol.geom.LineString) {
			      output = scope.formatLength( /** @type {ol.geom.LineString} */ (geom));
			      //helpMsg = continueLineMsg;
			      tooltipCoord = geom.getLastCoordinate();
			    }
			    //measureTooltipElement.innerHTML = output;
			    scope.lastMeasure = output;
			    scope.$apply();
			    //measureTooltip.setPosition(tooltipCoord);
			  }

			  //helpTooltipElement.innerHTML = helpMsg;
			  //helpTooltip.setPosition(evt.coordinate);
			}

			scope.formatArea = function(polygon){
				var area = polygon.getArea();
				var output;
				if (area > 10000) {
					output = (Math.round(area / 1000000 * 100) / 100) +
					    ' ' + 'km';
				} else {
					output = (Math.round(area * 100) / 100) +
					    ' ' + 'm';
				}
				return output;
			}

			scope.formatLength = function(line){
				var length = Math.round(line.getLength() * 100) / 100;
				var output;
				if (length > 100) {
				output = (Math.round(length / 1000 * 100) / 100) +
				    ' ' + 'km';
				} else {
				output = (Math.round(length * 100) / 100) +
				    ' ' + 'm';
				}
				return output;
			}


	        // Acciones a realizar cuando se abre la herramienta
	        scope.openTool = function(){
	        	scope.addInteraction();	
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
		    	scope.addInteraction();
	        }

	        scope.init = function(){
  				// Agrego interaccion al mapa
		        source = new ol.source.Vector();
		         vector = new ol.layer.Vector({
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
		        map.on('pointermove', scope.handlePointerMove);
	  		}

	        scope.init();

		},
		controller: function($scope){
			$scope.toolName = "measureTool";
			$scope.toolTitle = "Medir";
			$scope.lastMeasure = 0;
			//
			$scope.drawType = "Polygon";

			$scope.drawObjectsTypes = [
				{value:"LineString",title:"Longitud"},
				{value:"Polygon",title:"Area"},
			];
		}
	}

});
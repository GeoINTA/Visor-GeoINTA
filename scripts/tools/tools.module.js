angular.module('visorINTA.tools.toolsModule', [
		'visorINTA.tools.drawModule',
        'visorINTA.tools.measureModule',
        'visorINTA.tools.spyLayerModule',
        'visorINTA.tools.swipeModule',
        'visorINTA.tools.imageFilterModule',
        'visorINTA.tools.importWmsModule'
])

.service('ToolsManager', function () {

	this.tools = {
		"drawTool" : {"enabled":false},
        "measureTool" : {"enabled":false},
        "spyLayerTool" : {"enabled":false},
        "swipeTool" : {"enabled":false},
        "imageFilterTool" : {"enabled":false},
        "importWmsTool" : {"enabled":false},
	}

    this.enableTool = function (tool,boolValue) {
        this.tools[tool]["enabled"] = boolValue;
    }

    this.isToolEnabled = function(tool){
    	return this.tools[tool]["enabled"];
    }

    this.toogleTool = function(tool){
    	this.tools[tool]["enabled"] = !this.tools[tool]["enabled"];
    }

})
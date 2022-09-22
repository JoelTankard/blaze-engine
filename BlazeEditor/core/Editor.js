import * as go from 'gojs';

import RealtimeDragSelectingTool from './utils/RealtimeDragSelecting';


const $ = go.GraphObject.make;



const OPTIONS = {
    "undoManager.isEnabled": true,
    // "grid.gridCellSize": new go.Size(20, 20),
    "draggingTool.dragsTree": false,
    "panningTool.isEnabled": false,
    "commandHandler.zoomFactor": 1.3,
    "toolManager.dragSelectingTool": $(RealtimeDragSelectingTool, {
            isPartialInclusion: true,
            delay: 50
        },
        {
            box: $(go.Part,  // replace the magenta box with a red one
            { layerName: "Tool", selectable: false },
            $(go.Shape,
                {
                name: "SHAPE", fill: "rgba(0,0,255,0.1)",
                stroke: "blue", strokeWidth: 1
                }))
        })
  };

export default class Editor {
    constructor(elementId, config) {
        this.config = config;


        this.editor = new go.Diagram(elementId, OPTIONS);

        // Grid background
        // this.editor.grid = $(go.Panel, "Grid", { gridCellSize: new go.Size(20,  20) }, $(go.Shape, "LineH", { strokeWidth: 0.5, strokeDashArray: [0, 19.5, 0.5, 0] }));

        // Realtime drag select
    }

    set(key,value) {
        this.editor[key] = value;
    }


}


Editor.prototype.makeObject = $;
Editor.prototype.go = go;

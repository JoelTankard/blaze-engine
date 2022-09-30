import * as go from 'gojs';
import RealtimeDragSelectingTool from './utils/RealtimeDragSelecting';
import { SnapLinkReshapingTool } from './utils/SnapLinkReshapingTool';
import { hexOpacity } from './utils/Colors';

const $ = go.GraphObject.make;
const CELL = 128;

const OPTIONS = {
    "undoManager.isEnabled": true,
    // "grid.gridCellSize": new go.Size(20, 20),
    "draggingTool.dragsTree": false,
    "panningTool.isEnabled": false,
    "commandHandler.zoomFactor": 1.2,
  };

export default class Editor {
    constructor(elementId, config) {
        this.config = config;
        this.editor = new go.Diagram(elementId, OPTIONS);

        // Grid background
        // this.editor.toolManager.draggingTool.isGridSnapEnabled = true;

        const gridColor = hexOpacity( this.config.colors.neutral[900], 0.1);
        this.editor.grid = $(go.Panel, "Grid",
            { gridCellSize: new go.Size(CELL, CELL) },
            $(go.Shape, "LineH", { stroke:  gridColor, strokeWidth: 8, strokeDashArray: [0, CELL] }),
            $(go.Shape, "LineH", { stroke: gridColor, strokeWidth: 1 }),
            $(go.Shape, "LineV", { stroke: gridColor, strokeWidth: 1 }),
        );


        this.editor.toolManager.linkReshapingTool = $(SnapLinkReshapingTool, {
            isGridSnapEnabled: true,
            avoidsNodes: true,
            gridCellSize: new go.Size(CELL/2, CELL/2)
        });

        this.editor.toolManager.dragSelectingTool = $(RealtimeDragSelectingTool, {
            isPartialInclusion: true,
            delay: 50
        },
        {
            box: $(go.Part,  // replace the magenta box with a red one
            { layerName: "Tool", selectable: false },
            $(go.Shape,
                {
                name: "SHAPE", fill: hexOpacity(this.config.colors.blue[500], 0.1),
                stroke: hexOpacity(this.config.colors.blue[500], 1), strokeWidth: 1
                }))
        });

     
    //     $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 6 }),
    //     $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 6 }),
    //     $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 12 }),
    //     $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 12 })
        // $(go.Panel, "Grid", { defaultAlignment: new go.Spot(-1,0,-1,0),  gridCellSize: new go.Size(32,  32)}, $(go.Shape, "LineH", { strokeWidth: 2, strokeDashArray: [2, 30], stroke: color['slate-400'] }))
        // this.gridListener();
    }

    set(key,value) {
        this.editor[key] = value;
    }

    // gridListener() {
    //     // this.editor.addDiagramListener('ViewportBoundsChanged', (event) => {
    //     //     this.editor.grid.visible = event.diagram.scale >= 0.75
    //     // })
    // }


    startAnimations() {
        // Animate the flow in the pipes
        const animation = new go.Animation();
        animation.easing = go.Animation.EaseLinear;
        this.editor.links.each(link => animation.add(link.findObject("Link"), "strokeDashOffset", 20, 0));
        // Run indefinitely
        animation.runCount = Infinity;
        animation.start();
    }

}


Editor.prototype.$ = $;
Editor.prototype.go = go;

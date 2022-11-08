import * as go from 'gojs'
import RealtimeDragSelectingTool from './utils/realtimeDragSelecting'
import { SnapLinkReshapingTool } from './utils/snapLinkReshapingTool'
import { hexOpacity } from './utils/colors'

const $ = go.GraphObject.make
const CELL = 128

const OPTIONS = {
  'undoManager.isEnabled': true,
  // "grid.gridCellSize": new go.Size(20, 20),
  'draggingTool.dragsTree': false,
  'panningTool.isEnabled': false,
  'commandHandler.zoomFactor': 1.2
}

export default class Editor {
  constructor (elementId, config) {
    this.config = config
    this.editor = new go.Diagram(elementId, OPTIONS)

    this.createGrid()
    this.createLinkReshapingTool()
    this.createDragSelectingTool()
  }

  createGrid () {
    // Grid background
    this.editor.toolManager.draggingTool.isGridSnapEnabled = false

    const snapGridOpacity = isTrue => isTrue ? 1 : 0

    this.editor.grid = $(go.Panel, 'Grid',
      { gridCellSize: new go.Size(CELL, CELL) },
      $(go.Shape, 'LineH',
        { stroke: this.config.colors.slate[300], strokeWidth: 1 },
        new go.Binding('opacity', 'draggingTool.isGridSnapEnabled', snapGridOpacity),
        new go.AnimationTrigger('opacity', { duration: 100 })
      ),
      $(go.Shape, 'LineV',
        { stroke: this.config.colors.slate[300], strokeWidth: 1 },
        new go.Binding('opacity', 'draggingTool.isGridSnapEnabled', snapGridOpacity),
        new go.AnimationTrigger('opacity', { duration: 100 })
      ),
      $(go.Shape, 'LineV', { stroke: this.config.colors.slate[400], strokeWidth: 5, strokeDashArray: [0, CELL] })
    )
  }

  createLinkReshapingTool () {
    this.editor.toolManager.linkReshapingTool = $(SnapLinkReshapingTool, {
      isGridSnapEnabled: true,
      avoidsNodes: true,
      gridCellSize: new go.Size(CELL / 2, CELL / 2)
    })
  }

  createDragSelectingTool () {
    this.editor.toolManager.dragSelectingTool = $(RealtimeDragSelectingTool, {
      isPartialInclusion: true,
      delay: 50
    },
    {
      box: $(go.Part, // replace the magenta box with a red one
        { layerName: 'Tool', selectable: false },
        $(go.Shape,
          {
            name: 'SHAPE',
            fill: hexOpacity(this.config.colors.blue[500], 0.1),
            stroke: hexOpacity(this.config.colors.blue[500], 1),
            strokeWidth: 1
          }))
    })
  }

  set (key, value) {
    this.editor[key] = value
  }
}

Editor.prototype.$ = $
Editor.prototype.go = go

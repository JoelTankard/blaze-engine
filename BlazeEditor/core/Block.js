import BlazeConfig from '../blaze.config.js';
import { hexOpacity } from './utils/Colors';
const { colors } = BlazeConfig;
const $ = go.GraphObject.make;

const CELL = 128;

export default class Block {
    constructor(editor) {
        this.editor = editor;

        console.log('block: ', this.editor)
        
        this.color = colors.neutral[900];
        this.style = 'default';
        this.icon = '';
        
        this.dragging = false;
        this.lastPos = null;
        

        this.createArcRectangle();
        this.createPillRectangle();

        this.editor.click = this.$click;
        
    }

    createArcRectangle() {
        go.Shape.defineFigureGenerator("ArcRectangle", (shape, w, h) => {
            // this figure takes one parameter, the size of the corner
            var p1 = 40;  // default corner size
            var p2 = 0;
            if (shape !== null) {
              var param1 = shape.parameter1;
              var param2 = shape.parameter2;
              if (!isNaN(param1) && param1 >= 0) p1 = param1;  // can't be negative or NaN
              if (!isNaN(param2)) p2 = param2;  // can't be negative or NaN
            }
            p1 = Math.min(p1, w / 2);
            p1 = Math.min(p1, h / 2); 
             // limit by whole height or by half height?
            var geo = new go.Geometry();
            // a single figure consisting of straight lines and quarter-circle arcs
            geo.add(new go.PathFigure(0, p1 + p2)
                     .add(new go.PathSegment(go.PathSegment.QuadraticBezier, p1, p2, 0, p2))
                     .add(new go.PathSegment(go.PathSegment.Line, w - p1, p2))
                     .add(new go.PathSegment(go.PathSegment.QuadraticBezier, w, p1 + p2, w, p2))
                     .add(new go.PathSegment(go.PathSegment.Line, w, (h + p2) - p1))
                     .add(new go.PathSegment(go.PathSegment.QuadraticBezier, w - p1, h + p2, w, h + p2))
                     .add(new go.PathSegment(go.PathSegment.Line, p1, h + p2))
                     .add(new go.PathSegment(go.PathSegment.QuadraticBezier, 0, (h + p2) - p1, 0, h + p2).close()));
  
            return geo;
          });
    }

    createPillRectangle() {
        go.Shape.defineFigureGenerator("PillRectangle", (shape, w, h) => {
            // this figure takes one parameter, the size of the corner
            var p1 = h/2;  // default corner size
            var p2 = 0;
            if (shape !== null) {
                var param2 = shape.parameter2;
                if (!isNaN(param2)) p2 = param2;  // can't be negative or NaN
              }
             // limit by whole height or by half height?
            var geo = new go.Geometry();
            // a single figure consisting of straight lines and quarter-circle arcs
            geo.add(new go.PathFigure(p1, p2)
                .add(new go.PathSegment(go.PathSegment.Line, w - p1, p2))
                .add(new go.PathSegment(go.PathSegment.Bezier, w - p1, p2 + h, w + (p1/2), p2, w + (p1/2), p2 + h))
                .add(new go.PathSegment(go.PathSegment.Line, p1, p2 + h))
                .add(new go.PathSegment(go.PathSegment.Bezier, p1, p2, -(p1/2), p2 + h, -(p1/2), p2).close()));
  
            return geo;
          });
    }

    $click(e) {
        e.diagram.commit((d) => { d.clearHighlighteds(); }, "no highlighteds")
    }


    nodeTemplate() {
        const styleTypes = {
            'pill': {
                shape: 'PillRectangle',
                style: {
                    width: 128,
                    height: 48
                }
            },
            'default': {
                shape: 'ArcRectangle',
                style: {
                    width: 256,
                    height: 128
                }
            }
        }
        
        const blockStyle = styleTypes[this.style];

        const block =  $(go.Node, 'Spot', {
                cursor: 'grab',
                selectionAdornmentTemplate: 'none',
                locationSpot: go.Spot.Center, locationObjectName: "Block",
                click: this.onBlockClick
            },
            
            $(go.Panel, "Auto",
                {
                    name: 'BlockWrapper',
                    stretch: go.GraphObject.Fill,
                    alignment: go.Spot.Center,
                },
                $(go.Shape, blockStyle.shape,{
                    // isGeometryPositioned: true.
                    name: 'HighlightOutline',
                    fill: null,
                    stroke: hexOpacity(this.color, 0.5), 
                    strokeWidth: 1,
                    alignment: go.Spot.Center,
                    spot1: new go.Spot(0,0, 0, 0),
                    spot2: new go.Spot(1,1,0,0)
                },
                new go.Binding("strokeWidth", "isSelected", (isTrue, node) => {
                    const maxSize = isTrue ? 6 : 0;
                    node.spot1 =  new go.Spot(0,0, maxSize/2, maxSize/2);
                    node.spot2 = new go.Spot(1,1,-maxSize/2,-maxSize/2);
                    return  maxSize
                }).ofObject(),
                
                new go.AnimationTrigger('strokeWidth', { duration: 100 }),
                new go.AnimationTrigger('spot1', { duration: 100 }),
                new go.AnimationTrigger('spot2', { duration: 100 })
                ),
                
                $(go.Shape, blockStyle.shape, {
                    parameter1: 33,
                    name: 'Block',
                    fill: this.$color.white,
                    strokeWidth: 4,
                    stroke: this.color,
                    ...blockStyle.style,
                }),
              
                // new go.Binding("strokeWidth", this.dragging, () => this.dragging ? 12 : 6 )),
                // new go.Binding("spot1", this.dragging, () => this.dragging ? 12 : 6 ),
                // new go.Binding("spot2", this.dragging, () => this.dragging ? 12 : 6 ),
                // new go.AnimationTrigger('strokeWidth')),

               
                // $(go.Shape, blockStyle.shape, {
                //     parameter1: 34,
                //     fill: null,
                //     stroke: this.color, 
                //     strokeWidth: 4,
                //     margin: new go.Margin(2),
                //     ...blockStyle.style,
                // }),
        //    )
            // new go.Binding("shadowOffset", "isSelected", (s) => s ? new go.Point(0, liftHeight) :  new go.Point(0, 2) ).ofObject()
            )
        );
        // new go.TextBlock({ margin: 6, font: "18px sans-serif" }).bind("key"))


        const outlineCal = (HighlightOutline) => {
            const maxSize = this.dragging ? 12 : 6;
            HighlightOutline.spot1 =  new go.Spot(0,0, maxSize/2, maxSize/2);
            HighlightOutline.spot2 = new go.Spot(1,1,-maxSize/2,-maxSize/2)
            HighlightOutline.strokeWidth = maxSize;
        }
        // block.dragComputation = (node, point) => {
        //     const HighlightOutline = node.findObject('HighlightOutline');
        //     if (!this.lastPos) this.lastPos = point;
        //     if (this.lastPos.x === point.x && this.lastPos.y === point.y) {
        //         node.cursor = 'grab';
        //         // block.parameter2 = 0;
        //         // node.shadowOffset = new go.Point(0, 6);
        //         // node.scale = 1;
        //         this.dragging = false;
        //         outlineCal(HighlightOutline);

            
        //     } else {
        //         if (!this.dragging) {
        //             // block.parameter2 = -liftHeight;

        //             this.dragging = true;
        //             node.cursor = 'grabbing';
        //             outlineCal(HighlightOutline);

        //             // node.scale = 1.1;
        //             // node.shadowOffset = new go.Point(0, liftHeight);
        //         }
        //         // return new go.Point(point.x, point.y - liftHeight/2);
        //     }


        //     return point;

        // };

        return block;
    }


    onBlockClick(e, node) {
        var diagram = node.diagram;
        diagram.startTransaction("highlight");
        // remove any previous highlighting
        diagram.clearHighlighteds();
        // for each Link coming out of the Node, set Link.isHighlighted
        node.findLinksOutOf().each(function(l) { l.isHighlighted = true; });
        // for each Node destination for the Node, set Node.isHighlighted
        node.findNodesOutOf().each(function(n) { n.isHighlighted = true; });
        diagram.commitTransaction("highlight");

    }

    linkTemplate() {
        // console.log('this.editor', this.editor)
        const link = new go.Link({ 
            routing: go.Link.AvoidsNodes,
            corner: CELL/2,
            curve: go.Link.JumpGap,
            fromEndSegmentLength: CELL/4,
            toEndSegmentLength: CELL/4,
            toShortLength: 4,
            // curviness: CELL/4,
        })
        .add(
            $(go.Shape, 
                { name: 'Link', strokeWidth: 3, stroke: colors.black },
                new go.Binding("strokeDashArray", "isHighlighted", (isTrue) => isTrue ? [10, 10] : [0,0]).ofObject()
            )
        )
        .add(new go.Shape({ toArrow: "OpenTriangle", strokeWidth: 3, strokeCap: 'round', stroke: colors.black }))

        
       
        return link
    }
    
}

Block.prototype.$color = colors;
import BlazeConfig from '../blaze.config.js';
import { hexOpacity } from './utils/colors';
import * as shapeUtils from './utils/shapes'
const { colors } = BlazeConfig;
const $ = go.GraphObject.make;
import flex from "../core/utils/flex";
import NodeSection from "../components/nodeSection";
import Icon from '../components/icon.js';

const CELL = 128;


const styleTypes = {
    'pill': {
        shape: 'PillRectangle',
        alignment: go.Spot.LeftCenter,
        size: {
            width: 128,
            // height: 48
        }
    },
    'fixture-pill': {
        shape: 'PillRectangle',
        alignment: go.Spot.Center,
        fixture: true,
        margin: 15,
        size: {
            // width: 128,
            // height: 48
        }
    },
    'default': {
        shape: 'ArcRectangle',
        alignment:  go.Spot.TopLeft,
        size: {
            width: 256,
            // height: 128
        }
    }
}

export default class Block {
    constructor(editor) {
        this.editor = editor;

        this.color = colors.slate[500];
        this.style = 'default';
        this.icon = 'asterisk';
        this.title = 'Untitled Block'
        
        this.dragging = false;
        this.lastPos = null;
        this.blockStyle = null;

        shapeUtils.createArcRectangle();
        shapeUtils.createPillRectangle();

    }


    iconElement() {
        return $(go.Panel, "Spot",
            { 
                alignment: go.Spot.LeftCenter
            },
            $(go.Shape, "Circle", {
                fill: this.blockStyle.fixture ? this.color : this.$color.black,
                stroke: null,
                height: 28,
                width: 28,
            }),
            new Icon({ name: this.icon, fill:  this.blockStyle.fixture ? this.$color.black : this.color, size: 12 })
        )
    }

    titleElement() {
        return flex('row', {
                alignItems: 'center',
                margin: this.blockStyle?.margin || new go.Margin(10,15, 0 , 15),
            },

            //     alignment: go.Spot.LeftCenter,
            //     stretch: go.Spot.Fill
            // },
                this.iconElement(),
                $(go.TextBlock, this.title, {
                    verticalAlignment: go.Spot.Center,
                    margin: new go.Margin(0,0,0,5),
                    stroke: this.blockStyle.fixture ? this.$color.slate[200] : this.$color.black,
                    font: "500 italic 10pt Inter Tight"
                })
            // )
            
        )
    }


    nodeTemplate() {
        this.blockStyle = styleTypes[this.style];

        // const color =  this.blockStyle.fixture ? this.$color.black : this.color;

        const block =  $(go.Node, 'Spot', {
                cursor: 'grab',
                // selectionAdornmentTemplate: $(go.Adornment, "Auto",
                //     $(go.Panel, "Auto",
                //     {
                //         defaultStretch: go.GraphObject.Horizontal,
                //     },
                //         $(go.Shape, this.blockStyle.shape, {
                //             fill: null,
                //             stroke: this.$color.white, 
                //             strokeWidth: 3,
                //         }),
                //         // $(go.Shape, this.blockStyle.shape, {
                //         //     fill: null,
                //         //     stroke: this.$color.white, 
                //         //     strokeWidth: 1,
                //         // }),
                //     ),
                //     // new go.Binding("strokeWidth", "isSelected", (isTrue, node) => {
                //     //     const maxSize = isTrue ? 3 : 0;
                //     //     node.spot1 =  new go.Spot(0,0, maxSize/2, maxSize/2);
                //     //     node.spot2 = new go.Spot(1,1,-maxSize/2,-maxSize/2);
                //     //     return  maxSize
                //     // }).ofObject(),
                //     // new go.AnimationTrigger('strokeWidth', { duration: 100 }),
                //     // new go.AnimationTrigger('spot1', { duration: 100 }),
                //     // new go.AnimationTrigger('spot2', { duration: 100 })
                    
                // $(go.Placeholder)),
                locationSpot: go.Spot.Center, 
                locationObjectName: "Block",
                click: (e, node) => this.onBlockClick(e,node),
                
            },
            
            $(go.Panel, "Auto",
                {
                    name: 'BlockWrapper',
                    stretch: go.GraphObject.Fill,
                    alignment: go.Spot.Center,
                },
               

                $(go.Panel, "Auto",
                    {
                        // defaultStretch: go.GraphObject.Horizontal,
                        defaultAlignment: go.Spot.TopLeft,
                      
                    },
                    $(go.Shape, this.blockStyle.shape, {
                        name: 'BlockBackground',
                        parameter1: true,
                        name: 'Block',
                        fill: this.blockStyle.fixture ? this.$color.black : this.color,
                        stroke: null,
                    }),
                    $(go.Panel, "Vertical",
                        {
                            defaultStretch: go.GraphObject.Horizontal,
                            defaultAlignment: go.Spot.TopLeft,
                            margin:  this.blockStyle.fixture ? 0 : new go.Margin(0,0,15, 0),
                            ...this.blockStyle.size,
                        },
                    // {
                    //     ...this.blockStyle.size,
                    // },
                    //     {
                    //         // alignment: this.blockStyle.alignment,
                    //         stretch: go.GraphObject.Fill,
                    //     },

                        // new go.Binding("margin", "isSelected", (isTrue) => isTrue ? 18 : 12).ofObject(),
                        // new go.AnimationTrigger('margin', { duration: 100 }),
                    // flex('column',
                    //     {
                    //         stretch: true,
                    //     },

                        
                        ( this.blockStyle?.fixture ? 
                            new NodeSection({ fixture: true }, this.titleElement()) :
                            this.titleElement()
                        ),
                        // $(go.Shape, { fill: this.$color.blue[300], height: 20 }),
                        // $(go.Shape, { fill: this.$color.blue[300], height: 20 }),
                        // $(go.Shape, { fill: this.$color.blue[300], height: 20 }),

                        
                        // flex('column', {
                        //         stretch: true
                        //     },
                            ( this.render ? this.render() : '' )
                        // )
                    )
                        // $(go.Panel, "Vertical", {
                        //         stretch: go.Spot.Fill
                        //     },
                      
                            // $(go.Shape, "ArcRectangle", { fill: this.$color.red[300] }),
                            
                            // new Icon({ name: 'flag', fill: this.$color.black, size: 12 })
                            // $(go.Panel, "Auto", 
                            //     (() => { if (this.render) return this.render() })()
                            // ),
                        // ),
                    // )
                )
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
      
        this.$click(e);
    }

    linkTemplate() {

        const color =  this.blockStyle.fixture ? this.$color.neutral[500] : this.color;
        // console.log('this.editor', this.editor)
        const link = new go.Link({ 
            routing: go.Link.AvoidsNodes,
            corner: 30,
            curve: go.Link.JumpGap,
            fromEndSegmentLength: 30,
            toEndSegmentLength: 30,
            toShortLength: 4,
            fromShortLength: 0,
            // curviness: CELL/4,
            selectionAdornmentTemplate: 'none'
            //    $(go.Adornment,
            //     $(go.Shape, { isPanelMain: true, strokeWidth: 6, stroke: hexOpacity(this.color, 0.5) })
            // ),
        })
        .add(
            $(go.Shape, 
                { isPanelMain: true, name: 'Link', strokeWidth: 3, stroke: colors.black },
                new go.Binding("strokeDashArray", "isHighlighted", (isTrue) => isTrue ? [10, 10] : [0,0]).ofObject(),
                new go.Binding("stroke", "isSelected", (isTrue) => isTrue ? color : colors.black).ofObject()
            )
        )
        .add(
            $(go.Shape,
                { toArrow: "OpenTriangle", strokeWidth: 3, strokeCap: 'round', stroke: colors.black, strokeJoin: 'round' },
                new go.Binding("stroke", "isSelected", (isTrue) => isTrue ? color : colors.black).ofObject()
            )
        )

        // .add(new go.Shape({ toArrow: "OpenTriangle", strokeWidth: 3, strokeCap: 'round', stroke: colors.black }))

        
        process.nextTick(() => this.startAnimations());

        return link
    }

    startAnimations() {
        // Animate the flow in the pipes
        const animation = new go.Animation();
        animation.easing = go.Animation.EaseLinear;
        this.editor.links.each(link => animation.add(link.findObject("Link"), "strokeDashOffset", 20, 0));
        // Run indefinitely
        animation.runCount = Infinity;
        animation.start();
    }

    $blur(e) {
        e.diagram.commit((d) => { d.clearHighlighteds(); }, "no highlighteds")
    }

    $click(e) {
        return;
    }
    
}

Block.prototype.$color = colors;
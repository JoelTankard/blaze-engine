import { Margin } from 'gojs'
import Component from '../core/Component'
// import uniqid from 'uniqid';
import flex from '../core/utils/flex'

const $ = go.GraphObject.make

export default class NodeSection extends Component {
  constructor (...children) {
    super(...children)

    return this.render(...children)
  }

  render (...children) {
    const options = !children[0].__gohashid ? children.shift() : {}

    // return $(go.Panel, "Table",
    //     {
    //         // alignment: go.Spot.TopLeft,
    //         stretch: go.GraphObject.Fill,
    //     },
    return $(go.Panel, 'Auto',
      $(go.Shape, { fill: null, stroke: null }),
      $(go.Panel, 'Auto',
        {
          alignment: go.Spot.Left,
          stretch: go.GraphObject.stretch,
          margin: options?.fixture ? new go.Margin(0, 20, 0, 0) : new go.Margin(0, 20)
        },
        children
      ),
      $(go.Panel, 'Spot',
        {
          name: 'Node',
          alignment: new go.Spot(1, 0.5),
          margin: new go.Margin(15, 5, 15, 20)
        },
        $(go.Shape, 'Circle',
          {
            height: 10,
            width: 10,
            strokeWidth: 2,
            stroke: options?.fixture ? this.$color.slate[200] : this.$color.black,
            fill: null,
            fromLinkable: true,
            fromSpot: go.Spot.Right,
            portId: options?.portId || 'default'
          }
        )
      )

    )
    // $(go.Panel, "Vertical",
    //     {
    //         alignment: go.Spot.TopLeft,
    //         stretch: go.GraphObject.Fill
    //     },
    //
    // ),

    // )
  }
}

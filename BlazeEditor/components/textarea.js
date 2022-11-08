import Component from '../core/Component'
import { hexOpacity } from '../core/utils/colors'

const $ = go.GraphObject.make

export default class Textarea extends Component {
  constructor (props) {
    super(props)

    return this.render()
  }

  render () {
    const text = this.props.value || this.props.placeholder || 'Placeholder'
    return $(go.TextBlock, text, {
      editable: true,
      stroke: this.props.value ? this.$color.black : hexOpacity(this.$color.black, 0.5),
      font: '600 14pt Inter Tight'
    })
  }
}

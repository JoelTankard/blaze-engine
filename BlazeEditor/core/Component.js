import BlazeConfig from '../blaze.config.js'
const $ = go.GraphObject.make

export default class Component {
  constructor (props) {
    this.props = props
  }
}

Component.prototype.$color = BlazeConfig.colors

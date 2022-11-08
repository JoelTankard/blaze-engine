import Component from '../core/Component'

const $ = go.GraphObject.make

const icons = {
  asterisk: 'M21 13H14.4L19.1 17.7L17.7 19.1L13 14.4V21H11V14.3L6.3 19L4.9 17.6L9.4 13H3V11H9.6L4.9 6.3L6.3 4.9L11 9.6V3H13V9.4L17.6 4.8L19 6.3L14.3 11H21V13Z',
  flag: 'M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z',
  message: 'M22,4C22,2.89 21.1,2 20,2H4A2,2 0 0,0 2,4V16A2,2 0 0,0 4,18H18L22,22V4Z',
  'message-text': 'M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18',
  reply: 'M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z',
  button: 'M10 10.75C10 11.15 9.65 11.5 9.25 11.5H6.5C6.3 11.5 6.15 11.45 6 11.3L4 9.2L4.35 8.8C4.45 8.7 4.6 8.65 4.75 8.65H4.85L6 9.5V5C6 4.7 6.2 4.5 6.5 4.5C6.8 4.5 7 4.7 7 5V7.25L7.6 7.3L9.55 8.4C9.8 8.5 10 8.8 10 9.05V10.75ZM10 1.5H2C1.45 1.5 1 1.95 1 2.5V6.5C1 7.05 1.45 7.5 2 7.5H4V6.5H2V2.5H10V6.5H9V7.5H10C10.55 7.5 11 7.05 11 6.5V2.5C11 1.95 10.55 1.5 10 1.5Z'

}

export default class Icon extends Component {
  constructor (props) {
    super(props)

    if (!this.props.name) { return console.error('Icon requires "name"') }
    if (!icons[this.props.name]) { return console.error(`Icon "${this.props.name}" is not found`) }

    return this.render()
  }

  render () {
    return $(go.Shape,
      {
        fill: this.props.fill || this.$color.black,
        stroke: null,
        spot1: go.Spot.TopLeft,
        margin: this.props.margin || 0,
        geometryString: `F ${icons[this.props.name]}`,
        geometryStretch: go.GraphObject.Uniform,
        height: this.props.size || 'auto',
        width: this.props.size || 'auto'
      }
    )
  }
}

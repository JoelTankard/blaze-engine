
import Block from '../core/Block'
import Icon from '../components/icon'

export default class Start extends Block {
  constructor (editor) {
    super(editor)

    this.color = this.$color.green[400]
    this.style = 'fixture-pill'
    this.icon = 'flag'
    this.title = 'Start flow'
  }

  $blur () {
    console.log('blur')
  }
}

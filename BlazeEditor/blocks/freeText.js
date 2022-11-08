
import Block from '../core/Block'
import NodeSection from '../components/nodeSection'
import Textarea from '../components/textarea'
export default class FreeText extends Block {
  constructor (editor) {
    super(editor)

    this.color = this.$color.purple[400]
    this.title = 'Free text'
    this.icon = 'message-text'
  }

  render () {
    return new NodeSection(
      new Textarea({ placeholder: 'Type question', value: 'Free text question would go here' })
    )
  }
}

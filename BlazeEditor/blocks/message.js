
import Block from "../core/Block";
import Textarea from "../components/textarea";
export default class Message extends Block {
    constructor(editor) {
        super(editor);

        this.color = this.$color.sky[400];
        this.icon = 'message'
        this.title = 'Message'
    }

    $blur() {
        console.log('blur message')
    }

    render() {
        return new Textarea({ placeholder: 'Type message', value: 'Hi! How are you?' });
    }
}


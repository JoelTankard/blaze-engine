
import Block from "../core/Block";
import NodeSection from "../components/nodeSection";
import Textarea from "../components/textarea";
export default class Message extends Block {
    constructor(editor) {
        super(editor);

        this.color = this.$color.cyan[400];
        this.icon = 'message'
        this.title = 'Message'
    }

    $blur() {
        console.log('blur message')
    }

    render() {
        return new NodeSection(
            new Textarea({ placeholder: 'Type message', value: 'This is a message block. How are you?' })
        );
    }
}


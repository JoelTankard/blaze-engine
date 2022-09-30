
import Block from "../core/Block";
export default class Message extends Block {
    constructor(editor) {
        super(editor);
        
        this.color = this.$color.blue[500];
    }
}


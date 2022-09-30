
import Block from "../core/Block";

export default class Start extends Block {
    constructor(editor) {
        super(editor);
        
        this.color = this.$color.green[500];
        this.style = 'pill';
    }
}

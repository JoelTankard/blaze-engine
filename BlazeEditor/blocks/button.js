
import Block from "../core/Block";
import NodeSection from "../components/nodeSection";
import Textarea from "../components/textarea";
import flex from "../core/utils/flex";

const $ = go.GraphObject.make;

export default class Button extends Block {
    constructor(editor) {
        super(editor);
        
        this.color = this.$color.emerald[400];
        this.title = 'Button';
        this.icon = 'button';
    }

    render() {
        return new NodeSection(
            new Textarea({ placeholder: 'Type question', value: ''})
        );
    }
}

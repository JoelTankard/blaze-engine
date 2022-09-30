import Extension from '../core/Extension';

export default class Pan extends Extension {

    static $bindKeys = [ { key: ' ' } ] // Bind Space bar

    constructor(editor) {
        super(editor);

        this.canPan = false;
        this.isMouseDown = false;

        this.editor.toolManager.panningTool.canStart = () => this.canPan;
    }

    $keyDown({ key }) {
        if (key === ' ' && !this.canPan) {
            this.canPan = true;
            this.setCursor();
        }     
    }

    $keyUp({ key }) {
        if (key === ' ') {
            if (this.canPan) this.editor.currentTool.stopTool();
            this.canPan = false;
            this.setCursor();
        }
    }

    $mouseDown() {
        this.isMouseDown = true;
        this.setCursor();
    }

    $mouseUp() {
        this.isMouseDown = false;
        this.setCursor();
    }

    $mouseMove() {
       this.setCursor();
    }

    setCursor() {
        // // console.log(this.canPan, this.isMouseDown)
        // if (this.canPan) this.editor.currentCursor = this.isMouseDown ? 'grabbing' : 'grab';
        // else this.editor.currentCursor = 'auto';
    }
}

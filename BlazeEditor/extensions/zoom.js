import Extension from '../core/Extension';
import { ease } from '../core/utils/animation';

const ZOOM_FACTOR = 0.25;
export default class Zoom extends Extension {

    static $bindKeys = [
        { ctrl: true, key: 'Add' }, 
        { ctrl: true, key: 'Subtract'}, 
        { key: 'Add' }, 
        { key: 'Subtract' }
    ]

    constructor(editor) {
        super(editor);
    }

    $keyDown({ key, ctrl }) {
        if (key === 'Add' && ctrl) return this.zoom(true); // zoom in
        if (key === 'Subtract' && ctrl) return this.zoom(false); // zoom out
    }

    zoom(zoomIn) {
        const duration = 100; ///this.editor.animationManager.duration;
        const start = +new Date();
        const finish = start + duration;
        const zoom = zoomIn ? ZOOM_FACTOR : -ZOOM_FACTOR;
        const newScale = (Math.round((this.editor.scale) * 4) / 4) + zoom;
        const oldScale = this.editor.scale;
  
        const zoomTick = () => {
            const time = +new Date();
            const currentTime = time > finish ? duration : (time - start);
            this.editor.scale = ease(currentTime, oldScale, newScale - oldScale, duration);
            if (time > finish) return;
            window.requestAnimationFrame(zoomTick);
          }

        window.requestAnimationFrame(zoomTick);
    }
   
}

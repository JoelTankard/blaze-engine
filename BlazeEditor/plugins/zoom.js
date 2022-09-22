import { ease } from '../core/utils/Animation';

export default class Zoom {

    static $bindKeys = [
        { ctrl: true, key: 'Add' }, 
        { ctrl: true, key: 'Subtract'}, 
        { key: 'Add' }, 
        { key: 'Subtract' }
    ]

    constructor(editor) {
       this.editor = editor; 
    }

    $keyDown({ key, ctrl }) {
        if (key === 'Add' && ctrl) return this.zoom(1.5); // zoom in
        if (key === 'Subtract' && ctrl) return this.zoom(0.5); // zoom out
    }

    zoom(factor) {
        var duration = 100; ///this.editor.animationManager.duration;
        var start = +new Date();
        var finish = start + duration;
        var newScale = this.editor.scale * factor;
        var oldScale = this.editor.scale;
  
        const zoomTick = () => {
            var time = +new Date();
            var currentTime = time > finish ? duration : (time - start);
            this.editor.scale = ease(currentTime, oldScale, newScale - oldScale, duration);
            if (time > finish) return;
            window.requestAnimationFrame(zoomTick);
          }

        window.requestAnimationFrame(zoomTick);
    }

   
}
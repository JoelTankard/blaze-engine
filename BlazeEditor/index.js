import BlazeConfig from './blaze.config.js';
import Editor from "./core/Editor";
import PluginManager from "./core/PluginManager";

const manager = new PluginManager(__dirname);

const keyEvents = {
  keyDown: { blaze: '$keyDown', gojs: 'doKeyDown' },
  keyUp: { blaze: '$keyUp', gojs: 'doKeyUp' },
}

const mouseEvents = {
  mouseDown: { blaze: '$mouseDown', gojs: 'doMouseDown' },
  mouseUp: { blaze: '$mouseUp', gojs: 'doMouseUp' },
  mouseMove: { blaze: '$mouseMove', gojs: 'doMouseMove' }
}

// mouseMove: { blaze: '$onMouseMove', gojs: 'doMouseMove' }

export default class BlazeEditor {
    constructor(elementId) {
      this.blaze = new Editor(elementId, BlazeConfig);
        // const $ = this.blaze.editor.makeObject;
        this.plugins = {};
        this.bindKeys = {};
        this.bindMouseEvents = {};
        
      this.attachPlugins(() => {


        Object.keys(keyEvents).forEach((eventName) => {
          const event = keyEvents[eventName];
          this.blaze.editor.commandHandler[event.gojs] = () => this.onKeyEvent(event)
        });

        Object.keys(mouseEvents).forEach((eventName) => {
          const event = mouseEvents[eventName];
          this.blaze.editor.toolManager[event.gojs] = () => this.onMouseEvent(event)
        });

        console.log('bindMouseEvents: ', this.bindMouseEvents)

        // this.blaze.editor.commandHandler.doKeyUp = () => {
        //   this.onKeyEvent(eventTypes.keyUp);
        // };
      });
      
    }

    keyId({ ctrl, shift, key }) {
      return [ctrl,shift,key].reduce((array, key, index) => {
        if (key) {
          if (index === 0) array.push('ctrl');
          if (index === 1) array.push('shift');
          if (index === 2) array.push(key);
        }
        return array;
      }, []).join('+');
    }

    attachPlugins(cb) {
        const editor = this.blaze.editor;
        Promise.all(BlazeConfig.plugins.map(({ src, name }) => {
            return manager.registerPlugin({ name, src: `plugins/${src}` })
        })).then(() => {
          // Loop through plugins
            this.pluginEventBinds = manager.listPluginList().forEach(({ id, name, instance }) => {
                this.plugins[id] = new instance.default(editor);

                // Bind keys to plugin
                if (instance.default.$bindKeys) {
                  instance.default.$bindKeys.forEach((keyBind) => {
                    const keyId = this.keyId(keyBind);
                    if (this.bindKeys[keyId]) console.warn(`Cannot bind '${keyId}' to ${name}, is already binded to ${this.bindKeys[keyId].name}`);
                    else {
                      const events = Object.keys(keyEvents).reduce((eventList, event) => {
                        const eventName = keyEvents[event].blaze;
                        if (instance.default.prototype[eventName]) eventList.push(eventName);
                        return eventList;
                      }, [])
                      this.bindKeys[keyId] = { name, id, events };
                    }
                  });
                }

                Object.keys(mouseEvents).forEach((eventName) => {
                  const event = mouseEvents[eventName];
                  if (!this.bindMouseEvents[event.blaze]) this.bindMouseEvents[event.blaze] = [];
                  if (this.plugins[id][event.blaze]) this.bindMouseEvents[event.blaze].push({ name, id });
                });

            });
            cb();
        });
    }


    onKeyEvent(event) {
      const { key, control, meta, shift } = this.blaze.editor.lastInput;
      // console.log(key)
      // this.blaze.editor.lastInput.bubbles = true

      const bindedKeys = this.bindKeys[this.keyId({ ctrl: control || meta, shift, key })];

      if (bindedKeys?.events.includes(event.blaze)) {
        this.plugins[bindedKeys.id][event.blaze]({ ctrl: control || meta, shift, key });
      } else {
        this.blaze.go.CommandHandler.prototype[event.gojs].call(this.blaze.editor.commandHandler);
      }
    }

    onMouseEvent(event) {
      const bindedEvent = this.bindMouseEvents[event.blaze];
      this.blaze.editor.lastInput.bubbles = true
      this.blaze.go.ToolManager.prototype[event.gojs].call(this.blaze.editor.toolManager);
      if (bindedEvent) {
        bindedEvent.forEach(({ id }) => {
          this.plugins[id][event.blaze]();
        })
        
      }
    }

    load(file) {
        this.blaze.editor.nodeTemplate =
        new go.Node("Auto")  // the Shape will automatically surround the TextBlock
          // add a Shape and a TextBlock to this "Auto" Panel
          .add(new go.Shape("RoundedRectangle",
              { strokeWidth: 0, fill: "white" })  // no border; default fill is white
              .bind("fill", "color"))  // Shape.fill is bound to Node.data.color
          .add(new go.TextBlock({ margin: 8, stroke: "#333" })  // some room around the text
              .bind("text", "key")); 

              this.blaze.editor.model = new go.GraphLinksModel(
                [
                  { key: "Alpha", color: "lightblue" },
                  { key: "Beta", color: "orange" },
                  { key: "Gamma", color: "lightgreen" },
                  { key: "Delta", color: "pink" }
                ],
                [
                  { from: "Alpha", to: "Beta" },
                  { from: "Alpha", to: "Gamma" },
                  { from: "Beta", to: "Beta" },
                  { from: "Gamma", to: "Delta" },
                  { from: "Delta", to: "Alpha" }
                ]);
    }
}

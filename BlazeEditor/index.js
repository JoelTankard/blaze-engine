import BlazeConfig from './blaze.config.js'
import Editor from './core/Editor'
import PluginManager from './core/PluginManager'

import Block from './core/Block'

const extensionManager = new PluginManager(__dirname)
const blockManager = new PluginManager(__dirname)

const keyEvents = {
  keyDown: { blaze: '$keyDown', gojs: 'doKeyDown' },
  keyUp: { blaze: '$keyUp', gojs: 'doKeyUp' }
}

const mouseEvents = {
  mouseDown: { blaze: '$mouseDown', gojs: 'doMouseDown' },
  mouseUp: { blaze: '$mouseUp', gojs: 'doMouseUp' },
  mouseMove: { blaze: '$mouseMove', gojs: 'doMouseMove' }
}

const blockMouseEvents = {
  click: { blaze: '$blur', gojs: 'click' }
}
// mouseMove: { blaze: '$onMouseMove', gojs: 'doMouseMove' }

export default class BlazeEditor {
  constructor (elementId) {
    this.blaze = new Editor(elementId, BlazeConfig)
    // const $ = this.blaze.editor.makeObject;
    this.extensions = {}
    this.bindKeys = {}
    this.bindMouseEvents = {}
    this.bindBlockMouseEvents = {}

    this.isReady = false
    this.file = null

    this.blocks = {}
    this.defaultBlock = null

    Promise.all([
      this.attachPlugins(),
      this.attachBlocks()
    ]).then(() => {
      this.isReady = true
      this.load(this.file)
      document.querySelector(`#${elementId} canvas`).focus()
    })
  }

  keyId ({ ctrl, shift, key }) {
    return [ctrl, shift, key].reduce((array, key, index) => {
      if (key) {
        if (index === 0) { array.push('ctrl') }
        if (index === 1) { array.push('shift') }
        if (index === 2) { array.push(key) }
      }
      return array
    }, []).join('+')
  }

  attachPlugins () {
    const { editor } = this.blaze
    return new Promise((reslove, reject) => {
      Promise.all(BlazeConfig.extensions.map(({ src, name }) => {
        return extensionManager.registerPlugin({ name, src: `extensions/${src}` })
      })).then(() => {
        // Loop through extensions
        extensionManager.listPluginList().forEach(({ id, name, instance }) => {
          this.extensions[id] = new instance.default(editor)

          // Bind keys to plugin
          if (instance.default.$bindKeys) {
            instance.default.$bindKeys.forEach((keyBind) => {
              const keyId = this.keyId(keyBind)
              if (this.bindKeys[keyId]) { console.warn(`Cannot bind '${keyId}' to ${name}, is already binded to ${this.bindKeys[keyId].name}`) } else {
                const events = Object.keys(keyEvents).reduce((eventList, event) => {
                  const eventName = keyEvents[event].blaze
                  if (instance.default.prototype[eventName]) { eventList.push(eventName) }
                  return eventList
                }, [])
                this.bindKeys[keyId] = { name, id, events }
              }
            })
          }

          Object.keys(mouseEvents).forEach((eventName) => {
            const event = mouseEvents[eventName]
            if (!this.bindMouseEvents[event.blaze]) { this.bindMouseEvents[event.blaze] = [] }
            if (this.extensions[id][event.blaze]) { this.bindMouseEvents[event.blaze].push({ name, id }) }
          })
        })

        Object.keys(keyEvents).forEach((eventName) => {
          const event = keyEvents[eventName]
          this.blaze.editor.commandHandler[event.gojs] = () => this.onKeyEvent(event)
        })

        Object.keys(mouseEvents).forEach((eventName) => {
          const event = mouseEvents[eventName]
          this.blaze.editor.toolManager[event.gojs] = () => this.onMouseEvent(event)
        })

        reslove()
      }).catch((err) => {
        reject(err)
      })
    })
  }

  attachBlocks () {
    const { editor } = this.blaze
    return new Promise((reslove, reject) => {
      Promise.all(BlazeConfig.blocks.map(({ src, name }) => {
        return blockManager.registerPlugin({ name, src: `blocks/${src}` })
      })).then(() => {
        const nodeMap = new go.Map()
        const linkMap = new go.Map()

        // Loop through block
        blockManager.listPluginList().forEach(({ id, name, instance }) => {
          this.blocks[id] = new instance.default(editor)

          nodeMap.add(name, this.blocks[id].nodeTemplate())
          linkMap.add(name, this.blocks[id].linkTemplate())

          Object.keys(blockMouseEvents).forEach((eventName) => {
            const event = blockMouseEvents[eventName]
            if (!this.bindBlockMouseEvents[event.blaze]) { this.bindBlockMouseEvents[event.blaze] = [] }
            if (this.blocks[id][event.blaze]) { this.bindBlockMouseEvents[event.blaze].push({ name, id }) }
          })
        })

        this.defaultBlock = new Block(editor)

        nodeMap.add('', this.defaultBlock.nodeTemplate())
        linkMap.add('', this.defaultBlock.linkTemplate())

        editor.nodeTemplateMap = nodeMap
        // editor.linkTemplate = defaultBlock.linkTemplate();
        editor.linkTemplateMap = linkMap

        Object.keys(blockMouseEvents).forEach((eventName) => {
          const event = blockMouseEvents[eventName]
          this.blaze.editor[event.gojs] = e => this.onBlockMouseEvent(event, e)
        })

        reslove()
      }).catch((err) => {
        reject(err)
      })
    })
  }

  onKeyEvent (event) {
    const { key, control, meta, shift } = this.blaze.editor.lastInput
    // this.blaze.editor.lastInput.bubbles = true

    const bindedKeys = this.bindKeys[this.keyId({ ctrl: control || meta, shift, key })]

    if (bindedKeys?.events.includes(event.blaze)) {
      this.extensions[bindedKeys.id][event.blaze]({ ctrl: control || meta, shift, key })
    } else {
      this.blaze.go.CommandHandler.prototype[event.gojs].call(this.blaze.editor.commandHandler)
    }
  }

  onMouseEvent (event) {
    const bindedEvent = this.bindMouseEvents[event.blaze]
    this.blaze.editor.lastInput.bubbles = true
    this.blaze.go.ToolManager.prototype[event.gojs].call(this.blaze.editor.toolManager)
    if (bindedEvent) {
      bindedEvent.forEach(({ id }) => {
        this.extensions[id][event.blaze]()
      })
    }
  }

  // TODO: revisit Blur
  onBlockMouseEvent (event, e) {
    const bindedEvent = this.bindBlockMouseEvents[event.blaze]
    this.blaze.editor.lastInput.bubbles = true
    if (bindedEvent) {
      bindedEvent.forEach(({ id }) => {
        this.blocks[id][event.blaze](e)
      })
      this.defaultBlock[event.blaze](e)
    }
  }

  $nextTick (func) { process.nextTick(func) }

  load (file) {
    this.file = file
    if (!this.isReady) { return }
    const { editor } = this.blaze
    editor.model = new go.GraphLinksModel({
      linkFromPortIdProperty: 'fromPort',
      nodeDataArray: [
        { key: 'Alpha', category: 'Start' },
        { key: 'Beta', category: 'Button' },
        { key: 'Gamma', category: 'FreeText' },
        { key: 'Delta', category: 'Message' }
      ],
      linkDataArray: [
        { from: 'Alpha', fromPort: 'default', to: 'Beta', category: 'Start' },
        { from: 'Alpha', fromPort: 'default', to: 'Gamma', category: 'Start' },
        { from: 'Beta', fromPort: 'default', to: 'Delta', category: 'Button' },
        { from: 'Gamma', fromPort: 'default', to: 'Delta', category: 'FreeText' },
        { from: 'Delta', fromPort: 'default', to: 'Beta', category: 'Message' }
      ]
    })
  }
}

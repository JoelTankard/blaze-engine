import path from 'path'
import uniqid from 'uniqid'

interface PluginInterface {
  id: string;
  name: string;
  src: string;
  isRelative?: boolean;
  instance?: any;
  options?: any;
}

export default class PluginManager {
  private pluginList: Map<string, PluginInterface>

  constructor (path: string) {
    this.pluginList = new Map()
  }

  private pluginExists (name: string): boolean {
    return this.pluginList.has(name)
  }

  private addPlugin (plugin: PluginInterface, packageContents: any): void {
    const id = uniqid()
    this.pluginList.set(id, { ...plugin, id, name: plugin.name, instance: packageContents })
  }

  registerPlugin (plugin: PluginInterface): Promise<void> {
    if (!plugin.name) {
      throw new Error('The plugin name')
    }

    if (this.pluginExists(plugin.name)) {
      throw new Error(`Cannot add existing plugin ${plugin.name}`)
    }

    // Try to load the plugin
    return import(`../${plugin.src}`).then((packageContents) => {
      this.addPlugin(plugin, packageContents)
    }).catch((error) => {
      console.error(`Cannot load plugin ${plugin.name}`, error)
    })
  }

  loadPlugin<T> (name: string): T {
    const plugin = this.pluginList.get(name)
    if (!plugin) {
      throw new Error(`Cannot find plugin ${name}`)
    }
    plugin.instance.default.prototype.options = plugin.options
    return Object.create(plugin?.instance.default.prototype) as T
  }

  listPluginList (): Map<string, PluginInterface> {
    return this.pluginList
  }
}

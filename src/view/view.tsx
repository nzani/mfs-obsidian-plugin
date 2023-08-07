import { FileView, WorkspaceLeaf, Notice, TFile, FileSystemAdapter } from "obsidian"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { ReactView } from "./ReactView"
import { createRoot } from "react-dom/client"

export const VIEW_TYPE_MAP = "map-view"

export class MapView extends FileView {

  map: string = ""
  name: string = "Unnamed Map"

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
    this.navigation = true
    this.icon = "map"
  }

  async onLoadFile(file : TFile) {

    let vault = this.app.vault
    
    let fsa = new FileSystemAdapter()

    let data = JSON.parse(await vault.read(file))

    this.map = data["map"]
    this.name = data["name"]

    let map = vault.getAbstractFileByPath(this.map)!.path

    let files = vault.getFiles()

    // function hexToBase64(str) {
    //   return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    // }

    new Notice(this.map)
    new Notice(vault.configDir)

    new Notice(vault.getResourcePath(file))
    new Notice(vault.getRoot().path)
  }

  getViewType() {
    return VIEW_TYPE_MAP
  }

  getDisplayText() {
    return "Map View"
  }

  async onOpen() {
    const root = createRoot(this.containerEl.children[1])

    let imgData = 'data:image/jpeg;base64,' + (await this.app.vault.adapter.read(this.map))

    root.render(
      <React.StrictMode>
        <ReactView file={imgData}/>
      </React.StrictMode>
    )
      
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1])
  }
}
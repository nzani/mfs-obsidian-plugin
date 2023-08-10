import { arrayBufferToBase64, FileView, WorkspaceLeaf, Notice, TFile, FileSystemAdapter } from "obsidian"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { ReactView } from "./ReactView"
import { createRoot } from "react-dom/client"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

export const VIEW_TYPE_MAP = "map-view"
export const TEST_IMAGE_NAME = "omu1.jpg"

export class MapView extends FileView {

  // TODO: change to proper interface (MFSDoc)
  mapPath: string = ""
  name: string = "Unnamed Map"
  mapAbsPath: string = ""
  root: Root

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
    this.navigation = true
    this.icon = "map"
  }

  async onLoadFile(file : TFile) {

    let vault = this.app.vault
    let data = JSON.parse(await vault.read(file))

    // TODO: do these need to be saved? will they be used anywhere else?
    this.mapPath = data["path"]
    this.name = data["name"]

    // TODO: better way to find resource path of the map?
    let files = vault.getFiles()
    let testimagepath = ""
    for(var i = 0; i < files.length; i++) {
      if (files[i].path === this.mapPath) {
        this.mapAbsPath = vault.getResourcePath(files[i])
      }
      if (files[i].name == TEST_IMAGE_NAME) { // if test file is found in the vault, use it for the map
        testimagepath = vault.getResourcePath(files[i])
      }
    }

    // function hexToBase64(str) {
    //   return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    // }
 
    // "content" element => for this instance
    // "container" element => for the parent element of this instance

    // this.containerEl.toggleClass("map-view", true)
    this.contentEl.toggleClass("map-view", true)

    // create React element after file loaded
    this.root.render(
      <React.StrictMode>
        <TransformWrapper>
          <TransformComponent>
            <img 
              src={testimagepath}
              alt="test"
            />
          </TransformComponent>
        </TransformWrapper>
      </React.StrictMode>
    )

  }

  async loadImage(file: TFile) {
    const fragment = this
  }

  getViewType() {
    return VIEW_TYPE_MAP
  }

  getDisplayText() {
    return "Map View"
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1])      
  }

  async onClose() {
    // ReactDOM.unmountComponentAtNode(this.containerEl.children[1])
    this.root.unmount()
  }
}
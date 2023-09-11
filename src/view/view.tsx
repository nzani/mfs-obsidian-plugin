import { FileView, WorkspaceLeaf, TFile, ButtonComponent } from "obsidian"
import * as React from "react"
import * as ReactDOM from "react-dom"
import MapComponent from "./ReactView"
import { Root, createRoot } from "react-dom/client"
import { MapViewProps, MapPin } from "src/main/intf"

export const VIEW_TYPE_MAP = "map-view"

export class MapView extends FileView {

  // TODO: change to proper interface (MFSDoc)
  mapFileData: MapViewProps = {path: "", name: "", pins: []}
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
    this.mapFileData = data

    let mapAbsPath = ""

    // TODO: better way to find resource path of the map?
    let files = vault.getFiles()
    for(var i = 0; i < files.length; i++) {
      if (files[i].path === this.mapFileData.path) {
        mapAbsPath = vault.getResourcePath(files[i])
        break
      }
    }

    // "content" element => for this instance
    // "container" element => for the parent element of this instance

    // this.containerEl.toggleClass("map-view", true)
    this.contentEl.toggleClass("map-view", true)


    // create React element after file loaded
    this.root.render(
      <React.StrictMode>
        <MapComponent name={this.mapFileData.name} path={this.mapFileData.path} pins={this.mapFileData.pins}/>
      </React.StrictMode>
    )

    // in theory, should display all the pins...
    for (var i = 0; i < this.mapFileData.pins.length; i++){
      this.displayPin(this.mapFileData.pins[i])
    }

  }

  // TODO: need to set style elements somewhere else
  // TODO: turn into React component or otherwise
  // TODO: create Modal to name pin
  // add the pin to the current map display
  displayPin(pin: MapPin) {
    // let buttonContainer = this.contentEl.createDiv()
    // let button = new ButtonComponent(buttonContainer)
    // let containerRect = this.containerEl.getBoundingClientRect()

    // // style for buttonContainer
    // buttonContainer.style.position = "absolute"
    // buttonContainer.style.left = coord.x - Number(containerRect.left) - Number(button.buttonEl.style.width)/2 + "px"
    // buttonContainer.style.top = coord.y - Number(containerRect.top) - Number(button.buttonEl.style.height)/2 + "px"
    // buttonContainer.style.background = "transparent"

    // // style for button
    // // button.buttonEl.style.background = "transparent"
    // button.buttonEl.style.color = "#ffffff"
    // button.buttonEl.style.accentColor = "#ffffff"
    // console.log("Created a pin")
    // console.log(coord.x, coord.y)
    // button.setIcon('pin')
    // button.setClass("pin")
  }

  getViewType() {
    return VIEW_TYPE_MAP
  }

  getDisplayText() {
    return "Map View"
  }

  // add the pin to the list of pins in the .mfs doc
  async savePin(pin: MapPin) {
    // get the current vault and data
    let vault = this.app.vault
    let data = JSON.parse(await vault.read(this.file))

    // if no pins, create new array; otherwise add to current array of MapPins
    if (data["pins"] == null) {
      data["pins"] = [pin]
    } else {
      data["pins"].push(pin)
    }

    // re-write file
    vault.adapter.write(this.file.path, JSON.stringify(data))
  }

  async loadImage(file: TFile) {
    const fragment = this
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1])      
  }

  async onClose() {
    // ReactDOM.unmountComponentAtNode(this.containerEl.children[1])
    this.root.unmount()
  }
}


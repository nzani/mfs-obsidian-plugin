import { FileView, WorkspaceLeaf, TFile, ButtonComponent } from "obsidian"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Root, createRoot } from "react-dom/client"
import { MapViewProps, MapPinProps } from "src/main/intf"
import MapComponent from "src/view/ReactView"
import { TransformWrapper, TransformComponent, KeepScale } from "react-zoom-pan-pinch"

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

    // create React element after file loaded
    this.root.render(
      <React.StrictMode>
        <MapComponent name={this.mapFileData.name} path={mapAbsPath} pins={this.mapFileData.pins}/>
      </React.StrictMode>
    )
  }

  getViewType() {
    return VIEW_TYPE_MAP
  }

  getDisplayText() {
    return "Map View"
  }

  // add the pin to the list of pins in the .mfs doc
  async savePin(pin: MapPinProps) {
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
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1])
    this.root.unmount()
  }
}

const MapInteractiveView = (props: any) => {
  return (
    <TransformWrapper centerOnInit>
      <TransformComponent wrapperStyle={{width: '100%', height: '100%'}}>
        <img src={props.path} alt={props.name}/>
      </TransformComponent>
    </TransformWrapper>
  )
}

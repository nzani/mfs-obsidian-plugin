import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import * as React from "react";
import { useState } from "react";
import './style.css'
import { MFSDoc, MapPin } from "src/main/intf";

// make into a class?
// export const ReactView = (props: any) => {
//   const [pins, setPins] = useState(new Array<MapPin>)

//   async function addPin(pin: MapPin) {
//     setPins([...pins, pin])
//   }

//   function renderPins(){
//     // if no pins return empty
//     if (!pins) return null

//     // else build pin list
//     let result: React.ReactElement[] = []
//     pins.forEach(pin => {
//       result.push(
//         <MapPinElement pin={pin}/>
//       )
//     })
//     return result
//   }
  
  
//   return (
//   <TransformWrapper>
//     <TransformComponent>
//       <div id="map-image-container">
//         <img 
//           id="map-image"
//           src={props.mapAbsPath}
//           alt={props.mfsDoc.name}
//         />
//         {renderPins()}
//       </div>
//     </TransformComponent>
//   </TransformWrapper>
//   )
// }

function MapPinElement(props: any, pin: MapPin) {
  return <div className="pin" style={{
    top: pin.coord.y,
    left: pin.coord.x
  }}></div>
}

export class MFSComponent extends React.Component {
  // make all the functionality of the component 
  // add pins to pinlist
  // display pins
  // call button press functions
  // etc. 
  doc: MFSDoc
  mapAbsPath: string

  constructor(props:any, 
              mapAbsPath: string,
              doc: MFSDoc) 
  {
    super(props)
    this.doc = doc
    this.mapAbsPath = mapAbsPath
    this.renderPins = this.renderPins.bind(this)
  }

  addPin(pin: MapPin) {
    this.doc.mapPins = [...this.doc.mapPins, pin]
  }

  renderPins() {
    // if no pins return empty
    if (!this.doc.mapPins) return null

    // else build pin list
    let result: React.ReactElement[] = []
    this.doc.mapPins.forEach(pin => {
      result.push(
        <MapPinElement pin={pin}/>
      )
    })
    return result
  }

  render() {
    return(
      <TransformWrapper>
        <TransformComponent>
          <div id="map-image-container">
            <img 
              id="map-image"
              src={this.mapAbsPath}
              alt={this.doc.name}
            />
            {this.renderPins()}
          </div>
        </TransformComponent>
      </TransformWrapper>
    )
  }
}
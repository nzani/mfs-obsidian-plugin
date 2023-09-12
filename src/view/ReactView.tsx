import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import * as React from "react";
import { useState } from "react";
import './style.css'
import { MFSDoc, MapPin } from "src/main/intf";

// cannot make into a class 
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
  return <div key={pin.name} className="pin" style={{
    top: pin.coord.y,
    left: pin.coord.x
  }}></div>
}

type MFSCompProps = {
  doc: MFSDoc
}

type MFSCompState = {
  numPins: number
}

export class MFSComponent extends React.Component<MFSCompProps, MFSCompState> {
  // make all the functionality of the component 
  // add pins to pinlist
  // display pins
  // call button press functions
  // etc. 

  doc:MFSDoc

  constructor (props:MFSCompProps){
    super(props)
    this.doc = props.doc
  }

  // use an effect to let the state be set by external action


  // add a pin to the map
  addPin(pin: MapPin) {
    this.doc.mapPins = [...this.doc.mapPins, pin]
    this.setState((state) => ({
      numPins: state.numPins + 1,
    }))
  }

  renderPins() {
    // if no pins return empty
    if (!this.doc.mapPins) return null

    console.log("Rendering pins!")

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
    return <TransformWrapper>
        <TransformComponent>
          <div id="map-image-container">
            <img 
              id="map-image"
              src={this.doc.absPath}
              alt={this.doc.name}
            />
            {/* {this.renderPins()} */}
          </div>
        </TransformComponent>
      </TransformWrapper>
  }
}
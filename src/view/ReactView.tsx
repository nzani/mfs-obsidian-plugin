import { TransformWrapper, TransformComponent, KeepScale } from "react-zoom-pan-pinch"
import * as React from "react";
import { useState } from "react";
import './style.css'
import { MapViewProps, MapPin } from "src/main/intf";

// displays map using zoom-pan-pinch interactive view
// adds react hooks to modify state
const MapComponent = (mapProps: MapViewProps) => {
  const [pins, setPins] = useState(mapProps.pins);
  const [name, setName] = useState(mapProps.name);
  const [path, setPath] = useState(mapProps.path); 

  const addPin = async (pin: MapPin) => {setPins([...pins, pin])}
  const removePin = async (pin: MapPin) => {setPins(pins.filter(p => p.id !== pin.id))}

  return (
    <TransformWrapper>
      <TransformComponent>
        <div id="map-image-container">
          <img 
            id="map-image"
            src={path}
            alt={name}
          />
          <KeepScale>
            {PinListView(pins)}
          </KeepScale>
        </div>
      </TransformComponent>
    </TransformWrapper>
  )
}

// converts array of MapPin objects into a React Fragment containing a div for each pin
const PinListView = (pins: MapPin[]) => {
  return (
    <>
      {pins.map((pin: MapPin, idx: number) => {
          return (<div className="pin" key={idx} style={{top: pin.coord.y, left: pin.coord.x}}/>)
        })}
    </>
  )
}

export default MapComponent;
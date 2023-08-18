import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import * as React from "react";
import './style.css'

export const ReactView = (props: any) => {
  return (
  <TransformWrapper>
    <TransformComponent>
      <img 
        id="map-image"
        src={props.mapAbsPath}
        alt={props.mfsDoc.name}
      />
    </TransformComponent>
  </TransformWrapper>
  )
}

function MapPin(props:any) {
  return <div className="pin"></div>
}

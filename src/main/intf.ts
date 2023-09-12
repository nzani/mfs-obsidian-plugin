
// interfaces for map stuff

export interface MapCoordinate {
	x: number,
	y: number
}

export interface MapPinProps {
	id?: number
	name: string,
	path: string,
	coord: MapCoordinate,
	content?: MapViewProps
}

export interface MapViewProps {
	name: string,
	path: string,
	pins: MapPinProps[]
}
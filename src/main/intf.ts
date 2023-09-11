
// interfaces for map stuff

export interface MapCoordinate {
	x: number,
	y: number
}

export interface MapPin {
	id: number
	name: string,
	path: string,
	coord: MapCoordinate,
	content: MapViewProps | null
}

export interface MapViewProps {
	name: string,
	path: string,
	pins: MapPin[]
}
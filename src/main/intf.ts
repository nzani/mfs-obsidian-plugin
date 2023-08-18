
// interfaces for map stuff

export interface MapCoordinate {
	x: number,
	y: number
}

export interface MapPin {
	name: string,
	path: string,
	coord: MapCoordinate
}

export interface MFSDoc {
	name: string,
	path: string,
	mapPins: Array<MapPin>,
}
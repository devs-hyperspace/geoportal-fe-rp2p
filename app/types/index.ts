export interface Location {
    longitude: number;
    latitude: number;
}

export type SourceGeoJSON = {
    name: string;
    type: 'geojson';
    data: {
        type: 'FeatureCollection';
        features: any[];
    };
    minZoom?: number;
    maxZoom?: number;
};

export type SourceTile = {
    name: string;
    type: 'vector';
    tiles: string[];
    minZoom?: number;
    maxZoom?: number;
};
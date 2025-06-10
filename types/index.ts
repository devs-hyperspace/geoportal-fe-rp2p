import { LngLatBoundsLike } from "maplibre-gl";

export interface Location {
    longitude: number;
    latitude: number;
}

export type SourceGeoJSON = {
    uuid: string;
    id: 'geojson';
    name: string;
    type: 'geojson';
    data: {
        type: 'FeatureCollection';
        features: any[];
    } | string;
    minZoom?: number;
    maxZoom?: number;
};

export type SourceTile = {
    uuid: string;
    id: 'tile';
    name: string;
    type: 'vector';
    tiles: string[];
    minZoom?: number;
    maxZoom?: number;
};

export type SourceTileUrl = {
    uuid: string;
    id: 'tileUrl';
    name: string;
    type: 'vector';
    url: string;
    minZoom?: number;
    maxZoom?: number;
};

export type SourceRaster = {
    uuid: string;
    id: 'raster';
    name: string;
    type: 'raster';
    tiles: string[];
    tileSize?: number;
    minZoom?: number;
    maxZoom?: number;
};

export type Source = SourceGeoJSON | SourceTile | SourceTileUrl | SourceRaster;

export type Layer = {
    id: string;
    type?: string;
    source?: string;
    live: boolean;
    'source-layer'?: string;
    paint?: any;
    layout?: any;
    filter?: any;
    maxzoom?: number;
};

export type LayerListItem = {
    id: string;
    name: string;
    active: boolean;
    isToggle: boolean;
    beforeId: string | undefined;
    opacity?: number;
    layer: Layer;
    legend?: string;
    bbox?: {
        coords: LngLatBoundsLike,
        srid: string;
    }
    layerName: string;
    viewparams?: string;
};

export type LayerGroup = {
    layersGroup: string;
    layersGroupId: number;
    layers: LayerListItem[];
};

export type LayersGroup = LayerGroup[];
export type LayerList = LayerListItem[];

export interface Meta {
    page: number;
    pageSize: number;
    total: number;
}

export interface ResourceParams {
    content: 'my-content' | 'featured' | 'group' | 'organization';
    category: 'all';
    type: 'all' | 'dataset' | 'map';
    subType: string;
    search: string;
    island: string;
    year: string;
}
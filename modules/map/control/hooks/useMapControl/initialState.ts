export const basemapSourceList = [
    {
        key: 'arcgis',
        label: 'ArcGIS',
        value: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        screenshot: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/16/26',
        maxZoom: 18

    },
    {
        key: 'google',
        label: 'Google Maps',
        value: ['https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'],
        screenshot: 'https://mt0.google.com/vt/lyrs=m&x=25&y=16&z=5',
        maxZoom: 20
    },
    {
        key: 'maptiler-satellite',
        label: 'Maptiler Satellite',
        value: ['https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=YD3gVXxE6CGgnSXdd1cO'],
        screenshot: 'https://api.maptiler.com/tiles/satellite-v2/1/1/1.jpg?key=YD3gVXxE6CGgnSXdd1cO',
        maxZoom: 20
    },
    {
        key: 'google-street-view',
        label: 'Satellite',
        value: ['https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'],
        screenshot: 'https://mt0.google.com/vt/lyrs=s&x=25&y=16&z=5',
        maxZoom: 20
    },
    {
        key: 'osm',
        label: 'OSM',
        value: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        screenshot: 'https://a.tile.openstreetmap.org/5/25/16.png',
        maxZoom: 20
    },
    {
        key: 'positron-dark',
        label: 'Positron Dark',
        value: ['https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'],
        screenshot: 'https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/3/7/3.png3/7/3.png',
        maxZoom: 20
    },
    {
        key: 'positron-white',
        label: 'Positron White',
        value: [
            'https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
        ],
        screenshot: 'https://a.basemaps.cartocdn.com/rastertiles/light_all/4/13/7.png',
        maxZoom: 20
    },
];

export const tools = {
    navigation: {
        active: false,
        disabled: false,
        show: true,
    },
    geolocate: {
        active: false,
        disabled: false,
        show: true,
    },
    fullscreen: {
        active: false,
        disabled: false,
        show: true,
    },
    basemap: {
        active: false,
        disabled: false,
        show: true,
    },
    geocoder: {
        active: false,
        disabled: false,
        show: true,
    },
    terrain: {
        active: false,
        disabled: false,
        show: true,
    },
    measure: {
        active: false,
        disabled: false,
        show: true,
    },
    areaMeasure: {
        active: false,
        disabled: false,
        show: true,
    },
    building: {
        active: false,
        disabled: false,
        show: true,
    },
    layerControl: {
        active: true,
        disabled: false,
        show: true,
    },
    widgetTools: {
        active: false,
        disabled: false,
        show: true,
    },
    attributesTable: {
        active: false,
        disabled: false,
        show: true,
    },
}
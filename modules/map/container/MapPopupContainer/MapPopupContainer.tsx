import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { useMapData } from '../../data/hooks/useMapData';
import { toTitleCase } from '@/lib/utils';

const fetchFeatureInfo = async (layer: string, point: { x: number, y: number, height:number, width:number }, bbox: string, viewparams?: string) => {
    const url = `/api/gn/layer/featureInfo?layer=${layer}&x=${point.x}&y=${point.y}&h=${point.height}&w=${point.width}&bbox=${bbox}&srs=EPSG:3857${viewparams ? `&viewparams=${viewparams}`: ''}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

const clampLatitude = (lat: number): number => {
    return Math.max(-85.05112878, Math.min(85.05112878, lat));
};

const EARTH_RADIUS = 6378137;

const latLonToWebMercator = ([lon, lat]: [number, number]): [number, number] => {
    const clampedLat = clampLatitude(lat);
    const x = EARTH_RADIUS * (lon * Math.PI / 180); // Convert longitude to meters
    const y = EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + (clampedLat * Math.PI / 360))); // Convert latitude to meters
    return [x, y];
};

export const MapPopupContainer: React.FC = () => {
    const { map } = useMap();
    const { layers, setFeatures } = useMapData();
    const [mapLayers, setMapLayers] = useState<string[]>([]);
    const [popup, setPopup] = useState<maplibregl.Popup | null>(null);

    // Effect for getting the map layers
    useEffect(() => {
        if (!map) return;

        const getLayers = () => {
            const data = map.getMap()?.getStyle()?.layers
                .filter(layer => layer.type === 'raster')
                .map(layer => layer.id) || [];
            setMapLayers(data.reverse());
        };

        getLayers();
        map.getMap().on('styledata', getLayers);

        return () => {
            map.getMap().off('styledata', getLayers);
        };
    }, [map]);

    // Effect for handling click event and fetching feature info
    useEffect(() => {
        if (!map || mapLayers.length === 0) return;
        
        const handleOnClick = async (e: maplibregl.MapMouseEvent) => {
            const filterLayer = layers.filter(v => mapLayers.includes(v.layer.id));

            // Map width and height in pixels
            const width = map.getContainer().clientWidth;
            const height = map.getContainer().clientHeight;

            // Mouse click location in pixels
            const x = Math.round(e.point.x);
            const y = Math.round(e.point.y);

            // Get map bounds in EPSG:4326 (longitude/latitude)
            const bounds = map.getBounds();
            
            const sw = bounds.getSouthWest().toArray() as [number, number];
            
            const ne = bounds.getNorthEast().toArray() as [number, number];
            
            let bbox = []

            bbox = [sw[0], sw[1], ne[0], ne[1]];

            if (ne[1] >= 0){

                const sw3857 = latLonToWebMercator(sw);
                const ne3857 = latLonToWebMercator(ne);
                bbox = [sw3857[0], sw3857[1], ne3857[0], ne3857[1]];
            }
            
            if (filterLayer.length > 0) {
                if (popup) {
                    popup.remove(); // Remove the previous popup
                }
        
                try {
                    // Fetch feature info for each layer
                    const featureInfoResults = await Promise.all(
                        filterLayer.map(v => fetchFeatureInfo(v.layerName as string, { x, y, height, width }, bbox.join(','), v.viewparams))
                    );
        
                    // Group features by layer name
                    const groupedFeatures = filterLayer.reduce((acc, layer, index) => {
                        const features = featureInfoResults[index]?.features || [];
                        if (features.length > 0) {
                            acc[layer?.layerName || ''] = {
                                title: toTitleCase(layer.name),
                                features
                            };
                        }
                        return acc;
                    }, {} as Record<string, {title:string;features:any[]}>);

                    // Collect all features into a flat array
                    const allFeatures = Object.values(groupedFeatures).flatMap((group) => group.features).map((feature) => ({
                        ...feature,
                        properties: {
                            ...feature.properties,
                            FE_visual_state: 'highlighted' // highlighted or normal
                        }
                    }));

                    // Store all features in the Zustand store
                    setFeatures(allFeatures);
        
                    // Check if we have features to show in the popup
                    const hasFeatures = Object.keys(groupedFeatures).length > 0;

                    if (hasFeatures) {
                        const newPopup = new maplibregl.Popup({
                            closeButton: false,
                            closeOnClick: true,
                            maxWidth: '400px'
                        })
                            .setLngLat(e.lngLat)
                            .setHTML(`
                                <div class="bg-white rounded-sm text-black max-h-[400px] overflow-y-auto custom-scrollbar">
                                    ${Object.values(groupedFeatures).map((item, index) => `
                                        <div class="px-4 py-2 mb-2 ${index !== Object.values(groupedFeatures).length - 1 ? "border-b" : ""}">
                                            <div class="bg-secondary text-center text-base mb-2 rounded-sm p-2">${item.title}</div>
                                            <ul class="space-y-2">
                                                ${item.features.map(feature => `
                                                    <li class="border-b border-gray-700 pb-2 last:border-none">
                                                        ${Object.entries(feature.properties).map(
                                                            ([key, value]) => `
                                                                <div class="text-sm grid grid-cols-2 gap-1 leading-5">
                                                                    <strong class="text-primary">${key}</strong>
                                                                    <span class="text-black">${value}</span>
                                                                </div>
                                                            `
                                                        ).join('')}
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                    `).join('')}
                                </div>
                            `)
                            .addTo(map.getMap());
        
                        setPopup(newPopup); // Store the new popup
                    }
                } catch (error) {
                    console.error("Error fetching feature info:", error);
                }
            }
        };
        

        map?.on('click', handleOnClick);
        return () => {
            map?.off('click', handleOnClick);
            if (popup) {
                popup.remove(); // Cleanup popup on component unmount
            }
        };
    }, [mapLayers, layers]);

    return null; // No JSX as we are managing the popup manually
};

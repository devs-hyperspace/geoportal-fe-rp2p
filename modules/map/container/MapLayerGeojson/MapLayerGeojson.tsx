import React, { useEffect } from 'react';
import { GeoJSONSourceRaw, useMap } from 'react-map-gl';
import { useMapData } from '../../data/hooks/useMapData';

export const MapLayerGeojson: React.FC = () => {
    const { current: map } = useMap();
    const geojsonData = useMapData((state) => state.geojsonData);

    useEffect(() => {
        if (!map || !geojsonData) return;

        // Adding the GeoJSON source
        const source: GeoJSONSourceRaw = {
            type: 'geojson',
            data: geojsonData,
        };

        const mapInstance = map.getMap();

        if (mapInstance && !mapInstance.getSource('geojson-source')) {
            mapInstance.addSource('geojson-source', source);
        } else if (mapInstance) {
            (mapInstance.getSource('geojson-source') as GeoJSONSourceRaw).setData(geojsonData);
        }

        // Adding the Polygon layer with FE_visual_state filter
        if (mapInstance && !mapInstance.getLayer('polygon-highlight')) {
            mapInstance.addLayer({
                id: 'polygon-highlight',
                type: 'line',
                source: 'geojson-source',
                filter: ['all', ['==', '$type', 'Polygon'], ['in', 'FE_visual_state', 'highlighted']],
                // paint: {
                //     'fill-color': '#fbff00',
                //     'fill-opacity': 0.8,
                // },
                paint: {
                    'line-color': '#fbff00',
                    'line-width': 1,
                },
            });
        }

        // Adding the LineString layer with FE_visual_state filter
        if (mapInstance && !mapInstance.getLayer('line-highlight')) {
            mapInstance.addLayer({
                id: 'line-highlight',
                type: 'line',
                source: 'geojson-source',
                filter: ['all', ['==', '$type', 'LineString'], ['in', 'FE_visual_state', 'highlighted']],
                paint: {
                    'line-color': '#fbff00',
                    'line-width': 1,
                },
            });
        }

        // Adding the Point layer with FE_visual_state filter
        if (mapInstance && !mapInstance.getLayer('point-highlight')) {
            mapInstance.addLayer({
                id: 'point-highlight',
                type: 'circle',
                source: 'geojson-source',
                filter: ['all', ['==', '$type', 'Point'], ['in', 'FE_visual_state', 'highlighted']],
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,
                        10, 10,
                        15, 20,
                    ],
                    'circle-color': '#fff',
                    'circle-opacity': 0.2,
                    'circle-stroke-width': 2,  // Outline stroke width
                    'circle-stroke-color': '#fbff00',
                },
            });
        }

        // Clean-up function to safely remove layers and sources
        return () => {
            if (mapInstance) {
                try {
                    if (mapInstance?.getLayer('polygon-highlight')) {
                        mapInstance.removeLayer('polygon-highlight');
                    }
                    if (mapInstance?.getLayer('line-highlight')) {
                        mapInstance.removeLayer('line-highlight');
                    }
                    if (mapInstance?.getLayer('point-highlight')) {
                        mapInstance.removeLayer('point-highlight');
                    }
                    if (mapInstance?.getSource('geojson-source')) {
                        mapInstance.removeSource('geojson-source');
                    }
                } catch {}
            }
        };
    }, [geojsonData, map]);

    return null;
};
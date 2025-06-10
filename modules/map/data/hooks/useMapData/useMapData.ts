import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { initialLayersList, sourceList } from './initialState';
import { LayerListItem, Source } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Feature, FeatureCollection, Geometry } from 'geojson';

interface MapDataProperties {
    FE_visual_state?: 'highlighted' | 'normal';
}

interface MapDataStore {
    layers: LayerListItem[];
    setLayers: (layers: LayerListItem[]) => void;
    addLayer: (layer: LayerListItem) => void;
    sources: Source[];
    setSources: (sources: Source[]) => void;
    addSource: (source: Source) => void;
    removeLayerAndSource: (id: string) => void;
    geojsonData: FeatureCollection<Geometry, MapDataProperties>;
    addFeature: (feature: Feature<Geometry, MapDataProperties>) => void;
    setFeatures: (features: Feature<Geometry, MapDataProperties>[]) => void;
}

export const useMapData = create<MapDataStore>()(
    devtools(
        (set) => ({
            layers: initialLayersList,
            setLayers: (layers) => set(() => ({ layers }), undefined, 'setLayers'),
            addLayer: (layer) => set((state) => ({ layers: [layer, ...state.layers] })),
            sources: sourceList,
            setSources: (sources) => set(() => ({ sources }), undefined, 'setSources'),
            addSource: (source) => set((state) => ({ sources: [source, ...state.sources] })),
            removeLayerAndSource: (id) => set((state) => ({
                sources: state.sources.filter((v) => v.uuid !== id),
                layers: state.layers.filter((v) => v.id !== id),
            })),
            geojsonData: {
                type: 'FeatureCollection',
                features: []
            },
            addFeature: (feature) =>
                set((state) => ({
                    geojsonData: {
                        ...state.geojsonData,
                        features: [...state.geojsonData.features, feature]
                    }
                }
            )),
            setFeatures: (features) =>
                set(() => ({
                    geojsonData: {
                        type: 'FeatureCollection',
                        features
                    }
                }
            )),
        }),
        { store: 'MAP-DATA', name: 'store' }
    )
);

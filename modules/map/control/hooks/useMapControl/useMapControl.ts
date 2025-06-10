import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { basemapSourceList as basemap, tools } from './initialState';
import { LayerListItem } from '@/types';

type GenericTools = {
	disabled: boolean;
	active: boolean;
    show: boolean;
	type:
       | 'navigation'
       | 'geolocate'
       | 'fullscreen'
       | 'basemap'
       | 'geocoder'
       | 'terrain'
       | 'measure'
       | 'areaMeasure'
       | 'building'
       | 'layerControl'
       | 'widgetTools'
       | 'attributesTable'
};

interface MapControlStore {
    activeBasemap: string;
    setActiveBasemap: (value: string) => void;
    basemap: Array<{
		key: string;
		label: string;
		value: string[];
		screenshot?: string;
		maxZoom?: number;
	}>;
    mapperBasemapSingle: () => {
		key: string;
		label: string;
		value: string[];
		screenshot?: string;
		maxZoom?: number;
	};
    tools: { [k in GenericTools['type']]: Omit<GenericTools, 'type'> };
    toolConfig: (x: {key: GenericTools['type'], config: Partial<Omit<GenericTools, 'type'>> }) => void;
    distanceInfo: string;
    setDistanceInfo: (x: string) => void;
    isOpenAddLayer: boolean;
    setIsOpenAddLayer: (x:boolean) => void;
    extent: any;
    setExtent: (extent: any) => void;
}

// TODO: add reset store

export const useMapControl = create<MapControlStore>()(
    devtools(
        (set, get) => ({
            activeBasemap:'positron-white',
            setActiveBasemap: (payload) => set(
                () => ({ activeBasemap: payload }),
                undefined,
                'setActiveBasemap'
            ),
            basemap,
            mapperBasemapSingle: () => {
                const basemap = get().basemap;
                const activeBasemap = get().activeBasemap;

                return basemap.find((v) => v.key === activeBasemap) ?? { value: [], key: '', label: '', screenshot: '' }
            },
            tools,
            toolConfig: ({ key, config }) => set(
                (prev) => {
                    if (config.active !== undefined) {
                        prev.tools[key].active = config.active
                    }
                    if (config.disabled !== undefined) {
                        prev.tools[key].disabled = config.disabled
                    }
                    if (config.show !== undefined) {
                        prev.tools[key].show = config.show
                    }
                    return {tools: { ...prev.tools }}
                }
            ),
            distanceInfo: '',
            setDistanceInfo: (payload) => set(
                () => ({ distanceInfo: payload })
            ),
            isOpenAddLayer: false,
            setIsOpenAddLayer: (payload) => set(() => ({ isOpenAddLayer: payload })),
            extent: {},
            setExtent: (extent) => set(() => ({ extent }), undefined, 'setExtent'),
        }),
        { store: 'MAP-CONTROL', name: 'store' }
    )
)
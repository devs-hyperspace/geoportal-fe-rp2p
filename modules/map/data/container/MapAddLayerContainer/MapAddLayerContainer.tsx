'use client'

import { useEffect, useState } from "react"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { useMapControl } from "@/modules/map/control/hooks/useMapControl"
import { MapAddLayer } from "../../components/MapAddLayer"
import { LayerListItem, Meta, ResourceParams, Source } from "@/types"
import { useMapData } from "../../hooks/useMapData"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import { LngLatBoundsLike, useMap } from "react-map-gl"
import { useSession } from "next-auth/react"
import { useUsersControl } from "@/modules/main-app/hooks/useUsersControl"
import { X } from "lucide-react"

export const MapAddLayerContainer = () => {
    const map = useMap();
    const mapControl = useMapControl()
    const {user} = useUsersControl()
    const { addLayer, addSource, layers, sources } = useMapData();
    const { data: session } = useSession();
    const kabkotId = session?.user?.kabkot?.id;;
    const [isInitialLayersFetched, setIsInitialLayersFetched] = useState(false);

    const [params, setParams] = useState<ResourceParams>({
        content: 'organization',
        category: 'all',
        type: 'all',
        subType: 'all',
        search: '',
        island: 'all',
        year: 'all',
    })

    const [debouncedSearchTerm] = useDebounce(params.search, 800);
    const [meta, setMeta] = useState<Meta>({
        page: 1,
        pageSize: 10,
        total: 0
    })
    
    const handleAddLayer = (item: any) => {
        const hasSource = sources.some((v) => v.uuid === item.uuid);
        const hasLayer = layers.some((v) => v.id === item.uuid);

        const newSource: Source = {
            uuid: item.uuid,
            id: "raster", // or the appropriate source ID
            name: item.title,
            type: "raster", // Example; adjust based on your logic
            tileSize: 256,
            minZoom: 1,
            maxZoom: 25,
            tiles: [item.wms_url], // Use appropriate data URL
        };

        // Create a new layer item to add to Zustand
        const newLayer: LayerListItem = {
            id: item.uuid, // Assuming `uuid` is a unique identifier for the layer
            name: item.title,
            active: true, // Set the layer as active or however you want
            isToggle: false,
            beforeId: undefined,
            legend: item.legend_url,
            bbox: item.extent,
            layerName: item.wms_layer_name,
            layer: {
                id: item.uuid, // or whatever identifier you want to use
                type: 'raster', // Determine layer type based on resource type
                live: false,
                source: item.uuid, // Use appropriate source based on resource type
                paint: {}
            },
        };

        if (!hasSource) addSource(newSource);
        if (!hasLayer) addLayer(newLayer);
        if (hasSource || hasLayer) {
            alert('layer already exist!');
        } else {
            mapControl.setIsOpenAddLayer(false);
            const bbox = item.extent?.coords as LngLatBoundsLike;
            map.current?.fitBounds(bbox)
        }


    };

    const handleParamsChange = (value: Partial<ResourceParams>) => {
        setParams((prev) => ({ ...prev, ...value }))
    }

    const handleMetaChange = (value: Partial<Meta>) => {
        setMeta((prev) => ({ ...prev, ...value }))
    }

    const dataQuery = useQuery({
        queryKey: ["gn", "resources", params,  debouncedSearchTerm, meta.page, user.activeGeonodeAccessToken],
        queryFn: async () => {
            const url = `/api/gn/resources?accessToken=${user.activeGeonodeAccessToken}&page=${meta.page}&page_size=${meta.pageSize}&type=${params.type}&subtype=${params.subType}&search=${debouncedSearchTerm}&island=${params.island}&year=${params.year}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            
            setMeta((prev) => ({ ...prev, total: data.total }))

            return data;
        },
        enabled: mapControl.isOpenAddLayer || !!kabkotId,
        staleTime: 300000, // To prevent requests when data is already in the cache
    });


    return (
        <Drawer open={mapControl.isOpenAddLayer} onOpenChange={(value) => mapControl.setIsOpenAddLayer(value)}>
            <DrawerContent className="flex px-6 pb-6 gap-4 min-h-[90vh]">
                <div className='w-full flex justify-between items-center'>
                    <DrawerTitle>Explore Layers</DrawerTitle>
                    <X className='cursor-pointer' onClick={() => mapControl.setIsOpenAddLayer(false)} />
                </div>
                <DrawerDescription />
                <MapAddLayer
                    meta={meta}
                    params={params}
                    dataQuery={dataQuery}
                    onAddLayer={handleAddLayer}
                    onParamsChange={handleParamsChange}
                    onMetaChange={handleMetaChange}
                />
            </DrawerContent>
        </Drawer>
    )
}

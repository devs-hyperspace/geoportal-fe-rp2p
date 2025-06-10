import { useMapData } from "@/modules/map/data/hooks/useMapData";
import { MapControlLayers } from "../../components/MapControlLayers"
import { useMapControl } from "../../hooks/useMapControl"
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCardLayer } from "../../components/SortableCardLayer";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LngLatBoundsLike, useMap } from "react-map-gl/maplibre";
import { LayerListItem } from "@/types";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Info, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { headers } from "next/headers";

export const MapControlLayersContainer = () => {
    const mapControl = useMapControl();
    const mapData = useMapData();
    const map = useMap();
    const { data: session } = useSession();
    const kabkotId = session?.user?.kabkot?.id;;

    const [deleteLayer, setDeleteLayer] = useState<LayerListItem>();
    const [isShowDialog, setIsShowDialog] = useState(false);

    const removeFeatureHighlighted = () => {
        const features = mapData.geojsonData.features;
        mapData.setFeatures(features.filter((feature) => feature.properties.FE_visual_state !== 'highlighted'))
    }

    const updateLayersOnMap = (newList: LayerListItem[]) => {        
        if (map.current) {
            // Flatten the layersGroup to access all layers in a single array
            const activeLayers = newList.filter(layer => layer.active);
            const inactiveLayers = newList.filter(layer => !layer.active);

            inactiveLayers.forEach((layer) => {
                if (map.current?.getLayer(layer.id)) {
                    map.current?.getMap().removeLayer(layer.id);
                }
            });

            activeLayers.forEach((layer, index) => {
                const beforeId = activeLayers[index - 1]?.layer.id || undefined;
                if (!map.current?.getLayer(layer.id)) {
                    map.current?.getMap().addLayer(layer.layer as any, beforeId);
                }
                if (map.current?.getLayer(layer.id)) {
                    map.current?.moveLayer(layer.id, beforeId);
                }
            });
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        const layers = mapData.layers;

        if (active.id !== over.id) {
            const oldIndex = layers.findIndex((item) => item.id === active.id);
            const newIndex = layers.findIndex((item) => item.id === over.id);
            const newList = arrayMove(layers, oldIndex, newIndex);

            mapData.setLayers(newList);
            updateLayersOnMap(newList)
        }
    }

    const handleOnCheck = (id: string) => {
        const layer = mapData.layers.find(layer => layer.id === id);
        if (layer && !layer?.active) {
            map.current?.fitBounds(layer.bbox?.coords as LngLatBoundsLike);
        }
        const updatedLayers = mapData.layers.map((layer) => {
            if (layer.id === id) {
                return {
                    ...layer,
                    active: !layer.active
                };
            }
            return layer;
        });
        mapData.setLayers(updatedLayers)
    }

    const handleOpacityChange = (value: number, id: string) => {
        const layers = mapData.layers;
        const newList = layers.map((layer) => {
            if (layer.id === id && layer.layer.type !== 'hillshade') {
                return {
                    ...layer,
                    opacity: value,
                    layer: {
                        ...layer.layer,
                        paint: {
                            ...layer.layer.paint,
                            [`${layer.layer.type}-opacity`] : value
                        }
                    }
                }
            } else {
                return layer;
            }
        })
        mapData.setLayers(newList);
    }

    const handleZoomToLayer = (layer: LayerListItem) => {
        const bbox = layer.bbox?.coords as LngLatBoundsLike;
        map.current?.fitBounds(bbox)
    }

    const handleClickDeleteLayer = (layer: LayerListItem) => {
        setDeleteLayer(layer);
        setIsShowDialog(true);
    }
    
    const handleConfirmDeleteLayer = (layer: LayerListItem) => {
        if (map.current?.getLayer(layer.id)) {
            map.current?.getMap().removeLayer(layer.id);
        }
        const source = mapData.sources.find((v) => v.uuid === layer.id)
        if (source && map.current?.getSource(source.uuid)) {
            map.current?.getMap().removeSource(source.uuid);
        }
        mapData.removeLayerAndSource(layer.id);
        setIsShowDialog(false);
    }

    const handleAddSources = () => {
        mapData.sources.forEach((source) => {
            if (!map.current?.getSource(source.uuid)) {
                const mapCurrent = map.current?.getMap();
                if (source.id === "geojson") {
                    mapCurrent?.addSource(source.uuid, {
                        type: source.type,
                        data: source.data,
                    });
                } else if (source.id === "tile") {
                    mapCurrent?.addSource(source.uuid, {
                        type: source.type,
                        minzoom: source.minZoom,
                        maxzoom: source.maxZoom,
                        tiles: source.tiles
                    });
                } else if (source.id === "tileUrl") {
                    mapCurrent?.addSource(source.uuid, {
                        type: source.type,
                        minzoom: source.minZoom,
                        maxzoom: source.maxZoom,
                        url: source.url,
                    });
                } else if (source.id === "raster") {
                    mapCurrent?.addSource(source.uuid, {
                        type: source.type,
                        minzoom: source.minZoom,
                        maxzoom: source.maxZoom,
                        tiles: source.tiles,
                        tileSize: source.tileSize,
                    });
                }
            }
        });
    };

    const handleAddLayers = () => {
        let lastActiveLayerId: string | undefined = undefined;
        const mappedData = mapData.layers.map((layer) => {
            // If the current layer is active
            if (layer.active) {
                const newLayer = {
                    ...layer,
                    beforeId: lastActiveLayerId, // Set beforeId to the last active layer ID
                };
                // Update the last active layer ID to the current one
                lastActiveLayerId = layer.id;
                return newLayer;
            }
            // If the layer is not active, just return it without modification
            return layer;
        })

        if (map.current) {
            removeFeatureHighlighted();
            mappedData.forEach((layer) => {
                if (layer.active) {
                    if (!map.current?.getLayer(layer.id)) {
                        map.current?.getMap().addLayer(layer.layer as any, layer.beforeId);
                    } else {
                        map.current?.getMap().removeLayer(layer.id)
                        map.current?.getMap().addLayer(layer.layer as any, layer.beforeId);
                    }
                } else if (!layer.active && map.current?.getLayer(layer.id)) {
                    map.current?.getMap().removeLayer(layer.id);
                }
            });
        }
    }

    useEffect(() => {
        handleAddSources();
        handleAddLayers();
    }, [map, mapData.sources, mapData.layers]);

    return (
        <div
        className='absolute'
        style={{
          top: 16,
          left: 16,
        }}
          >
        <MapControlLayers
            open={true}
            style={{
                display: mapControl.tools.layerControl.active ? '' : 'none', // prevent reseting state
            }}
            addLayer={() => {
                mapControl.setIsOpenAddLayer(true);
            }}
        >
            <div className="LayerList grid gap-2 p-3 text-primary">
                {mapData.layers.length > 0 ? (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={mapData.layers.map((layer) => layer.id)} strategy={verticalListSortingStrategy}>
                            {mapData.layers.map((layer) => {
                                return <SortableCardLayer
                                    key={`${layer.id}-${layer.name}`}
                                    layer={layer}
                                    onCheck={handleOnCheck}
                                    onOpacityChange={(value) => {
                                        handleOpacityChange(value, layer.id)
                                    }}
                                    onZoomToLayer={() => handleZoomToLayer(layer)}
                                    onDeleteLayer={() => handleClickDeleteLayer(layer)}
                                />
                            }
                        )}
                        </SortableContext>
                        <DragOverlay>
                            <div
                                className={cn(
                                    'w-full h-full',
                                    'bg-white/90'
                                )}
                            />
                        </DragOverlay>
                    </DndContext>) : (
                            <Card className="bg-[#F2F2F2] text-primary rounded-md shadow-md flex items-center gap-2 px-2 py-4">
                                <Info height={20} width={20} />
                                <span>Add Layer for Data Exploration</span>
                            </Card>
                        // !kabkotId ? (
                        // ) : (
                        //     <div className="flex items-center justify-center gap-2">
                        //         <div>Getting Initial Layer</div>
                        //         <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                        //     </div>
                        // )
                    ) 
                }
            </div>
            <AlertDialog open={isShowDialog}>
                <AlertDialogContent className="py-10 px-4">
                    <div className="flex flex-col gap-4">
                        <div className="text-primary text-center text-lg">
                            &quot;Please Confirm: Do You Really Want to Remove This Layer?&quot;
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div
                                className="bg-secondary text-primary text-center px-8 py-2 rounded-md cursor-pointer"
                                onClick={() => {
                                    if (deleteLayer) {
                                        handleConfirmDeleteLayer(deleteLayer)
                                    }
                                }}
                            >
                                Remove
                            </div>
                            <div
                                className="bg-secondary text-primary text-center px-8 py-2 rounded-md cursor-pointer"
                                onClick={() => {
                                    setIsShowDialog(false)
                                }}
                            >
                                Cancel
                            </div>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </MapControlLayers>
        </div>
    )
}
'use client'

import { useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { AttributeFilter } from "../../components/AttributeFilter";
import { useMapData } from "@/modules/map/data/hooks/useMapData";
import { urlToObject } from "@/lib/utils";
import { RasterSource, useMap } from "react-map-gl/maplibre";
import { SourceRaster } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { dataQueryProperty, useAttributeData } from "../../hooks/useAttributeData";
import { useMapControl } from "@/modules/map/control/hooks/useMapControl";

export const AttributeFilterDrawer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const attributeData = useAttributeData();
    const mapData = useMapData();
    const mapControl = useMapControl();
    const { current: mapCurrent } = useMap();
    const { toast } = useToast();
    const dataQueryAttributeLayer = dataQueryProperty(attributeData.selectedLayer?.layerName as string, attributeData.selectedLayer?.viewparams);
    const [testPassed, setTestPassed] = useState(false);

    const updateTileUrl = (source: SourceRaster, cqlFilter: string): string => {
        const wmsUrlObj = urlToObject(source.tiles[0]);
    
        if (cqlFilter) {
            wmsUrlObj.params['CQL_FILTER'] = cqlFilter;
        } else {
            delete wmsUrlObj.params['CQL_FILTER'];
        }
    
        const queryString = Object.entries(wmsUrlObj.params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
    
        return `${wmsUrlObj.baseUrl}?${queryString}`;
    };
    
    const handleUpdateSources = (cqlFilter: string) => {
        const { selectedLayer } = attributeData;
    
        if (!selectedLayer || !mapCurrent) return;
    
        const sourceInstance = mapCurrent.getSource(selectedLayer.id) as RasterSource;
        const source = mapData.sources.find((v) => v.uuid === selectedLayer.id);
    
        if (source?.type === 'raster') {
            const newTileURL = updateTileUrl(source, cqlFilter);
            sourceInstance.tiles = [newTileURL];
    
            const map = mapCurrent.getMap();
            const sourceCache = map.style.sourceCaches[selectedLayer.id];
            sourceCache.clearTiles();
            sourceCache.update(map.transform);
            map.redraw();
        }
    };

    const handleFetchTestQuery = async (layerName: string, cqlFilter: string) => {
        const url = `api/gn/layer/propertyValue?layer=${layerName}&cql_filter=${cqlFilter}`;
        const response = await fetch(url);
        return response.ok;
    };
    
    const handleTestQuery = async (query: string) => {
        const { selectedLayer } = attributeData;
        if (selectedLayer) {
            setIsLoading(true);
            const result = await handleFetchTestQuery(selectedLayer.layerName, query);
            setIsLoading(false);
            toast({
                variant: result ? 'success' : 'destructive',
                title: result ? "Testing Query Success" : "Testing Query Failed",
                description: query,
            });
            setTestPassed(result);
        }
    };

    return (
        <Drawer open={attributeData.isOpenAttrFilter} onOpenChange={(value) => attributeData.setIsOpenAttrFilter(value)}>
            <DrawerContent className="flex px-6 pb-6 gap-4 min-h-[90vh]">
                <DrawerTitle>Filter By Attribute</DrawerTitle>
                <DrawerDescription />
                <AttributeFilter
                    cqlFilter={attributeData.cqlFilter?.[(attributeData.selectedLayer?.layerName || '')]}
                    onApply={(x) => {
                        attributeData.setCqlFilter({
                            layerName: attributeData.selectedLayer?.layerName as string,
                            value: x
                        });
                        attributeData.setIsOpenAttrFilter(false);
                        handleUpdateSources(x);
                        setTestPassed(false);
                    }}
                    onCancel={() => {
                        attributeData.setIsOpenAttrFilter(false);
                        setTestPassed(false);
                    }}
                    onClear={() => {
                        if (attributeData.cqlFilter?.[(attributeData.selectedLayer?.layerName || '')] !== '') {
                            attributeData.setCqlFilter({
                                layerName: attributeData.selectedLayer?.layerName as string,
                                value: ''
                            });
                            handleUpdateSources('');
                        }
                        setTestPassed(false);
                    }}
                    onTest={handleTestQuery}
                    dataQuery={dataQueryAttributeLayer}
                    isLoading={isLoading}
                    testPassed={testPassed}
                    onChangeQuery={() => {
                        setTestPassed(false);
                    }}
                />
            </DrawerContent>
        </Drawer>
    );
};

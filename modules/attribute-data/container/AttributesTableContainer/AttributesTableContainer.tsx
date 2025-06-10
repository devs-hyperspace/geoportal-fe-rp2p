import { Card } from '@/components/ui/card';
import { useMapData } from '@/modules/map/data/hooks/useMapData';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UUID } from 'crypto';
import { AttributeTable } from './AttributeTable';
import { useMapControl } from '@/modules/map/control/hooks/useMapControl';
import { cn } from '@/lib/utils';
import { useAttributeData } from '../../hooks/useAttributeData';
export const AttributesTableContainer:React.FC<{ sizeWidgetTools: number }> = ({ sizeWidgetTools }) => {
    const mapControl = useMapControl();

    const { layers } = useMapData();
    const {filterByExtent, cqlFilter} = useAttributeData();
    const [selectedLayer, setSelectedLayer] = useState<any>({});

    const handleLayerSelect = (layerId: UUID) => {
        const layer = layers.find(layer => layer.id == layerId)
        setSelectedLayer(layer);
    };

    return (
        <div
            className={cn(
                'h-full p-6 flex flex-col gap-2',
                mapControl.tools.layerControl.active ? `w-[calc(100vw-${370+sizeWidgetTools}px)]` : `w-[calc(100vw-${60+sizeWidgetTools}px)]`
            )}
        >
            <div className='w-full flex flex-row justify-between items-center'>
                <h3 className='font-bold text-lg text-[#376C9F]'>Attributes Table</h3>
                {layers.length > 0 &&
                    <div className='flex flex-row gap-2 items-center'>
                        <p>Layer</p>
                        <Select onValueChange={handleLayerSelect}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Layer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        layers.map((layer) => {
                                            return <SelectItem key={layer.id} value={layer.id}>{layer.name}</SelectItem>
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                }
            </div>
            {layers.length === 0 ?
                <Card className='p-2 bg-[#F2F2F2] text-[#376C9F] flex flex-row gap-2 justify-center items-center'>
                    <InfoCircledIcon className='w-5 h-5' />
                    <p>Please Add Layer First</p>
                </Card> :
                selectedLayer.name ?
                    <AttributeTable filterByExtent={filterByExtent} extent={mapControl.extent} layer={selectedLayer} sizeWidgetTools={sizeWidgetTools} cqlFilter={cqlFilter}/>
                    : <Card className='p-2 bg-[#F2F2F2] text-[#376C9F] flex flex-row gap-2 justify-center items-center'>
                        <InfoCircledIcon className='w-5 h-5' />
                        <p>Please Select Layer First</p>
                    </Card>
            }
        </div>
    )
}

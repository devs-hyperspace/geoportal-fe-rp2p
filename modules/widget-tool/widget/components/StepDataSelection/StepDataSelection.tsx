import React, { Dispatch, SetStateAction } from 'react';
import { Card } from "@/components/ui/card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { LayerListItem } from "@/types";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { LayerSelector } from "../LayerSelector";
import { LabelSelect } from "../LabelSelector";
import { ListAttributes } from "../ListAttributes";
import { SelectedAttributes } from "../SelectedAttributes";
import { DataPreview } from "../DataPreview";
import { EmptyState } from "../EmptyState";
import { SelectedAttribute } from '../../hooks/useWidget';


interface StepDataSelectionProps {
    layers: LayerListItem[];
    selectedLayer?: LayerListItem;
    selectedLabel: string;
    selectedAttr: SelectedAttribute[];
    hasLayerData: boolean;
    listAttr: any[];
    dataChart: any;
    dataAttr: any;
    handleLayerSelect: (layerId: string) => void;
    handleSelectLabel: (label: string) => void;
    setSelectedAttr: (attr: SelectedAttribute[]) => void;
}

export const StepDataSelection: React.FC<StepDataSelectionProps> = ({
    layers,
    selectedLayer,
    selectedLabel,
    selectedAttr,
    hasLayerData,
    listAttr,
    dataChart,
    dataAttr,
    handleLayerSelect,
    handleSelectLabel,
    setSelectedAttr
}) => {
    return (
        <div>
            <div className="grid grid-cols-4 gap-4 mb-2">
                <div>
                    <LayerSelector 
                        layers={layers} 
                        selectedLayer={selectedLayer} 
                        handleLayerSelect={handleLayerSelect} 
                    />

                    {hasLayerData && (
                        <LabelSelect
                            listAttr={listAttr} 
                            selectedLabel={selectedLabel} 
                            handleSelectLabel={handleSelectLabel}
                            placeholder="Select Label"
                            filter={['int', 'string']}
                        />
                    )}
                </div>
                {hasLayerData && (
                    <>
                        <ListAttributes
                            listAttr={listAttr.filter((attr: any) => ['int', 'number'].includes(attr.localType))}
                            selectedLabel={selectedLabel}
                            selectedAttr={selectedAttr}
                            setSelectedAttr={setSelectedAttr as Dispatch<SetStateAction<SelectedAttribute[]>>}
                        />
                    
                        <SelectedAttributes 
                            selectedAttr={selectedAttr} 
                            setSelectedAttr={setSelectedAttr as Dispatch<SetStateAction<SelectedAttribute[]>>}
                        />

                        <DataPreview 
                            data={dataChart?.data} 
                            isLoading={dataChart.isLoading} 
                            gap={8} 
                        />
                    </>
                )}
            </div>

            {!dataAttr.data && !!selectedLayer && (
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <SkeletonWrapper key={index} isLoading={dataAttr.isLoading}>
                            <Card className={`w-${index < 2 ? '[25vw]' : 'full'} h-[60vh]`} />
                        </SkeletonWrapper>
                    ))}
                </div>
            )}
            
            {(layers.length === 0 || (layers.length > 0 && !selectedLayer)) && (
                <EmptyState
                    message={layers.length === 0 ? "Please Add Layer First" : "Please Select Layer First"}
                    icon={<InfoCircledIcon />}
                />
            )}
        </div>
    );
}; 
import React from 'react';
import { Card } from "@/components/ui/card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { LayerListItem } from "@/types";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { LayerSelector } from "../LayerSelector";
import { LabelSelect } from "../LabelSelector";
import { DataPreview } from "../DataPreview";
import { EmptyState } from "../EmptyState";
import { AggSelector } from "../AggSelector";

interface StepMetricSelectionProps {
    layers: LayerListItem[];
    selectedLayer?: LayerListItem;
    selectedLabel: string;
    hasLayerData: boolean;
    listAttr: any[];
    dataChartMetric: any;
    dataAttr: any;
    aggMetric: string;
    handleLayerSelect: (layerId: string) => void;
    handleSelectLabel: (label: string) => void;
    setAggMetric: (value: string) => void;
}

export const StepMetricSelection: React.FC<StepMetricSelectionProps> = ({
    layers,
    selectedLayer,
    selectedLabel,
    hasLayerData,
    listAttr,
    dataChartMetric,
    dataAttr,
    aggMetric,
    handleLayerSelect,
    handleSelectLabel,
    setAggMetric
}) => {
    return (
        <div>
            <div className="grid grid-cols-[1fr_2fr] gap-4 mb-2">
                <div>
                    <LayerSelector 
                        layers={layers} 
                        selectedLayer={selectedLayer} 
                        handleLayerSelect={handleLayerSelect} 
                    />
                    {hasLayerData && (
                        <>
                            <div className="mb-4">
                                <div className="flex flex-col min-w-44 mb-2">
                                    <p className="">Operation</p>
                                </div>
                                <AggSelector
                                    value={aggMetric}
                                    onValueChange={(value) => setAggMetric(value)}
                                    placeholder="Select Operation"
                                />
                            </div>
                        
                            <LabelSelect
                                listAttr={listAttr}
                                selectedLabel={selectedLabel} 
                                handleSelectLabel={handleSelectLabel}
                                placeholder="Select Attribute"
                                filter={['int', 'number']}
                            />
                        </>
                    )}
                </div>

                {hasLayerData && (
                    <DataPreview
                        data={dataChartMetric?.data}
                        isLoading={dataChartMetric.isLoading}
                        gap={2}
                    />
                )}
            </div>

            {!dataAttr.data && !!selectedLayer && (
                <div className="grid grid-cols-[1fr_2fr] gap-4">
                    {[...Array(2)].map((_, index) => (
                        <SkeletonWrapper key={index} isLoading={dataAttr.isLoading}>
                            <Card className="w-[25vw] h-[60vh]" />
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
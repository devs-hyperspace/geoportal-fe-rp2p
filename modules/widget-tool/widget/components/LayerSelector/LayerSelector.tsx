import React from "react";
import { LayerListItem } from "@/types";
import { SharedDropdownSelect } from "@/shared/components/SharedDropdownSelect";

export const LayerSelector: React.FC<{
    layers: LayerListItem[];
    selectedLayer: LayerListItem | undefined;
    handleLayerSelect: (value: string) => void;
}> = ({ layers, selectedLayer, handleLayerSelect }) => {
    // Map layers to dropdown options
    const options = layers.map((layer) => ({
        value: layer.id,
        label: layer.name,
    }));

    return (
        <>
            {layers.length > 0 && (
                <div className="flex flex-col justify-center gap-2 mb-4">
                    <p className="min-w-28">Select Layer</p>
                    <SharedDropdownSelect
                        value={selectedLayer?.id || ""}
                        onValueChange={handleLayerSelect}
                        options={options}
                        placeholder="Select Layer"
                    />
                </div>
            )}
        </>
    );
};

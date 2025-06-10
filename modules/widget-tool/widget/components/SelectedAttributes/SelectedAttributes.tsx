import { Card } from "@/components/ui/card";
import { MinusCircle } from "lucide-react";
import { AggSelector } from "../AggSelector";

interface ItemAttrProps {
    attr: string;
    agg: string;
    onChangeAgg: (value: string) => void;
    onClick: () => void;
}

const ItemAttr: React.FC<ItemAttrProps> = ({ attr, agg, onChangeAgg, onClick }) => (
    <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
        <AggSelector
            value={agg}
            onValueChange={onChangeAgg}
            placeholder="Select Aggregate"
        />
        <Card className="w-full flex justify-between items-center py-2 px-4 shadow-md">
            <p>{attr}</p>
            <MinusCircle
                size={20}
                className="cursor-pointer hover:text-red-500"
                onClick={onClick}
            />
        </Card>
    </div>
);


interface SelectedAttribute {
    attr: string;
    agg: string;
}

export const SelectedAttributes: React.FC<{
    selectedAttr: SelectedAttribute[];
    setSelectedAttr: React.Dispatch<React.SetStateAction<SelectedAttribute[]>>;
}> = ({ selectedAttr, setSelectedAttr }) => {

    // Handler to update aggregation value for a specific attribute
    const handleAggregationChange = (attr: string, agg: string) => {
        setSelectedAttr((prev) =>
            prev.map((item) =>
                item.attr === attr ? { ...item, agg } : item
            )
        );
    };

    return (
        <div>
            <div className="mb-8 flex flex-col">
                <p>Selected Attribute</p>
            </div>
            <Card className="w-full h-[54vh] overflow-auto bg-slate-100 p-2 flex flex-col gap-1 custom-scrollbar">
                {selectedAttr.map(({ attr, agg }) => (
                    <ItemAttr
                        key={attr}
                        attr={attr}
                        agg={agg}
                        onChangeAgg={(newAgg) => handleAggregationChange(attr, newAgg)}
                        onClick={() => setSelectedAttr((prev) => prev.filter((item) => item.attr !== attr))}
                    />
                ))}
            </Card>
        </div>
    );
};

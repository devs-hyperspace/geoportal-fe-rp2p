import React from 'react';
import { ChartType } from "../StepChartType/StepChartType";
import { LayerListItem } from "@/types";
import { SelectedAttribute } from "../../hooks/useWidget";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { 
    InputValueBarArea,
    InputValueMetric,
    InputValueLineScatter,
    InputValueRadarRadialPie 
} from "../../types";
import { ChartRenderer } from './ChartRenderer';

interface ChartData {
    type: ChartType;
    input: InputValueBarArea | InputValueMetric | InputValueLineScatter | InputValueRadarRadialPie;
    label: string;
    value?: number;
    chart?: CategoricalChartProps["data"];
    layer?: LayerListItem;
    attrAgg?: SelectedAttribute[];
    aggMetric?: string;
}

interface ChartItem {
    id: string;
    data: ChartData;
}

interface ChartListProps {
    items: ChartItem[];
    onEdit: (
        layer: LayerListItem | undefined,
        chartType: ChartType,
        label: string,
        input: any,
        attrAgg?: SelectedAttribute[],
        aggMetric?: string
    ) => void;
    onRemove: (id: string) => void;
}

export const ChartList: React.FC<ChartListProps> = ({ items, onEdit, onRemove }) => (
    <div className="p-2 grid grid-cols-1 gap-2 bg-gray-200 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
        {items.map(({ id, data }) => (
            <ChartRenderer
                key={id}
                id={id}
                data={data}
                onEdit={() => onEdit(
                    data.layer,
                    data.type,
                    data.label,
                    data.input,
                    data.attrAgg,
                    data.aggMetric
                )}
                onRemove={() => onRemove(id)}
            />
        ))}
    </div>
);
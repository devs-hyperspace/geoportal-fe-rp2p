import React from 'react';
import { MinusCircle, Pencil } from 'lucide-react';
import { chartColors, ChartColorsType } from '../../utils/chartConfig';
import { CustomBarChart } from "../CustomBarChart";
import { CustomAreaChart } from "../CustomAreaChart";
import { CustomLineChart } from "../CustomLineChart";
import { CustomScatterChart } from "../CustomScatterChart";
import { CustomRadarChart } from "../CustomRadarChart";
import { CustomRadialChart } from "../CustomRadialChart";
import { CustomPieChart } from "../CustomPieChart";
import { CustomMetric } from "../CustomMetric";
import type { ChartData } from './types';

const ChartComponent = {
    Bar: CustomBarChart,
    Area: CustomAreaChart,
    Line: CustomLineChart,
    Scatter: CustomScatterChart,
    Radar: CustomRadarChart,
    Radial: CustomRadialChart,
    Pie: CustomPieChart,
    Metric: CustomMetric
} as const;

interface ChartRendererProps {
    id: string;
    data: ChartData;
    onEdit: () => void;
    onRemove: () => void;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
    data,
    onEdit,
    onRemove
}) => {
    const Component = ChartComponent[data.type as keyof typeof ChartComponent];
    if (!Component) return null;

    const chartProps = {
        dataChart: data.chart,
        label: data.label,
        inputValue: data.input,
        withoutTitle: true,
        ...(data.type === 'Metric' && { value: data.value })
    };

    const palette = data.type === 'Metric' ? undefined : (data.input as any).colorPalette;

    return (
        <div className="relative" style={{...chartColors[palette as ChartColorsType]}}>
            <div className="absolute top-3 right-6">
                <div className="flex items-center gap-2">
                    <Pencil
                        size={20}
                        className="hover:text-primary cursor-pointer"
                        onClick={onEdit}
                    />
                    <MinusCircle
                        size={20}
                        className="hover:text-primary cursor-pointer"
                        onClick={onRemove}
                    />
                </div>
            </div>
            <Component {...chartProps as any} />
        </div>
    );
}; 
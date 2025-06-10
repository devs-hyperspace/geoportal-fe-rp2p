import { LabelPosition } from "recharts/types/component/Label";
import { ChartColorsType } from "../utils/chartConfig";
import { LayerListItem } from "@/types";
import { ChartType } from "../components/StepChartType/StepChartType";
import { SelectedAttribute } from "../hooks/useWidget";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";

export interface InputValueChart {
    id?: string;
    title: string;
    subTitle: string;
    footer: string;
    labelPosition: LabelPosition | 'none';
    legendPosition: string;
    colorPalette: ChartColorsType;
}

export interface InputValueLineScatter extends InputValueChart {
    xAxisTitle: string;
    yAxisValue: string[];
    yAxisLabel: string;
    yAxisLabelValue: string;
    yAxisTitle: string;
}

export interface InputValueBarArea extends InputValueLineScatter {
    stacked: 'false' | 'true' | string;
    orientation: string;
}

export interface InputValueRadarRadialPie extends InputValueChart {
    propertyValue: string[];
}

export interface InputValueMetric {
    id?: string;
    title: string;
    subTitle: string;
    unit: string;
    footer: string;
}

export interface ItemDataChart {
    id: string;
    data: {
        type: ChartType;
        input: InputValueBarArea | InputValueMetric | InputValueLineScatter | InputValueRadarRadialPie;
        label: string;
        value?: number;
        chart?: CategoricalChartProps["data"];
        layer?: LayerListItem;
        attrAgg?: SelectedAttribute[];
        aggMetric?: string;
    }
} 
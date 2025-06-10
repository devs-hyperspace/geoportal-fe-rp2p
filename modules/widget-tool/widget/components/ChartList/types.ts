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

export interface ChartData {
    type: ChartType;
    input: InputValueBarArea | InputValueMetric | InputValueLineScatter | InputValueRadarRadialPie;
    label: string;
    value?: number;
    chart?: CategoricalChartProps["data"];
    layer?: LayerListItem;
    attrAgg?: SelectedAttribute[];
    aggMetric?: string;
} 
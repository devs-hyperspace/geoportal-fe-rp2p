import React from 'react';
import { StepCustomMetric } from "../StepCustomMetric";
import { StepCustomBarArea } from "../StepCustomBarArea";
import { StepCustomLineScatter } from "../StepCustomLineScatter";
import { StepCustomRadarRadialPie } from "../StepCustomRadarRadialPie";
import { ChartType } from "../StepChartType/StepChartType";
import { 
    InputValueMetric, 
    InputValueBarArea, 
    InputValueLineScatter, 
    InputValueRadarRadialPie 
} from "../../types";

interface StepCustomizationProps {
    selectedChartType?: ChartType;
    dataChart?: any;
    dataChartMetric?: any;
    selectedLabel: string;
    inputValueMetric: InputValueMetric;
    inputValueBarArea: InputValueBarArea;
    inputValueLineScatter: InputValueLineScatter;
    inputValueRadarRadialPie: InputValueRadarRadialPie;
    setInputValueMetric: (value: InputValueMetric) => void;
    setInputValueBarArea: (value: InputValueBarArea) => void;
    setInputValueLineScatter: (value: InputValueLineScatter) => void;
    setInputValueRadarRadialPie: (value: InputValueRadarRadialPie) => void;
}

export const StepCustomization: React.FC<StepCustomizationProps> = ({
    selectedChartType,
    dataChart,
    dataChartMetric,
    selectedLabel,
    inputValueMetric,
    inputValueBarArea,
    inputValueLineScatter,
    inputValueRadarRadialPie,
    setInputValueMetric,
    setInputValueBarArea,
    setInputValueLineScatter,
    setInputValueRadarRadialPie
}) => {
    if (selectedChartType === 'Metric') {
        return (
            <StepCustomMetric
                chartType={selectedChartType}
                value={dataChartMetric?.data?.value || 0}
                inputValue={inputValueMetric}
                onChange={setInputValueMetric}
            />
        );
    }

    if (selectedChartType === 'Bar' || selectedChartType === 'Area') {
        return (
            <StepCustomBarArea
                chartType={selectedChartType}
                dataChart={dataChart?.data}
                inputValue={inputValueBarArea}
                onChange={setInputValueBarArea}
                label={selectedLabel}
            />
        );
    }

    if (selectedChartType === 'Line' || selectedChartType === 'Scatter') {
        return (
            <StepCustomLineScatter
                chartType={selectedChartType}
                dataChart={dataChart?.data}
                inputValue={inputValueLineScatter}
                onChange={setInputValueLineScatter}
                label={selectedLabel}
            />
        );
    }

    if (['Radar', 'Radial', 'Pie'].includes(selectedChartType as string)) {
        return (
            <StepCustomRadarRadialPie
                chartType={selectedChartType as 'Radar' | 'Radial' | 'Pie'}
                dataChart={dataChart?.data}
                inputValue={inputValueRadarRadialPie}
                onChange={setInputValueRadarRadialPie}
                label={selectedLabel}
            />
        );
    }

    return null;
}; 
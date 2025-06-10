import React from 'react';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Stepper } from "../Stepper";
import { StepChartType } from "../StepChartType";
import { ChartType } from "../StepChartType/StepChartType";
import { SelectedAttribute } from "../../hooks/useWidget";
import { 
    InputValueMetric,
    InputValueBarArea,
    InputValueLineScatter,
    InputValueRadarRadialPie 
} from "../../types";
import { X } from 'lucide-react';

interface ChartDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    activeStep: number;
    steps: string[];
    listChart: ChartType[];
    selectedChartType?: ChartType;
    setSelectedChartType: (type: ChartType) => void;
    setActiveStep: (step: number) => void;
    isDisabledNext: () => boolean;
    handleCreateChart: () => void;
    renderStep2: () => React.ReactNode;
    renderStep2ForMetric: () => React.ReactNode;
    renderStep3: () => React.ReactNode;
    setAggMetric: (value: string) => void;
    setSelectedLabel: (value: string) => void;
    setSelectedAttr: (value: SelectedAttribute[]) => void;
    setInputValueMetric: (value: React.SetStateAction<InputValueMetric>) => void;
    setInputValueBarArea: (value: React.SetStateAction<InputValueBarArea>) => void;
    setInputValueLineScatter: (value: React.SetStateAction<InputValueLineScatter>) => void;
    setInputValueRadarRadialPie: (value: React.SetStateAction<InputValueRadarRadialPie>) => void;
    defaultValues: {
        inputValueMetric: InputValueMetric;
        inputValueBarArea: InputValueBarArea;
        inputValueLineScatter: InputValueLineScatter;
        inputValueRadarRadialPie: InputValueRadarRadialPie;
    };
}

export const ChartDrawer: React.FC<ChartDrawerProps> = ({
    isOpen,
    onOpenChange,
    activeStep,
    steps,
    listChart,
    selectedChartType,
    setSelectedChartType,
    setActiveStep,
    isDisabledNext,
    handleCreateChart,
    renderStep2,
    renderStep2ForMetric,
    renderStep3,
    setAggMetric,
    setSelectedLabel,
    setSelectedAttr,
    setInputValueMetric,
    setInputValueBarArea,
    setInputValueLineScatter,
    setInputValueRadarRadialPie,
    defaultValues
}) => {
    const handleBack = () => {
        setActiveStep(activeStep - 1);
        if (activeStep === 1) {
            setAggMetric('');
            setSelectedLabel('');
            setSelectedAttr([]);
        } else if (activeStep === 2) {
            if (selectedChartType === 'Metric') {
                setInputValueMetric(prev => ({ id: prev?.id, ...defaultValues.inputValueMetric }));
            } else if (selectedChartType === 'Bar' || selectedChartType === 'Area') {
                setInputValueBarArea(prev => ({ id: prev?.id, ...defaultValues.inputValueBarArea }));
            } else if (selectedChartType === 'Line' || selectedChartType === 'Scatter') {
                setInputValueLineScatter(prev => ({ id: prev?.id, ...defaultValues.inputValueLineScatter }));
            } else if (selectedChartType === 'Radar' || selectedChartType === 'Radial' || selectedChartType === 'Pie') {
                setInputValueRadarRadialPie(prev => ({ id: prev?.id, ...defaultValues.inputValueRadarRadialPie }));
            }
        }
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            handleCreateChart();
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="flex px-6 pb-6 gap-4 h-[90vh]">
                <DrawerTitle>Chart Editor</DrawerTitle>
                <button 
                    onClick={() => onOpenChange(false)} 
                    className="absolute top-4 right-4 p-2"
                >
                    <X size={20} className="text-gray-700 hover:scale-125" />
                </button>
                <DrawerDescription />
                <div className="w-full flex justify-between items-center mb-4">
                    <Stepper steps={steps} activeStep={activeStep} />
                    <div className="flex items-center gap-2">
                        {activeStep > 0 && (
                            <Button
                                variant="outline"
                                className="min-w-20 px-4 py-2 text-primary bg-secondary rounded hover:bg-primary hover:text-white"
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            disabled={isDisabledNext()}
                            variant="outline"
                            className="min-w-20 px-4 py-2 text-primary bg-secondary rounded hover:bg-primary hover:text-white"
                            onClick={handleNext}
                        >
                            {activeStep < steps.length - 1 ? 'Next' : 'Create'}
                        </Button>
                    </div>
                </div>
                {activeStep === 0 && (
                    <StepChartType
                        listChart={listChart}
                        selectedChartType={selectedChartType}
                        setSelectedChartType={setSelectedChartType}
                    />
                )}
                {activeStep === 1 && selectedChartType !== 'Metric' && renderStep2()}
                {activeStep === 1 && selectedChartType === 'Metric' && renderStep2ForMetric()}
                {activeStep === 2 && renderStep3()}
            </DrawerContent>
        </Drawer>
    );
}; 
import { SampleChart } from "../SampleChart";

export type ChartType = 'Bar' | 'Line' | 'Area' | 'Scatter' | 'Pie' | 'Radar' | 'Radial' | 'Metric' | undefined

export const StepChartType: React.FC<{
    listChart: ChartType[];
    selectedChartType: ChartType | undefined;
    setSelectedChartType: (type: ChartType) => void;
}> = ({ listChart, selectedChartType, setSelectedChartType }) => (
    <div className="grid grid-cols-4 gap-4">
        {listChart.map((type) => {
            if (type) {
                const ChartComponent = SampleChart[type] || SampleChart.Bar;

                return (
                    <SampleChart.Wrapper
                        key={type}
                        chartType={type}
                        onClick={() => setSelectedChartType(type)}
                        selectedChartType={selectedChartType}
                        title={`${type} Chart`}
                    >
                        <ChartComponent />
                    </SampleChart.Wrapper>
                );
            }
        })}
    </div>
);
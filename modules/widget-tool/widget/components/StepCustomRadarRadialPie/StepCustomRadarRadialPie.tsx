/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SharedDropdownSelect } from "@/shared/components/SharedDropdownSelect";
import { LabelPosition } from "recharts/types/component/Label";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { chartColors, ChartColorsType } from "../../utils/chartConfig";
import { CustomPieChart } from "../CustomPieChart";
import { CustomRadarChart } from "../CustomRadarChart";
import { CustomRadialChart } from "../CustomRadialChart";
import { ChartColorPreview } from "../ChartColorPreview";

type inputValue = {
    title: string;
    subTitle: string;
    footer: string;
    propertyValue: string[]
    labelPosition: LabelPosition | 'none';
    legendPosition: string;
    colorPalette: ChartColorsType;
}

interface StepCustomRadarRadialPieProps {
    chartType: 'Radar' | 'Radial' | 'Pie';
    dataChart: CategoricalChartProps["data"];
    inputValue: inputValue;
    label: string;
    onChange: (x: inputValue) => void;
}

const labelPositionOptions = (
    ['none', 'top', 'left', 'right', 'bottom', 'inside', 'outside', 
    'insideLeft', 'insideRight', 'insideTop', 'insideBottom', 
    'insideTopLeft', 'insideBottomLeft', 'insideTopRight', 'insideBottomRight', 
    'insideStart', 'insideEnd', 'end', 'center', 'centerTop', 'centerBottom', 'middle']
).map(value => ({
    label: value, 
    value
}));

export const StepCustomRadarRadialPie:React.FC<StepCustomRadarRadialPieProps> = (props) => {
    const { chartType, inputValue, dataChart, label, onChange } = props;

    return (
        <div className="grid grid-cols-[1fr_2fr] gap-2 h-full">
            <Card className="bg-gray-50">
                <CardHeader>
                    <CardTitle className="text-primary text-xl font-normal">
                        <span>Chart Type: {chartType} Chart</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <Label>Title</Label>
                        <Input
                            value={inputValue.title}
                            onChange={(x) => {
                                onChange({
                                    ...inputValue,
                                    title: x.target.value,
                                })
                            }}
                            placeholder="This is Chart Title"
                        />
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <Label>Sub Title</Label>
                        <Input
                            value={inputValue.subTitle}
                            onChange={(x) => {
                                onChange({
                                    ...inputValue,
                                    subTitle: x.target.value,
                                })
                            }}
                            placeholder="This is Chart Sub Title"
                        />
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <Label>Footer</Label>
                        <Textarea
                            value={inputValue.footer}
                            onChange={(x) => {
                                onChange({
                                    ...inputValue,
                                    footer: x.target.value,
                                })
                            }}
                            className="resize-none"
                            placeholder="Input Footer Information Here"
                        />
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <Label>Property Value</Label>
                        <div className="bg-white p-2 rounded-md border flex flex-col gap-1 h-40 overflow-y-auto custom-scrollbar">
                            {Object.keys(dataChart?.[0] || {}).slice(1).map((property, idx) => {
                                return (
                                    <div key={`${idx}-${property}`} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-sm">
                                        <Checkbox
                                            id={property + idx}
                                            checked={inputValue.propertyValue.includes(property)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                    ? onChange({ ...inputValue, propertyValue: [...inputValue.propertyValue, property] })
                                                    : onChange({ ...inputValue, propertyValue: inputValue.propertyValue.filter(v => v !== property) })
                                            }}
                                        />
                                        <Label
                                            htmlFor={property + idx}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {property}
                                        </Label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <Label>Label Position</Label>
                        <SharedDropdownSelect
                            value={inputValue.labelPosition as string}
                            onValueChange={(v) => {
                                onChange({
                                    ...inputValue,
                                    labelPosition: v as LabelPosition,
                                })
                            }}
                            options={labelPositionOptions}
                            placeholder='True/False'
                            className="w-full"
                        />
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <Label>Legend Position</Label>
                        <SharedDropdownSelect
                            value={inputValue.legendPosition}
                            onValueChange={(v) => {
                                onChange({
                                    ...inputValue,
                                    legendPosition: v,
                                })
                            }}
                            options={[
                                {label: 'middle', value: 'middle'},
                                {label: 'top', value: 'top'},
                                {label: 'bottom', value: 'bottom'},
                            ]}
                            placeholder='True/False'
                            className="w-full"
                        />
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <Label>Color Pallete</Label>
                        <div className="flex gap-1">
                                {Object.entries(chartColors).map(([colorName, colorProperties]) => (
                                    <ChartColorPreview
                                        colorName={colorName as ChartColorsType}
                                        colorProperties={colorProperties}
                                        active={inputValue.colorPalette === colorName}
                                        onClick={(v) => {
                                            onChange({
                                                ...inputValue,
                                                colorPalette: v
                                            })
                                        }}
                                    />
                                ))}
                            </div>
                    </div>
                </CardContent>
            </Card>
            {chartType === 'Radar' && (
                <div style={{...chartColors[inputValue.colorPalette]}}>
                    <CustomRadarChart
                        dataChart={dataChart}
                        label={label}
                        inputValue={inputValue}
                    />
                </div>
            )}
            {chartType === 'Radial' && (
                <div style={{...chartColors[inputValue.colorPalette]}}>
                    <CustomRadialChart
                        dataChart={dataChart}
                        label={label}
                        inputValue={inputValue}
                    />
                </div>
            )}
            {chartType === 'Pie' && (
                <div style={{...chartColors[inputValue.colorPalette]}}>
                    <CustomPieChart
                        dataChart={dataChart}
                        label={label}
                        inputValue={inputValue}
                    />
                </div>
            )}
        </div>
    )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomMetric } from "../CustomMetric";

type inputValue = {
    title: string;
    subTitle: string;
    footer: string;
    unit: string;
}

interface StepCustomMetricProps {
    chartType: string;
    value: number;
    inputValue: inputValue;
    onChange: (x: inputValue) => void;
}

export const StepCustomMetric:React.FC<StepCustomMetricProps> = (props) => {
    const { chartType, value, inputValue, onChange } = props;

    return (
        <div className="grid grid-cols-[1fr_2fr] gap-2 h-full">
            <Card className="bg-gray-50">
                <CardHeader>
                    <CardTitle className="text-primary text-xl font-normal">
                        <span>Chart Type: {chartType}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-[1fr_4fr] gap-4 items-center">
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
                        <div className="grid grid-cols-[1fr_4fr] gap-4 items-center">
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
                        <div className="grid grid-cols-[1fr_4fr] gap-4 items-center">
                            <Label>Unit</Label>
                            <Input
                                value={inputValue.unit}
                                onChange={(x) => {
                                    onChange({
                                        ...inputValue,
                                        unit: x.target.value,
                                    })
                                }}
                                placeholder="Unit"
                            />
                        </div>
                        <div className="grid grid-cols-[1fr_4fr] gap-4 items-center">
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
                   </div>
                </CardContent>
            </Card>
            <CustomMetric
                value={value}
                inputValue={inputValue}
            />
        </div>
    )
}
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { LabelPosition } from "recharts/types/component/Label";
import { VerticalAlignmentType } from "recharts/types/component/DefaultLegendContent";
import { LayoutType } from "recharts/types/util/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CustomBarChartProps {
  dataChart: CategoricalChartProps["data"];
  label: string;
  inputValue: {
    stacked: 'false' | 'true' | string;
    orientation: string;
    title: string;
    subTitle: string;
    footer: string;
    xAxisTitle: string;
    yAxisValue: string[],
    yAxisLabel: string,
    yAxisLabelValue: string;
    yAxisTitle: string;
    labelPosition: LabelPosition | 'none';
    legendPosition: string;
    colorPalette: string;
  };
  withoutTitle?: boolean;
}

export const CustomBarChart: React.FC<CustomBarChartProps> = ({
  dataChart,
  label,
  inputValue,
  withoutTitle = false,
}) => {
  const chartConfig = Object.keys(dataChart?.[0] || {}).slice(1).reduce((acc: {[x: string]: any}, key, idx) => {
    acc[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),  // Capitalize the first letter of each key
        color: `var(--chart-${idx + 1})`
    };
    return acc;
  }, {}) satisfies ChartConfig;

  return (
    <Card className="h-full rounded-md">
        {!withoutTitle && (
            <CardHeader>
                    <CardTitle className="text-primary text-xl font-normal">
                        <span>Chart Preview</span>
                    </CardTitle>
            </CardHeader>
        )}
        <CardContent className={cn('text-primary', withoutTitle && 'pt-2')}>
            <div className="mb-4">
                <h2 className="text-2xl font-bold">{inputValue.title}</h2>
                <p>{inputValue.subTitle}</p>
            </div>
            {/* <pre>
                {JSON.stringify(chartConfig, undefined, 2)}
            </pre> */}
            <ChartContainer config={chartConfig} className="h-80 bg-white w-full">
                <BarChart
                    accessibilityLayer
                    data={dataChart}
                    margin={{ left: 20, top: 20, bottom: 10, right: 20 }}
                >
                    <CartesianGrid vertical={false} />
                    {inputValue.orientation === "horizontal" ? (
                        <>
                            <XAxis
                                dataKey={label}
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.toString().slice(0, 5)}
                                angle={(dataChart || [])?.length > 12 ? 45 : 0}
                                label={{
                                    value: inputValue.xAxisTitle,
                                    position: "insideBottom",
                                    offset: -20,
                                    style: { textAnchor: "middle", fill: "var(--muted-foreground)" },
                                }}
                            />
                            <YAxis
                                type="number"
                                hide={inputValue.yAxisLabel === "false"}
                                label={{ value: inputValue.yAxisTitle, angle: -90, position: 'insideLeft', offset: -10 }}
                                {
                                    ...(inputValue.yAxisLabelValue !== 'none' ? {
                                      dataKey:inputValue.yAxisLabelValue,
                                      name:inputValue.yAxisLabelValue
                                    }: {})
                                }
                            />
                        </>
                    ) : (
                        <>
                            <YAxis
                                dataKey={label}
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                                label={{
                                    value: inputValue.xAxisTitle,
                                    position: "insideLeft",
                                    offset: -20,
                                    style: { textAnchor: "middle", fill: "var(--muted-foreground)" },
                                }}
                            />
                            {inputValue.yAxisLabel === "true" && <XAxis type="number" />}
                        </>
                    )}
                    {inputValue.yAxisValue.map((dataKey) => (
                        <Bar
                            key={dataKey}
                            dataKey={dataKey}
                            radius={4}
                            fill={`var(--color-${dataKey})`}
                            stackId={inputValue.stacked === "true" ? "a" : undefined}
                        >
                            {inputValue.labelPosition !== "none" && (
                            <LabelList
                                dataKey={label}
                                position={inputValue.labelPosition}
                            />
                            )}
                        </Bar>
                    ))}
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <ChartLegend
                        verticalAlign={inputValue.legendPosition as VerticalAlignmentType}
                        align="center"
                        wrapperStyle={{ paddingTop: 40 }}
                        layout={inputValue.orientation as LayoutType}
                    />
                </BarChart>
            </ChartContainer>
            
            {inputValue.footer.length > 0 && (
                <div className="mt-4 text-balance">
                    <p>{inputValue.footer}</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
};


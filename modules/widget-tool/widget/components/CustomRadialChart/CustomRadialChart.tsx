/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  LabelList,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { VerticalAlignmentType } from "recharts/types/component/DefaultLegendContent";
import { LabelPosition } from "recharts/types/component/Label";

interface CustomRadialChartProps {
    dataChart: CategoricalChartProps["data"];
    label: string;
    inputValue: {
        title: string;
        subTitle: string;
        footer: string;
        propertyValue: string[];
        labelPosition: LabelPosition | 'none';
        legendPosition: string;
        colorPalette: string;
    };
    withoutTitle?: boolean;
}

export const CustomRadialChart: React.FC<CustomRadialChartProps> = ({
    dataChart,
    label,
    inputValue,
    withoutTitle = false,
}) => {
    const [chartConfig, setChartConfig] = useState<ChartConfig>({})

    const chartConfigProperty = Object.keys(dataChart?.[0] || {})
        .slice(1)
        .reduce((acc: { [x: string]: any }, key, idx) => {
        acc[key] = {
            label: key.charAt(0).toUpperCase() + key.slice(1),
            color: `var(--chart-${idx + 1})`,
        };
        return acc;
    }, {}) satisfies ChartConfig;

    useEffect(() => {
        const chartConfigLabel = dataChart?.reduce((acc, v, idx) => {
            acc[v[label]] = {
                label: v[label],
                color: `var(--chart-${idx + 1})`,
            };
            return acc;
        }, {})
        setChartConfig({
            ...chartConfigLabel,
            ...chartConfigProperty
        })
    }, [dataChart])

    return (
        <Card className="h-full rounded-md">
        {!withoutTitle && (
            <CardHeader>
            <CardTitle className="text-primary text-xl font-normal">
                <span>Chart Preview</span>
            </CardTitle>
            </CardHeader>
        )}
        <CardContent className={cn("text-primary", withoutTitle && "pt-2")}>
            <div className="mb-4">
            <h2 className="text-2xl font-bold">{inputValue.title}</h2>
            <p>{inputValue.subTitle}</p>
            </div>
            <ChartContainer
                config={chartConfig}
                className="h-80 bg-white w-full"
            >
                <RadialBarChart
                    data={dataChart}
                    innerRadius={100}
                    outerRadius={220}
                    margin={{ top: 20, bottom: 0, left: 20, right: 20 }}
                >
                    {inputValue.propertyValue.length === 0 && ( // prevent error appear
                        <RadialBar dataKey={inputValue.propertyValue[0]} />
                    )}
                    {inputValue.propertyValue?.map((dataKey) => (
                        <RadialBar
                            key={dataKey}
                            dataKey={dataKey}
                            fill={`var(--color-${dataKey})`}
                        >
                            {inputValue.labelPosition !== "none" && (
                                <LabelList
                                    dataKey={dataKey}
                                    position={inputValue.labelPosition}
                                    className="fill-white capitalize mix-blend-luminosity"
                                />
                            )}
                        </RadialBar>
                    ))}
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelKey={label}
                                nameKey={label}
                                indicator="line"
                                labelFormatter={(_, payload) => {
                                    return chartConfig[
                                        payload?.[0].dataKey as keyof typeof chartConfig
                                    ].label
                                }}
                            />
                        }
                    />
                    {inputValue.propertyValue.length > 0 && (
                        <ChartLegend
                            verticalAlign={inputValue.legendPosition as any}
                            align="center"
                            content={() => {
                                return (
                                <ul className="flex items-center gap-2 justify-center flex-wrap">
                                    {
                                    dataChart?.map((entry, index) => (
                                        <li key={`item-${index}`} className="flex items-center gap-1">
                                            <div className={`h-3 w-3 bg-[${chartConfig[entry[label]]?.color}]`} />
                                            {entry[label]}
                                        </li>
                                    ))
                                    }
                                </ul>
                                );
                            }}
                        />
                    )}
                </RadialBarChart>
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

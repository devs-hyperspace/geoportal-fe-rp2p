/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
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
import { LabelPosition } from "recharts/types/component/Label";

interface CustomPieChartProps {
    dataChart: CategoricalChartProps["data"];
    label: string;
    inputValue: {
        title: string;
        subTitle: string;
        footer: string;
        propertyValue: string[]
        labelPosition: LabelPosition | 'none';
        legendPosition: string;
        colorPalette: string;
    };
    withoutTitle?: boolean;
}

export const CustomPieChart: React.FC<CustomPieChartProps> = ({
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

    const outerRadius = 90;
    const innerRadius = 100;

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
            <ChartContainer config={chartConfig} className="h-80 bg-white w-full">
                <PieChart>
                    {inputValue.propertyValue.map((property, idx) => (
                        <Pie
                            key={property}
                            data={dataChart?.map(v => ({
                                ...v,
                                fill: `var(--color-${v[label]})`
                            }))}
                            dataKey={property}
                            nameKey={property}
                            {...(idx > 0 ? {innerRadius: idx > 1 ? innerRadius + 30 : innerRadius} : {})}
                            outerRadius={idx > 0 ? outerRadius + 30 : outerRadius}
                            labelLine={false}
                            label={({ payload, ...props }) => {
                                return (
                                  <text
                                    cx={props.cx}
                                    cy={props.cy}
                                    x={props.x}
                                    y={props.y}
                                    textAnchor={props.textAnchor}
                                    dominantBaseline={props.dominantBaseline}
                                    fill="hsla(var(--foreground))"
                                  >
                                    {payload[property]}
                                  </text>
                                )
                            }}
                        />
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
                    <ChartLegend
                        verticalAlign={inputValue.legendPosition as any}
                        align="center"
                        wrapperStyle={{ paddingTop: 0 }}
                        content={() => {
                            return (
                            <ul className="flex items-center gap-2 justify-center">
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
                </PieChart>
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

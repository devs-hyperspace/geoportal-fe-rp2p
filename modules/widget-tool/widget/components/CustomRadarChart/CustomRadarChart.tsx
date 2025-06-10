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

interface CustomRadarChartProps {
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

export const CustomRadarChart: React.FC<CustomRadarChartProps> = ({
    dataChart,
    label,
    inputValue,
    withoutTitle = false,
}) => {
    const chartConfig = Object.keys(dataChart?.[0] || {})
    .slice(1)
    .reduce((acc: { [x: string]: any }, key, idx) => {
      acc[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color: `var(--chart-${idx + 1})`,
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
        <CardContent className={cn("text-primary", withoutTitle && "pt-2")}>
            <div className="mb-4">
            <h2 className="text-2xl font-bold">{inputValue.title}</h2>
            <p>{inputValue.subTitle}</p>
            </div>
            <ChartContainer
                config={chartConfig}
                className="h-80 bg-white w-full"
            >
                <RadarChart data={dataChart}>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    {inputValue.propertyValue.length > 0 && (
                        <ChartLegend
                            verticalAlign={inputValue.legendPosition as VerticalAlignmentType}
                            align="center"
                            wrapperStyle={{ paddingTop: 40 }}
                        />
                    )}
                    <PolarAngleAxis dataKey={label} />
                    <PolarGrid />
                    {inputValue.propertyValue.length === 0 && ( // prevent error appear
                        <Radar
                            dataKey={inputValue.propertyValue[0]}
                            fillOpacity={0.6}
                        />
                    )}
                    {inputValue.propertyValue?.map((dataKey) => (
                        <Radar
                            key={dataKey}
                            dataKey={dataKey}
                            name={dataKey}
                            fill={`var(--color-${dataKey})`}
                            fillOpacity={0.6}
                        >
                            {inputValue.labelPosition !== "none" && (
                                <LabelList
                                    dataKey={dataKey}
                                    position={inputValue.labelPosition}
                                />
                            )}
                        </Radar>
                    ))}
                </RadarChart>
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

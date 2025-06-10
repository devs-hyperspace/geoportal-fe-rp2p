import React, { useState } from 'react'
import { useSppCity } from '../../hooks/useSppData'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { LabelPosition } from "recharts/types/component/Label";
import { VerticalAlignmentType } from "recharts/types/component/DefaultLegendContent";
import { LayoutType } from "recharts/types/util/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


type SppGeneralChartProps = {
    kabkot_id: string
}

export const SppGeneralChart: React.FC<SppGeneralChartProps> = ({ kabkot_id }) => {
    const sppCity = useSppCity(kabkot_id, true)


    if (!sppCity.data?.data?.[0]?.grafik_source) {
        return <p className="text-center text-gray-500">Loading data...</p>;
    }

    const data = sppCity.data.data[0].grafik_source;

    const chartConfig:any = {}

    if (data.length > 0){
        data.map((d:any, index:number)=>{
            chartConfig[d.indikator] = {color:d.color, capaian: d.capaian}
        })
    }


    return sppCity.data && (
        <Card className="h-full rounded-md">
            <CardContent className="h-full">
                <ChartContainer config={chartConfig}>
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ left: 0, top: 20, bottom: 0, right: 20 }}
                        >
                            <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                            <YAxis
                                dataKey="indikator"
                                type="category"
                                width={400}
                                tick={{ fontSize: 12, fontWeight: 'bold' }}
                                interval={0}
                            />
                            <Tooltip/>
                            <Bar
                                dataKey="capaian"
                                fill="#00a0fc"
                                radius={4}
                            >
                                {
                                    data.map((entry:any, index:number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))
                                }
                                <LabelList 
                                    dataKey="capaian" 
                                    position="inside" // This places the label inside the bar
                                    fontSize={12}
                                    fill="#fff" // You can change the label color if needed
                                />
                            </Bar>
                        </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
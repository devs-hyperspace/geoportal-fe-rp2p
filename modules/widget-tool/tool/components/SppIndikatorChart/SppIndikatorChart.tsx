import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";

type SppIndikatorChartProps = {
    data: any;
};

export const SppIndikatorChart: React.FC<SppIndikatorChartProps> = ({ data }) => {
    const chartConfig: any = {};

    if (data.length > 0) {
        data.forEach((d: any) => {
            chartConfig[d.indikator] = { color: d.color, capaian: d.capaian };
        });
    }

    const BAR_HEIGHT = 30;
    const MIN_HEIGHT = 350;
    const MAX_HEIGHT = 800;
    const CHART_HEIGHT = Math.max(MIN_HEIGHT, Math.min(data.length * (BAR_HEIGHT + 10) + 100, MAX_HEIGHT));
    return (
        <Card className="h-full rounded-md overflow-auto custom-scrollbar w-full">
                <ChartContainer config={chartConfig} style={{height:CHART_HEIGHT, maxWidth:"40vw"}}>
                        <div style={{ width:"100%", height:CHART_HEIGHT}}>
                        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ left: 0, top: 50, bottom: 20, right: 50 }}
                                barSize={BAR_HEIGHT}
                            >
                                <XAxis 
                                    type="number" 
                                    domain={[0, 100]} 
                                    tickFormatter={(tick) => `${tick}%`} 
                                />
                                <YAxis
                                    dataKey="nama_admin"
                                    type="category"
                                    width={200}
                                    tick={{ fontSize: 12, fontWeight: "bold", textAnchor: "end" }}
                                    interval={0}
                                    tickMargin={20}
                                />
                                <Tooltip />
                                <Bar dataKey="capaian" fill="#00a0fc" radius={4}>
                                    {data.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                    <LabelList
                                        dataKey="capaian"
                                        position="right"
                                        fontSize={12}
                                        fill="#000"
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                </ChartContainer>
        </Card>
    );
};

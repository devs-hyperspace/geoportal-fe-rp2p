import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, RadialBar, RadialBarChart, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

const chartDataPie = [
    { month: "January", desktop: 186, mobile: 80, fill: 'hsl(221.2 83.2% 53.3%)' },
    { month: "February", desktop: 305, mobile: 200, fill: 'hsl(212 95% 68%)'  },
    { month: "March", desktop: 237, mobile: 120, fill: 'hsl(216 92% 60%)' },
    { month: "April", desktop: 73, mobile: 190, fill: 'hsl(210 98% 78%)' },
    { month: "May", desktop: 209, mobile: 130, fill: 'hsl(212 97% 87%)' },
    { month: "June", desktop: 214, mobile: 140, fill: 'hsl(212 80% 90%)' },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(221.2 83.2% 53.3%)",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(212 95% 68%)",
    },
} satisfies ChartConfig;

type ChartType = 'Bar' | 'Line' | 'Area' | 'Scatter' | 'Pie' | 'Radar' | 'Radial' | 'Metric' | undefined

interface WrapperProps {
    children: React.ReactNode;
    title: string;
    selectedChartType?: string;
    chartType: ChartType;
    onClick: () => void;
}

// Wrapper Component
function Wrapper({ children, title, selectedChartType, chartType, onClick }: Readonly<WrapperProps>) {
    return (
        <Card
            className={cn(
                "w-full cursor-pointer",
                "hover:bg-secondary",
                selectedChartType === chartType ? "bg-secondary" : "bg-slate-100"
            )}
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}



// Bar Chart Component
function BarChartComponent() {
    return (
        <ChartContainer config={chartConfig} className="h-36 bg-white w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}

// Area Chart Component
function AreaChartComponent() {
    return (
        <ChartContainer config={chartConfig} className="h-36 bg-white w-full">
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                />
                <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
}

// Line Chart Component
function LineChartComponent() {
    return (
        <ChartContainer config={chartConfig} className="h-36 bg-white w-full">
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <Line
                    dataKey="desktop"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    dataKey="mobile"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    );
}

// Scatter Chart Component
function ScatterChartComponent() {
    return (
        <ChartContainer config={chartConfig} className="h-36 bg-white w-full">
            <ScatterChart
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
                >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <Scatter dataKey="mobile" fill="var(--color-mobile)"/>
                <Scatter dataKey="desktop" fill="var(--color-desktop)"/>
            </ScatterChart>
        </ChartContainer>
    );
}

// Metric Chart Component (different format data)
function MetricChartComponent() {
    return (
        <div className="flex flex-col items-center justify-center h-36 bg-white w-full">
            <div className="font-bold text-2xl">Total</div>
            <div className="font-extrabold text-4xl">123.456</div>
            <div className="text-2xl">Unit</div>
        </div>
    );
}

// Pie Chart Component (different format data)
function PieChartComponent() {
    return (
        <ChartContainer config={chartConfig} className="h-36 bg-white w-full">
            <PieChart>
                <Pie data={chartDataPie} dataKey="mobile" outerRadius={60} />
                <Pie data={chartDataPie} dataKey="desktop" innerRadius={70} outerRadius={90} />
          </PieChart>
        </ChartContainer>
    );
}

// Radar Chart Component (different format data)
function RadarChartComponent() {
    return (
        <ChartContainer config={chartConfig} className="h-36 bg-white w-full">
            <RadarChart data={chartData}>
                <PolarAngleAxis dataKey="month" />
                <PolarGrid />
                <Radar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    fillOpacity={0.6}
                />
                <Radar dataKey="mobile" fill="var(--color-mobile)" />
            </RadarChart>
        </ChartContainer>
    );
}

// Radial Chart Component (different format data)
function RadialChartComponent() {
    return (
        <ChartContainer config={chartConfig} className="h-36 bg-white w-full">
            <RadialBarChart data={chartDataPie} innerRadius={30} outerRadius={110}>
                <RadialBar dataKey="mobile" background />
          </RadialBarChart>
        </ChartContainer>
    );
}

// Export both components under SampleChart
export const SampleChart = {
    Wrapper,
    Bar: BarChartComponent,
    Area: AreaChartComponent,
    Line: LineChartComponent,
    Scatter: ScatterChartComponent,
    Metric: MetricChartComponent,
    Pie: PieChartComponent,
    Radar: RadarChartComponent,
    Radial: RadialChartComponent,
};

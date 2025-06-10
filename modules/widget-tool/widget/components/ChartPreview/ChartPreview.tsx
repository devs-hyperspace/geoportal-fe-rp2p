import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface ChartPreviewProps {
    data?: {[x: string]: any}[];
    isLoading: boolean;
}

const dataChartEmpty = [
    ["No Data", "No Data"],
    [0, 0],
  ];

export const ChartPreview:React.FC<ChartPreviewProps> = (props) => {
    const {data, isLoading} = props;
    const [dataChart, setDataChart] = useState<any[]>(dataChartEmpty);

    useEffect(() => {
        if (data && data?.length > 0) {
            setDataChart([
                Object.keys(data?.[0] ?? {}),
                ...(data || []).map((item) => Object.values(item))
            ])
        } else {
            if (!isLoading) {
                setDataChart(dataChartEmpty);
            }
        }
    }, [data, isLoading])

    return (
        <div>
            <Chart
                chartType="ScatterChart"
                width="100%"
                height="400px"
                data={dataChart}
                options={{
                        legend: { position: "bottom" },
                        animation: {
                        duration: 500,
                        easing: "out",
                    },
                }}
            />
            {isLoading && (
                <p className="text-center">Processing data ...</p>
            )}
        </div>
    )
}
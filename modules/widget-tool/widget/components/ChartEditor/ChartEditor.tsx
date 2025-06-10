import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  GoogleChartEditor,
  GoogleChartWrapper,
  GoogleViz,
  Chart,
} from "react-google-charts";
import './custom.css'
import { Settings2 } from "lucide-react";

interface ChartEditorProps {
  data?: any[];
  onClickEdit: () => void;
}

export function ChartEditor(props: ChartEditorProps) {
  const { data, onClickEdit } = props;
  const [chartEditor, setChartEditor] = useState<GoogleChartEditor>();
  const [chartWrapper, setChartWrapper] = useState<GoogleChartWrapper>();
  const [google, setGoogle] = useState<GoogleViz>();
  
  // Save initial dimensions
  const initialWidth = "100%";
  const initialHeight = "100%"; // Adjust the height as needed

  const onEditClick = () => {
    if (!chartWrapper || !google || !chartEditor) {
      return;
    }

    onClickEdit();
    chartEditor.openDialog(chartWrapper);

    google.visualization.events.addListener(chartEditor, "ok", () => {
      const newChartWrapper = chartEditor.getChartWrapper();

      // Reapply the initial width and height
      newChartWrapper.setOption("width", initialWidth);
      newChartWrapper.setOption("height", initialHeight);

      newChartWrapper.draw();

      const newChartOptions = newChartWrapper.getOptions();
      const newChartType = newChartWrapper.getChartType();

    });
  };

  return (
    <div className="relative" style={{width: initialWidth, height: initialHeight}}>
      <div
        className="p-2 absolute top-0 right-0 z-10 cursor-pointer text-secondary hover:text-primary"
        onClick={onEditClick}
      >
        <Settings2 />
      </div>
      <div className="flex rounded-sm shadow-md bg-white">
        <Chart
          chartType="ScatterChart"
          width={initialWidth}
          height={initialHeight}
          data={data}
          chartPackages={["corechart", "controls", "charteditor"]}
          getChartEditor={({ chartEditor, chartWrapper, google }) => {
            setChartEditor(chartEditor);
            setChartWrapper(chartWrapper);
            setGoogle(google);
          }}
          options={{
            legend: { position: "bottom" },
          }}
        />
      </div>
    </div>
  );
}

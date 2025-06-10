import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { AttributesTableContainer } from "@/modules/attribute-data/container/AttributesTableContainer";
import { useMapControl } from "@/modules/map/control/hooks/useMapControl";
import { WidgetToolContainer } from "@/modules/widget-tool/container/WidgetToolContainer";
import { useState } from "react";

export const MainAppResizableLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  const mapControl = useMapControl();
  const [sizeWidget, setSizeWidget] = useState(0);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full max-h-screen items-stretch relative"
    >
      <ResizablePanel defaultSize={100}>
        <ResizablePanelGroup
          direction="vertical"
          className="h-full max-h-screen items-stretch"
        >
          <ResizablePanel className='w-full h-full bg-white'>
            {props.children}
          </ResizablePanel>
          <ResizableHandle withHandle={mapControl.tools.attributesTable.active} />
          <ResizablePanel
            defaultSize={42}
            minSize={20}
            maxSize={80}
            style={{ display: mapControl.tools.attributesTable.active ? 'block' : 'none' }}>
            <div className='relative h-full bg-white'>
              <AttributesTableContainer sizeWidgetTools={mapControl.tools.widgetTools.active ? sizeWidget : 0} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle={mapControl.tools.widgetTools.active} />
      <ResizablePanel
        defaultSize={20}
        minSize={50}
        maxSize={65}
        style={{ display: mapControl.tools.widgetTools.active ? 'block' : 'none', position: 'relative' }}
        onResize={(size) => {
          const sizeInPX = (size / 100) * ((window.innerWidth || 0) - (!mapControl.tools.layerControl.active ? 60 : 370))
          setSizeWidget(Math.ceil(sizeInPX));
        }}  
      >
        <WidgetToolContainer />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
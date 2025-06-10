import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";
import { Minus, Navigation2, Plus } from "lucide-react";

interface MapControlNavigationProps {
    disabled: boolean;
}

export const MapControlNavigation:React.FC<MapControlNavigationProps> = (props) => {
    const { disabled } = props;

    const map = useMap();
    const mapCurrent = map.current; // Reference to the current map

    const [bearing, setBearing] = useState(0);

    const handleZoomIn = () => {
        mapCurrent?.zoomIn({ duration: 300 });
    };

    const handleZoomOut = () => {
        mapCurrent?.zoomOut({ duration: 300 });
    };

    const handleResetBearing = () => {
        mapCurrent?.jumpTo({ bearing: 0, pitch: 0 });
    };

    useEffect(() => {
        if (!mapCurrent) return;

        const updateBearing= () => {
            setBearing((mapCurrent.getBearing() + 360) % 360);
        };

        // Listen for map move events
        mapCurrent.on("move", updateBearing);

        // Clean up event listener on unmount
        return () => {
            mapCurrent.off("move", updateBearing);
        };
    }, [mapCurrent]);

    return (
        <div className="MapControlNavigation flex flex-col rounded-md">
            <SharedComponentButtonTooltip
                tooltipProps={{
                    side: "right",
                    children: "Zoom In"
                }}
                style={{ width: 29, height: 29, padding: 0, borderRadius: '6px 6px 0 0' }}
                onClick={handleZoomIn}
                disabled={disabled}
            >
                <Plus size={20} stroke="currentColor" />
            </SharedComponentButtonTooltip>
            <SharedComponentButtonTooltip
                tooltipProps={{
                    side: "right",
                    children: "Reset Bearing and Pitch"
                }}
                style={{ width: 29, height: 29, padding: 0, borderRadius: 0 }}
                onClick={handleResetBearing}
                disabled={disabled}
            >
                <Navigation2
                    size={20} 
                    stroke="currentColor" 
                    style={{ transform: `rotate(${bearing}deg)` }} 
                />
            </SharedComponentButtonTooltip>
            <SharedComponentButtonTooltip
                tooltipProps={{
                    side: "right",
                    children: "Zoom Out"
                }}
                style={{ width: 29, height: 29, padding: 0, borderRadius: '0 0 6px 6px' }}
                onClick={handleZoomOut}
                disabled={disabled}
            >
                <Minus size={20} stroke="currentColor" />
            </SharedComponentButtonTooltip>
        </div>
    );
};

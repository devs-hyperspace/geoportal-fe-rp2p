import { useEffect, useRef, useState } from "react";
import { useMap } from "react-map-gl";
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";
import { Expand, Shrink } from "lucide-react";

interface MapControlFullscreenProps {
    active: boolean;
    disabled: boolean;
    onClick: (x:boolean) => void;
}

export const MapControlFullscreen:React.FC<MapControlFullscreenProps> = (props) => {
    const { active, disabled, onClick } = props;

    const map = useMap();
    const mapCurrent = map.current;

    // Use the map container as the fullscreen target
    const mapContainerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (mapCurrent) {
            mapContainerRef.current = mapCurrent.getContainer(); // Get the map's container element

            const handleFullscreenChange = () => {
                onClick(document.fullscreenElement !== null);
            };

            // Listen for fullscreen change events
            document.addEventListener("fullscreenchange", handleFullscreenChange);

            return () => {
                document.removeEventListener("fullscreenchange", handleFullscreenChange);
            };
        }
    }, [mapCurrent]);

    const toggleFullscreen = () => {
        if (mapContainerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen(); // Exit fullscreen if already in fullscreen
            } else {
                mapContainerRef.current.requestFullscreen(); // Enter fullscreen on the map container
            }
        }
    };

    return (
        <div className="MapControlFullscreen">
            <SharedComponentButtonTooltip
                tooltipProps={{
                    side: "right",
                    children: "Fullscreen"
                }}
                style={{ width: 29, height: 29, padding: 0 }}
                onClick={toggleFullscreen}
                disabled={disabled}
            >
                <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke={active ? "#0088EA" : "currentColor"}
                    width={20}
                    height={20}
                >
                    {active ? <Shrink /> : <Expand />}
                </svg>
            </SharedComponentButtonTooltip>
        </div>
    );
};

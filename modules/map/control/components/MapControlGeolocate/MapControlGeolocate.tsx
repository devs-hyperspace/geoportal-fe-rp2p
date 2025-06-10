import { useEffect, useRef, useState } from "react";
import { useMap } from "react-map-gl";
import maplibregl from 'maplibre-gl'; // Ensure you are importing maplibregl correctly
import { LocateFixed, Locate } from "lucide-react";
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";

interface MapControlGeolocateProps {
    active: boolean;
    onClick: (x: boolean) => void;
    disabled: boolean;
}

export const MapControlGeolocate:React.FC<MapControlGeolocateProps> = (props) => {
    const { active, onClick, disabled } = props;

    const map = useMap();
    const mapCurrent = map.current; // Keep the reference to MapRef
    const geolocateControlRef = useRef<maplibregl.GeolocateControl | null>(null);

    useEffect(() => {
        if (!mapCurrent) return;

        // Retrieve the underlying maplibregl.Map instance
        const actualMapInstance = mapCurrent.getMap();

        const geolocateControl = new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
        });

        // Assign the control to the ref so we can trigger it later
        geolocateControlRef.current = geolocateControl;

        // Append the control's UI manually to the map container
        const geolocateContainer = document.createElement('div');
        actualMapInstance.getContainer().appendChild(geolocateContainer);
        geolocateContainer.appendChild(geolocateControl.onAdd(actualMapInstance as unknown as maplibregl.Map));

        // Handle the start and end of tracking events
        geolocateControl.on('trackuserlocationstart', () => onClick(true));
        geolocateControl.on('trackuserlocationend', () => onClick(false));

        // Clean up on component unmount
        return () => {
            geolocateControl.onRemove();
            if (geolocateContainer && geolocateContainer.parentNode) {
                geolocateContainer.parentNode.removeChild(geolocateContainer);
            }
        };
    }, [mapCurrent]);

    const triggerGeolocate = () => {
        if (geolocateControlRef.current) {
            geolocateControlRef.current.trigger();
        }
    };

    return (
        <div className="MapControlGeolocate">
            <SharedComponentButtonTooltip
                tooltipProps={{
                    side: "right",
                    children: "Geolocate",
                }}
                style={{ width: 29, height: 29, padding: 0 }}
                onClick={triggerGeolocate}
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
                    {active ? (
                        <LocateFixed color="#0088EA" /> // Tracking icon when active
                    ) : (
                        <Locate /> // Default icon
                    )}
                </svg>
            </SharedComponentButtonTooltip>
        </div>
    );
};

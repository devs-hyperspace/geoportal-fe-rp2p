import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";
import { Mountain } from "lucide-react";

interface MapControlTerrainProps {
    active: boolean;
    onClick: () => void;
    disabled: boolean;
}

export const MapControlTerrain:React.FC<MapControlTerrainProps> = (props) => {
    const { active, onClick, disabled } = props;

    const map = useMap();
    const mapCurrent = map.current?.getMap(); // Reference to the current map

    useEffect(() => {
        if (!mapCurrent) return;

        const addTerrainLayer = () => {
            if (!mapCurrent.getLayer('terrain')) {
                mapCurrent.addLayer({
                    id: 'terrain',
                    source: "terrainSource",
                    type: 'hillshade'
                });
            }
        };

        const removeTerrainLayer = () => {
            if (mapCurrent.getLayer('terrain')) {
                mapCurrent.removeLayer('terrain');
            }
        };

        // Add or remove terrain layer based on visibility
        if (active) {
            addTerrainLayer();
        } else {
            removeTerrainLayer();
        }
    }, [mapCurrent, active]);

    const toggleTerrain = () => {
        onClick();
    };

    return (
        <div className="MapControlTerrain">
            <SharedComponentButtonTooltip
                tooltipProps={{
                    side: "right",
                    children: active ? "Disable Terrain" : "Enable Terrain",
                }}
                style={{ width: 29, height: 29, padding: 0 }}
                onClick={toggleTerrain}
                disabled={disabled}
            >
                <Mountain size={20} stroke={active ? '#0088EA' : 'currentColor'} />
            </SharedComponentButtonTooltip>
        </div>
    );
};

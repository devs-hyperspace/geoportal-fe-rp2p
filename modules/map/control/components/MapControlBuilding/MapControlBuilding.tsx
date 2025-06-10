import { useEffect } from "react";
import { useMap } from "react-map-gl";
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";
import { Building2Icon } from "lucide-react"; // Make sure to import your icon correctly

const buildingSource = {
    id: 'tileUrl',
    name: "openmaptiles",
    type: "vector",
    url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
    minZoom: 6,
    maxZoom: 20,
};

interface MapControlBuildingProps {
    active: boolean;
    onClick: () => void;
    disabled: boolean;
}

export const MapControlBuilding:React.FC<MapControlBuildingProps> = (props) => {
    const { active, onClick, disabled } = props;

    const map = useMap();
    const mapCurrent = map.current?.getMap();

    useEffect(() => {
        if (!mapCurrent) return;

        // Add source if it doesn't exist
        if (!mapCurrent.getSource(buildingSource.id)) {
            mapCurrent.addSource(buildingSource.id, {
                type: 'vector',
                url: buildingSource.url,
            });
        }

        const buildingLayerId = "openmaptiles";
        const addBuildingLayer = () => {
            mapCurrent.addLayer(
                {
                    id: buildingLayerId,
                    type: "fill-extrusion",
                    source: buildingSource.id, // Use the source ID here
                    "source-layer": "building",
                    minzoom: 15,
                    filter: ['!=', ['get', 'hide_3d'], true],
                    paint: {
                        'fill-extrusion-color': '#FFFFFF',
                        'fill-extrusion-opacity': 0.5,
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            16,
                            ['get', 'render_height']
                        ],
                        'fill-extrusion-base': ['case',
                            ['>=', ['get', 'zoom'], 16],
                            ['get', 'render_min_height'], 0
                        ]
                    }
                }
            );
        };

        const removeBuildingLayer = () => {
            if (mapCurrent.getLayer(buildingLayerId)) {
                mapCurrent.removeLayer(buildingLayerId);
            }
        };

        // Add or remove the building layer based on the state
        if (active) {
            addBuildingLayer();
        } else {
            removeBuildingLayer();
        }
    }, [active, mapCurrent]); // Run effect when map or visibility changes

    const toggleBuildingVisibility = () => {
        onClick();
    };

    return (
        <div className="MapControlBuilding">
            <SharedComponentButtonTooltip
                tooltipProps={{
                    side: "right",
                    children: active ? "Hide Buildings" : "Show Buildings"
                }}
                style={{ width: 29, height: 29, padding: 0 }}
                onClick={toggleBuildingVisibility}
                disabled={disabled}
            >
                <Building2Icon size={20} color={active ? '#0088EA' : 'currentColor'} />
            </SharedComponentButtonTooltip>
        </div>
    );
};

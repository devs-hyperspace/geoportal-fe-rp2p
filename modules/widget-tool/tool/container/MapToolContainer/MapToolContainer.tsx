import { useEffect } from "react";
import { useSppData } from "../../hooks/useSppData";
import { useMap } from "react-map-gl";
import { useMapData } from "@/modules/map/data/hooks/useMapData";
import { Position } from "geojson";

export const MapToolContainer = () => {
    const {coordinates, setCoordinates} = useSppData();
    const map = useMap();
    const {setFeatures} = useMapData();

    useEffect(() => {
        if (map.current && coordinates) {
            map.current.flyTo({
                center: coordinates,
                zoom: 15,
            })
            setFeatures([
                {
                  type: "Feature",
                  properties: {
                    FE_visual_state: 'highlighted',
                  },
                  geometry: {
                    coordinates: coordinates as Position,
                    type: "Point"
                  }
                }
              ])
            setCoordinates();
        }
    }, [coordinates, map, setCoordinates, setFeatures])

    return null;
}
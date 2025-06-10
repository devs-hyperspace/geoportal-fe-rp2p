import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-map-gl";
import maplibregl from 'maplibre-gl';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import '../../css/geocoder-custom.css'
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";

const geocoderApi = {
    forwardGeocode: async (config: any) => {
        const features = [];
        try {
            const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1&marker=False`;
            const response = await fetch(request);

            const geojson = await response.json();

            for (const feature of geojson.features) {
                const center = [
                    feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
                    feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
                ];
                const point = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: center,
                    },
                    place_name: feature.properties.display_name,
                    properties: feature.properties,
                    text: feature.properties.display_name,
                    place_type: ['place'],
                    center,
                };
                features.push(point);
            }
        } catch (e) {
            console.error(`Failed to forwardGeocode with error: ${e}`);
        }

        return {
            features,
        };
    },
};

const geocoder = new MaplibreGeocoder(geocoderApi, {
    maplibregl,
    zoom: 18,
    flyTo: false,
    reverseGeocoding: true,
    showResultMarker: false,
    showResultMarkers: false,
    showResultsMarker: false,
    showMarker: false,
    marker: false,
});

interface MapControlGeocoderProps {
    active: boolean;
    onClick: () => void;
    disabled: boolean;
}

export const MapControlGeocoder:React.FC<MapControlGeocoderProps> = (props) => {
    const { active, onClick, disabled } = props;

    const map = useMap();
    const mapCurrent = map.current;
    const geocoderContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapCurrent || !geocoderContainerRef.current) return;

        // Append geocoder to the container
        geocoderContainerRef.current.appendChild(geocoder.onAdd(mapCurrent));
        geocoder.on('result', (e: any) => {
            const { result } = e;
            const [lng, lat] = result.center;

            mapCurrent?.flyTo({
                center: [lng, lat],
                zoom: 15,
                essential: true,
            });

        });

        return () => {
            geocoder.onRemove(mapCurrent);
        };
    }, [mapCurrent]);

    const toggleGeocoder = () => {
        onClick()
        if (geocoderContainerRef.current) {
            if (active) {
                geocoderContainerRef.current.style.display = 'none';
            } else {
                geocoderContainerRef.current.style.display = 'block';
            }
        }
    };

    return (
        <div className="MapControlGeocoder">
            <div className="flex gap-1 items-center">
                <div
                    ref={geocoderContainerRef}
                    style={{ display: active ? 'block' : 'none'}} // Show/hide based on state
                />
                <SharedComponentButtonTooltip
                    tooltipProps={{
                        side: 'right',
                        children: 'Geocoder'
                    }}
                    style={{ width: 29, height: 29, padding: 0 }}
                    onClick={toggleGeocoder}
                    disabled={disabled}
                >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke={active ? '#0088EA' : 'currentColor'} width={20} height={20}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </SharedComponentButtonTooltip>
            </div>
        </div>
    );
};

'use client'

import React, { useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Loader2 } from 'lucide-react';
import { MapWrapper } from '../MapWrapper';

const LoadingComponent = () => {
	return (
		<div className="absolute top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-40">
			<Loader2 className="w-12 h-12 animate-spin text-secondary" />
		</div>
	)
}

const MapComponent: React.FC<{ children: React.ReactElement, transformRequest?: any }> = React.memo(
    ({ children, transformRequest }) => {
        const [isLoaded, setIsLoaded] = useState(false);

        const handleMapLoad = () => {
            setIsLoaded(true);
        };

        return (
            <Map
                attributionControl={false}
                boxZoom={false}
                doubleClickZoom={false}
                id="map"
                initialViewState={{
                    longitude: 120.63547503271866,
                    latitude: 0.320118650658188,
                    zoom: 4,
                }}
                keyboard={false}
                transformRequest={transformRequest}
                mapStyle={{
                    version: 8,
                    glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
                    sources: {
                        terrainSource: {
                            type: "raster-dem",
                            url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
                            tileSize: 256,
                        },
                    },
                    layers: [],
                    terrain: {
                        source: "terrainSource",
                        exaggeration: 1,
                    },
                }}
                maxBounds={[
                    [63.25195312500001, -16.59408141271846],
                    [163.83300781250003, 16.088042220148818],
                ]}
                maxPitch={45}
                maxZoom={25}
                onLoad={handleMapLoad}
            >
                {isLoaded ? <>{children}</> : <LoadingComponent />}
            </Map>
        );
    },
    (prevProps, nextProps) => prevProps.transformRequest === nextProps.transformRequest
);

MapComponent.displayName = 'MapComponent';

export const MapContainer: React.FC<{ children: any }> = ({children}) => {
	return (
        <MapWrapper>
            <MapComponent>
                {children}
            </MapComponent>
        </MapWrapper>
	)
}

'use client'

import { useMapControl } from '@/modules/map/control/hooks/useMapControl';
import React, { useEffect } from 'react';
import { RasterSource, useMap } from 'react-map-gl/maplibre';

export const MapLayerBasemap: React.FC = () => {
	const map = useMap();
	const mapCurrent = map.current;
    const mapControl = useMapControl();

	useEffect(() => {
		try {
			if (mapCurrent) {
				const basemapSourceInstance = mapCurrent.getSource('basemap') as RasterSource;
				const basemapLayerInstance = mapCurrent.getLayer('basemap');
				if (basemapSourceInstance) {
                    basemapSourceInstance.tiles = mapControl.mapperBasemapSingle().value
                    basemapSourceInstance.maxzoom = mapControl.mapperBasemapSingle().maxZoom
					mapCurrent.getMap().style.sourceCaches['basemap'].clearTiles();
					mapCurrent.getMap().style.sourceCaches['basemap'].update(mapCurrent.getMap().transform);
					mapCurrent.getMap().redraw();
				} else {
					mapCurrent.getMap().addSource('basemap', {
                        type: "raster",
                        tiles: mapControl.mapperBasemapSingle().value,
                        tileSize: 256,
                        attribution: "&copy; OpenStreetMap Contributors",
                        maxzoom: mapControl.mapperBasemapSingle().maxZoom,
                    });
				}

				if (!basemapLayerInstance) {
					mapCurrent.getMap().addLayer({
                        id: "basemap",
                        type: "raster",
                        source: "basemap",
                    });
				}
			}
		} catch (error) {
			console.warn(error);
		}
	}, [mapControl.activeBasemap, mapCurrent]);

	useEffect(() => {
		return () => {
			if (mapCurrent) {
				try {
					if (mapCurrent.getMap().removeSource && mapCurrent.getMap().removeLayer) {
						if (mapCurrent.getLayer('basemap')) {
							mapCurrent.getMap().removeLayer('basemap');
						}
						if (mapCurrent.getSource('basemap')) {
							mapCurrent.getMap().removeSource('basemap');
						}
					}
				} catch (error) {
					mapCurrent.getMap();
				}
			}
		};
	}, [mapCurrent]);
	return null;
};

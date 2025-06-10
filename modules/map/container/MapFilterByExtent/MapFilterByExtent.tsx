import React, { useEffect } from 'react';
import { useMap } from 'react-map-gl';
import {debounce} from 'lodash';
import { useMapControl } from '../../control/hooks/useMapControl';

export const MapFilterByExtent: React.FC = () => {
    const { map } = useMap();
    const setExtent = useMapControl((state) => state.setExtent);

    useEffect(() => {
        if (!map) return;

        const updateExtent = debounce(() => {
            const bounds = map.getBounds();
            if (bounds) {
                setExtent({
                    west: bounds.getWest(),
                    south: bounds.getSouth(),
                    east: bounds.getEast(),
                    north: bounds.getNorth(),
                });
            }
        }, 2000); // 2s debounce delay, adjust as needed

        updateExtent();

        map.on('moveend', updateExtent);

        return () => {
            map.off('moveend', updateExtent);
            updateExtent.cancel(); // cancel any pending debounced calls on cleanup
        };
    }, [map, setExtent]);

    return null;
};

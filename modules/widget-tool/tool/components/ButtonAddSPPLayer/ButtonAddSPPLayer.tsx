import React, { useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

import { useMapControl } from "@/modules/map/control/hooks/useMapControl";
import { LayerListItem, Meta, ResourceParams, Source } from "@/types";
import { LngLatBoundsLike, useMap } from "react-map-gl";
import { useMapData } from '@/modules/map/data/hooks/useMapData';
import { objectToUrl, urlToObject } from '@/lib/utils';
import { useUsersControl } from '@/modules/main-app/hooks/useUsersControl';
import { useUserBbox } from '@/hooks/useUsers';

type ButtonAddSPPLayerProps = {
    data: any;
    kode_kabkot: string;
};

export const ButtonAddSPPLayer: React.FC<ButtonAddSPPLayerProps> = ({ data, kode_kabkot }) => {

    const userBbox = useUserBbox(kode_kabkot); 

    const map = useMap();
    const mapControl = useMapControl();
    const { addLayer, addSource, layers, sources } = useMapData();

    useEffect(() => {
        if (userBbox.data?.coordinates && map.current) {
            map.current.fitBounds(userBbox.data.coordinates as LngLatBoundsLike, { padding: 20 });
        }
    }, [userBbox.data, map]);

    const handleAddLayer = (item: any) => {
        const hasSource = sources.some((v) => v.uuid === item.uuid);
        const hasLayer = layers.some((v) => v.id === item.uuid);

        const newSource: Source = {
            uuid: item.uuid,
            id: "raster",
            name: item.title,
            type: "raster",
            tileSize: 256,
            minZoom: 1,
            maxZoom: 25,
            tiles: [item.wms_url],
        };

        const newLayer: LayerListItem = {
            id: item.uuid,
            name: item.title,
            active: true,
            isToggle: false,
            beforeId: undefined,
            legend: item.legend_url,
            bbox: item.extent,
            layerName: item.wms_layer_name,
            layer: {
                id: item.uuid,
                type: 'raster',
                live: false,
                source: item.uuid,
                paint: {}
            },
            viewparams: item.viewparams,
        };

        if (!hasSource) addSource(newSource);
        if (!hasLayer) addLayer(newLayer);
        if (hasSource || hasLayer) {
            alert('Layer already exists!');
        }

        mapControl.setIsOpenAddLayer(false);
    };

    const handleAddSppLayer = (data: any) => {
        let wmsLayerNamePoi = null;
        let wmsUrlPoi = `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/geonode/wms?service=WMS&version=1.1.0&request=GetMap&layers=geonode%3Aspp_poi&bbox=90.0%2C-10.0%2C150.0%2C15.0&width=768&height=330&srs=EPSG%3A4326&styles=&format=image%2Fpng&viewparams=kode_kabkot:${data.kode_kabkot};id:${data.indikator_id}`;
        const wmsUrlObjPoi = urlToObject(wmsUrlPoi);
        wmsLayerNamePoi = wmsUrlObjPoi.params['layers'];

        wmsUrlObjPoi.params['srs'] = 'EPSG:3857';
        wmsUrlObjPoi.params['transparent'] = 'true';
        delete wmsUrlObjPoi.params['bbox'];
        delete wmsUrlObjPoi.params['width'];
        delete wmsUrlObjPoi.params['height'];
        wmsUrlObjPoi.params['width'] = '256';
        wmsUrlObjPoi.params['height'] = '256';

        wmsUrlPoi = objectToUrl(wmsUrlObjPoi.baseUrl, wmsUrlObjPoi.params);
        wmsUrlPoi += "&bbox={bbox-epsg-3857}";

        const itemPoi = {
            uuid: crypto.randomUUID(),
            title: `POI_${data.indikator}`,
            wms_url: wmsUrlPoi,
            legend_url: `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&WIDTH=20&HEIGHT=20&LAYER=geonode%3Aspp_poi&STYLE=&version=1.3.0&sld_version=1.1.0&legend_options=fontAntiAliasing%3Atrue%3BfontSize%3A12%3BforceLabels%3Aon`,
            extent: { coords: [[106.637, -6.362], [106.779, -6.229]] },
            wms_layer_name: `geonode:spp_poi`,
            viewparams: `kode_kabkot:${data.kode_kabkot};id:${data.indikator_id}`,
        };

        const cqlFilter = `kode_kabkot:${data.kode_kabkot};indikator_id:${data.indikator_id}`;
        const encodedCqlFilter = encodeURIComponent(cqlFilter);

        let wmsUrlAdmin = `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/geonode/wms?` +
            `service=WMS&version=1.1.0&request=GetMap&layers=geonode:spp_detail&` +
            `bbox=106.636,-6.362,106.779,-6.229&` +
            `width=768&height=711&srs=EPSG:4326&styles=&format=image/png&` +
            `viewparams=${encodedCqlFilter}&sld=https://rp2p.geoportal.co.id/api/gs/sld`;

        const wmsUrlObjAdmin = urlToObject(wmsUrlAdmin);
        delete wmsUrlObjAdmin.params['bbox'];
        delete wmsUrlObjAdmin.params['width'];
        delete wmsUrlObjAdmin.params['height'];
        wmsUrlObjAdmin.params['srs'] = 'EPSG:3857';
        wmsUrlObjAdmin.params['transparent'] = 'true';
        wmsUrlObjAdmin.params['width'] = '256';
        wmsUrlObjAdmin.params['height'] = '256';

        wmsUrlAdmin = objectToUrl(wmsUrlObjAdmin.baseUrl, wmsUrlObjAdmin.params);
        wmsUrlAdmin += "&bbox={bbox-epsg-3857}";

        const itemAdmin = {
            uuid: crypto.randomUUID(),
            title: `Capaian_${data.indikator}`,
            wms_url: wmsUrlAdmin,
            legend_url: `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&WIDTH=20&HEIGHT=20&LAYER=geonode%3Aspp_detail&STYLE=&version=1.3.0&sld_version=1.1.0&legend_options=fontAntiAliasing%3Atrue%3BfontSize%3A12%3BforceLabels%3Aon&sld=https://rp2p.geoportal.co.id/api/gs/sld`,
            extent: { coords: userBbox.data },
            wms_layer_name: 'geonode:spp_detail',
            viewparams: encodedCqlFilter,
        };

        handleAddLayer(itemAdmin);
        handleAddLayer(itemPoi);
    };

    return userBbox.data && (
        <Button variant={'outline'} size='sm' onClick={() => handleAddSppLayer(data)}>Add Layer</Button>
    );
};

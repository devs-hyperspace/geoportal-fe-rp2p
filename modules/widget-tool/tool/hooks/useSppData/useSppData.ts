import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LngLatLike } from 'maplibre-gl';
import { sppDetailPOI, payloadSppDetailPOI } from '@/app/api/spp/spp_detail_poi/[poi_id]/route';

interface SppDataStore {
    coordinates?: LngLatLike;
    setCoordinates: (value?: LngLatLike) => void;
}

export const useSppData = create<SppDataStore>()(
    devtools(
        (set) => ({
            coordinates: undefined,
            setCoordinates: (value?: LngLatLike) =>
                set(() => ({ coordinates: value }), undefined, 'setCoordinates'),
            }),
        { store: 'SPP-DATA', name: 'store' }
    )
);

export const useSppCity = (kabkot_id: string, enabled:boolean) => {
    return useQuery({
        queryKey: ["useSppCity", kabkot_id],
        queryFn: async () => {
            const url = `api/spp/spp_city/${kabkot_id}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        enabled,
        staleTime: 300000,
    });
};

export const useSppLayerStyle = () => {
    return useQuery({
        queryKey: ["useSppLayerStyle"],
        queryFn: async () => {
            const url = `api/gs/sld`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        staleTime: 300000,
    });
};


export const useSppCityDetail = (kabkot_id: string, enabled:boolean) => {
    return useQuery({
        queryKey: ["useSppCityDetail", kabkot_id],
        queryFn: async () => {
            const url = `api/spp/spp_city_detail/${kabkot_id}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        enabled,
        staleTime: 300000,
    });
};

export const useSppCityIndicator = (kabkot_id: string, indikator_id: string, enabled:boolean) => {
    return useQuery({
        queryKey: ["useSppCityIndicator", kabkot_id, indikator_id],
        queryFn: async () => {
            const url = `api/spp/spp_city_indicator/${kabkot_id}/${indikator_id}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        staleTime: 300000,
    });
};

export const useSppDetailPOI = (poi_id?: string) => {
    return useQuery<sppDetailPOI>({
        queryKey: ["useSppDetailPOI", poi_id],
        queryFn: async () => {
            const url = `api/spp/spp_detail_poi/${poi_id}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        enabled: !!poi_id,
    });
};

export const useExportSPP = (kode_kabkot?: string) => {
    return useQuery<any>({
        queryKey: ["useExportSPP", kode_kabkot],
        queryFn: async () => {
            const url = `/api/spp/export/${kode_kabkot}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            return { blob, contentDisposition };
        },
        enabled: !!kode_kabkot,
    });
};
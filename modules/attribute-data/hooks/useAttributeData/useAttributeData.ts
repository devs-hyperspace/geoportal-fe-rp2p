import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useQuery } from '@tanstack/react-query';
import { LayerListItem } from '@/types';

interface AttributeDataStore {
    filterByExtent: boolean;
    setFilterByExtent: (filterByExtent: boolean) => void;
    cqlFilter: {[layerName: string]: string};
    setCqlFilter: (x:{layerName: string, value: string}) => void;
    selectedLayer: LayerListItem | null;
    setSelectedLayer: (x:LayerListItem) => void;
    isOpenAttrFilter: boolean;
    setIsOpenAttrFilter: (x:boolean) => void;
}

export const useAttributeData = create<AttributeDataStore>()(
    devtools(
        (set) => ({
            filterByExtent: false,
            setFilterByExtent: (filterByExtent: boolean) =>
                set(() => ({ filterByExtent }), undefined, 'setFilterByExtent'),
            cqlFilter: {},
            setCqlFilter: (value) => set(
                (prev) => ({
                    cqlFilter: {
                        ...prev.cqlFilter,
                        [value.layerName]: value.value
                    }
                })
            ),
            selectedLayer: null,
            setSelectedLayer: (payload) => set(
                () => ({ selectedLayer: payload })
            ),
            isOpenAttrFilter: false,
            setIsOpenAttrFilter: (payload) => set(() => ({ isOpenAttrFilter: payload })),
        }),
        { store: 'ATTR-DATA', name: 'store' }
    )
);

export const dataQueryProperty = (layerName: string, viewparams?: string) => {
    return useQuery({
        queryKey: ["dataQueryProperty", layerName, viewparams],
        queryFn: async () => {
            const url = `api/gn/layer/property?layer=${layerName}${viewparams ? `&viewparams=${viewparams}`: ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        staleTime: 300000,
        enabled: !!layerName,
    });
};

export const dataQueryPropertyValue = (layerName: string, extent: any, filterByExtent: boolean, cqlFilter: string, viewparams?: string) => {
    return useQuery({
        queryKey: ["dataQueryPropertyValue", layerName, filterByExtent, cqlFilter, ...(filterByExtent ? [extent] : []), viewparams],
        queryFn: async () => {
            const url = `api/gn/layer/propertyValue?layer=${layerName}&cql_filter=${cqlFilter}${filterByExtent ? `&bbox=${extent.west},${extent.south},${extent.east},${extent.north}` : ''}${viewparams ? `&viewparams=${viewparams}`: ''}`;
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

export const dataQueryAggregate = (layerName: string, type: string, attribute: string) => {
    return useQuery({
        queryKey: ["dataQueryAggregate", layerName, type, attribute],
        queryFn: async () => {
            const url = `api/gn/layer/aggregate?layer=${layerName}&attribute=${attribute}&type=${type}`
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

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useQuery } from '@tanstack/react-query';

interface WidgetStore {
    filterByExtent: boolean;
    setFilterByExtent: (value: boolean) => void;
}

export interface SelectedAttribute {
    attr: string;
    agg: string;
}

export const useWidget = create<WidgetStore>()(
    devtools(
        (set) => ({
            filterByExtent: false,
            setFilterByExtent: (value: boolean) =>
                set(() => ({ filterByExtent: value }), undefined, 'setFilterByExtent'),
            }),
        { store: 'WIDGET', name: 'store' }
    )
);

export const useChartPropertyValue = (layerName: string, extent: any, filterByExtent: boolean, cqlFilter: string, properties: SelectedAttribute[], enabled: boolean) => {
    return useQuery({
        queryKey: ["useChartPropertyValue", layerName, filterByExtent, cqlFilter, ...(filterByExtent ? [extent] : []), properties],
        queryFn: async () => {
            const url = `api/gn/layer/propertyValue?layer=${layerName}&property=${properties.map(v => v.attr).join(',')}&agg=${properties.map(v => v.agg).join(',')}&cql_filter=${cqlFilter}${filterByExtent ? `&bbox=${extent.west},${extent.south},${extent.east},${extent.north}` : ''}`;
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

export const useChartPropertyValueMetric = (layerName: string, extent: any, filterByExtent: boolean, cqlFilter: string, properties: SelectedAttribute[], enabled: boolean) => {
    return useQuery({
        queryKey: ["useChartPropertyValueMetric", layerName, filterByExtent, cqlFilter, ...(filterByExtent ? [extent] : []), properties],
        queryFn: async () => {
            const url = `api/gn/layer/propertyValue?layer=${layerName}&property=${properties.map(v => v.attr).join(',')}&agg=${properties.map(v => v.agg).join(',')}&metric=true&cql_filter=${cqlFilter}${filterByExtent ? `&bbox=${extent.west},${extent.south},${extent.east},${extent.north}` : ''}`;
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

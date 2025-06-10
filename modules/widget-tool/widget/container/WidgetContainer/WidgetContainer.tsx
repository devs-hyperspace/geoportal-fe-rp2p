/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Info, InfoIcon, Loader2, PlusCircle } from "lucide-react"
import { useMapData } from "@/modules/map/data/hooks/useMapData";
import { LayerListItem } from "@/types";
import { dataQueryProperty, useAttributeData } from "@/modules/attribute-data/hooks/useAttributeData";
import { useChartPropertyValue, useWidget } from "../../hooks";
import { useMapControl } from "@/modules/map/control/hooks/useMapControl";
import { useChartPropertyValueMetric, SelectedAttribute } from "../../hooks/useWidget";
import { ChartType } from "../../components/StepChartType/StepChartType";
import { StepDataSelection } from "../../components/StepDataSelection";
import { StepMetricSelection } from "../../components/StepMetricSelection";
import { StepCustomization } from "../../components/StepCustomization";
import {
    InputValueChart,
    InputValueLineScatter,
    InputValueBarArea,
    InputValueRadarRadialPie,
    InputValueMetric,
    ItemDataChart
} from "../../types";
import { ChartList } from "../../components/ChartList";
import { ChartDrawer } from "../../components/ChartDrawer";
import { Card } from "@/components/ui/card";

const defaultInputValueMetrtic = {
    title: '',
    subTitle: '',
    footer: '',
    unit: '',
}

const defaultInputValueChart: InputValueChart = {
    title: '',
    subTitle: '',
    footer: '',
    labelPosition: 'none',
    legendPosition: 'bottom',
    colorPalette: 'default'
}

const defaultInputValueLineScatter: InputValueLineScatter = {
    ...defaultInputValueChart,
    xAxisTitle: '',
    yAxisValue: [],
    yAxisLabel: 'false',
    yAxisLabelValue: 'none', // total / count
    yAxisTitle: '',
}

const defaultInputValueBarArea: InputValueBarArea = {
    ...defaultInputValueLineScatter,
    stacked: 'false',
    orientation: 'horizontal',
}

const defaultInputValueRadarRadialPie: InputValueRadarRadialPie = {
    ...defaultInputValueChart,
    propertyValue: []
}

const LoadingComponent = () => {
    return (
        <div className="absolute flex-col inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 gap-4">
            <p className="text-white text-wrap">Updating Chart Data</p>
            <Loader2 className="w-12 h-12 animate-spin text-secondary" />
        </div>
    )
}

export const WidgetContainer = () => {
    const { layers } = useMapData();
    const { extent } = useMapControl();
    const { cqlFilter: cql } = useAttributeData();
    const { filterByExtent, setFilterByExtent } = useWidget();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState<LayerListItem | undefined>();
    const [selectedAttr, setSelectedAttr] = useState<SelectedAttribute[]>([]);
    const [itemsDataChart, setItemsDataChart] = useState<ItemDataChart[]>([]);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [aggMetric, setAggMetric] = useState('')
    const [inputValueMetric, setInputValueMetric] = useState<InputValueMetric>(defaultInputValueMetrtic)
    const [inputValueBarArea, setInputValueBarArea] = useState<InputValueBarArea>(defaultInputValueBarArea)
    const [inputValueLineScatter, setInputValueLineScatter] = useState<InputValueLineScatter>(defaultInputValueLineScatter)
    const [inputValueRadarRadialPie, setInputValueRadarRadialPie] = useState<InputValueRadarRadialPie>(defaultInputValueRadarRadialPie)
    const [isUpdatingChartData, setIsUpdatingChartData] = useState(false);

    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Chart Type', 'Chart Data', 'Customize'];
    const [selectedChartType, setSelectedChartType] = useState<ChartType>();
    const listChart: ChartType[] = ['Bar', 'Area', 'Line', 'Scatter', 'Metric', 'Pie', 'Radar', 'Radial']

    const layerName = selectedLayer?.layerName as string;
    const cqlFilter = cql[layerName] ?? '';
    const dataAttr = dataQueryProperty(layerName, selectedLayer?.viewparams);
    const hasLayerData = !!selectedLayer && !!dataAttr.data;
    const listAttr = dataAttr?.data?.featureTypes || [];
    const dataChart = useChartPropertyValue(
        layerName,
        extent,
        filterByExtent,
        cqlFilter,
        [
            { agg: 'count', attr: selectedLabel },
            ...selectedAttr
        ],
        selectedAttr.length > 0 && !!selectedLayer && !!selectedLabel
    );
    const dataChartMetric = useChartPropertyValueMetric(
        layerName,
        extent,
        filterByExtent,
        cqlFilter,
        [{ agg: aggMetric, attr: selectedLabel }],
        !!selectedLabel && selectedChartType === 'Metric' && !!aggMetric
    );

    const handleOnCreate = () => {
        setIsDrawerOpen(true);
    }

    const handleLayerSelect = (layerId: string) => {
        const layer = layers.find(layer => layer.id == layerId)
        setSelectedLayer(layer);
    };

    const handleSelectLabel = (v: string) => {
        setSelectedLabel(v);
    }

    useEffect(() => {
        if (!isDrawerOpen) {
            setSelectedLayer(undefined);
            setSelectedLabel('');
            setSelectedAttr([]);
            setAggMetric('')
            setSelectedChartType(undefined);
            setActiveStep(0);
            setInputValueMetric(defaultInputValueMetrtic)
            setInputValueBarArea(defaultInputValueBarArea);
            setInputValueLineScatter(defaultInputValueLineScatter);
            setInputValueRadarRadialPie(defaultInputValueRadarRadialPie);
        }
    }, [isDrawerOpen])

    useEffect(() => {
        if (selectedChartType) {
            const currentId = inputValueMetric.id ||
                inputValueBarArea.id ||
                inputValueLineScatter.id ||
                inputValueRadarRadialPie.id;

            setInputValueMetric({ ...defaultInputValueMetrtic, id: currentId });
            setInputValueBarArea({ ...defaultInputValueBarArea, id: currentId });
            setInputValueLineScatter({ ...defaultInputValueLineScatter, id: currentId });
            setInputValueRadarRadialPie({ ...defaultInputValueRadarRadialPie, id: currentId });
        }
    }, [selectedChartType]);

    const renderStep2 = () => (
        <StepDataSelection
            layers={layers}
            selectedLayer={selectedLayer}
            selectedLabel={selectedLabel}
            selectedAttr={selectedAttr}
            hasLayerData={hasLayerData}
            listAttr={listAttr}
            dataChart={dataChart}
            dataAttr={dataAttr}
            handleLayerSelect={handleLayerSelect}
            handleSelectLabel={handleSelectLabel}
            setSelectedAttr={setSelectedAttr}
        />
    );

    const renderStep2ForMetric = () => (
        <StepMetricSelection
            layers={layers}
            selectedLayer={selectedLayer}
            selectedLabel={selectedLabel}
            hasLayerData={hasLayerData}
            listAttr={listAttr}
            dataChartMetric={dataChartMetric}
            dataAttr={dataAttr}
            aggMetric={aggMetric}
            handleLayerSelect={handleLayerSelect}
            handleSelectLabel={handleSelectLabel}
            setAggMetric={setAggMetric}
        />
    );

    const renderStep3 = () => (
        <StepCustomization
            selectedChartType={selectedChartType}
            dataChart={dataChart}
            dataChartMetric={dataChartMetric}
            selectedLabel={selectedLabel}
            inputValueMetric={inputValueMetric}
            inputValueBarArea={inputValueBarArea}
            inputValueLineScatter={inputValueLineScatter}
            inputValueRadarRadialPie={inputValueRadarRadialPie}
            setInputValueMetric={setInputValueMetric}
            setInputValueBarArea={setInputValueBarArea}
            setInputValueLineScatter={setInputValueLineScatter}
            setInputValueRadarRadialPie={setInputValueRadarRadialPie}
        />
    );

    const isDisabledNext = () => {
        switch (activeStep) {
            case 0:
                return !selectedChartType;
            case 1: {
                if (selectedChartType === 'Metric') {
                    return !dataChartMetric.data
                } else {
                    return !dataChart.data;
                }
            }
            case 2:
                return false;
            default:
                return false;
        }
    }

    const handleCreateChart = () => {
        const id = itemsDataChart.length === 0 ? 'widget-chart-1' : 'widget-chart-' + (itemsDataChart.length + 1);

        const createOrUpdateChart = (inputValue: any) => {
            const baseChartData = {
                type: selectedChartType,
                label: selectedLabel,
                chart: dataChart?.data,
                input: { ...inputValue, id: inputValue.id || id },
                attrAgg: selectedAttr,
                layer: selectedLayer,
            };

            if (inputValue.id) {
                const updatedIndex = itemsDataChart.findIndex(v => v.id === inputValue.id);
                const updatedData = itemsDataChart.map((v, idx) => idx === updatedIndex ? {
                    id: inputValue.id,
                    data: baseChartData
                } as ItemDataChart : v);
                setItemsDataChart(updatedData);
            } else {
                setItemsDataChart(prev => ([
                    ...prev,
                    {
                        id,
                        data: baseChartData
                    }
                ]));
            }
        };

        const createOrUpdateMetric = () => {
            const baseMetricData = {
                type: 'Metric',
                label: selectedLabel,
                value: dataChartMetric?.data?.value,
                input: { ...inputValueMetric, id: inputValueMetric.id || id },
                layer: selectedLayer,
                aggMetric: aggMetric,
            };

            if (inputValueMetric.id) {
                const updatedIndex = itemsDataChart.findIndex(v => v.id === inputValueMetric.id);
                const updatedData = itemsDataChart.map((v, idx) => idx === updatedIndex ? {
                    id: inputValueMetric.id,
                    data: baseMetricData
                } as ItemDataChart : v);
                setItemsDataChart(updatedData);
            } else {
                setItemsDataChart(prev => ([
                    ...prev,
                    {
                        id,
                        data: {
                            ...baseMetricData,
                            type: 'Metric' as ChartType
                        }
                    }
                ]));
            }
        };

        switch (selectedChartType) {
            case 'Bar':
            case 'Area':
                createOrUpdateChart(inputValueBarArea);
                break;
            case 'Line':
            case 'Scatter':
                createOrUpdateChart(inputValueLineScatter);
                break;
            case 'Radar':
            case 'Radial':
            case 'Pie':
                createOrUpdateChart(inputValueRadarRadialPie);
                break;
            case 'Metric':
                createOrUpdateMetric();
                break;
        }

        setIsDrawerOpen(false);
    }

    const handleChartEdit = (
        layer: LayerListItem | undefined,
        chartType: ChartType,
        label: string,
        input: any,
        attrAgg?: SelectedAttribute[],
        aggMetric?: string
    ) => {
        setSelectedLayer(layer);
        setSelectedChartType(chartType);
        setSelectedLabel(label);
        setIsDrawerOpen(true);
        setActiveStep(1);

        switch (chartType) {
            case 'Bar':
            case 'Area':
                setInputValueBarArea(input as InputValueBarArea);
                setSelectedAttr(attrAgg as SelectedAttribute[]);
                break;
            case 'Line':
            case 'Scatter':
                setInputValueLineScatter(input as InputValueLineScatter);
                setSelectedAttr(attrAgg as SelectedAttribute[]);
                break;
            case 'Radar':
            case 'Radial':
            case 'Pie':
                setInputValueRadarRadialPie(input as InputValueRadarRadialPie);
                setSelectedAttr(attrAgg as SelectedAttribute[]);
                break;
            case 'Metric':
                setInputValueMetric(input as InputValueMetric);
                setAggMetric(aggMetric ?? '');
                break;
        }
    };

    const handleChartRemove = (id: string) => {
        setItemsDataChart(prev => prev.filter(item => item.id !== id));
    };

    const fetchDataChartPropertyValue = async (
        layerName: string,
        extent: any,
        filterByExtent: boolean,
        cqlFilter: string,
        properties: SelectedAttribute[],
        isMetric: boolean
    ): Promise<any> => {
        const url = `api/gn/layer/propertyValue?layer=${layerName}&property=${properties.map(v => v.attr).join(',')}&agg=${properties.map(v => v.agg).join(',')}${isMetric ? '&metric=true' : ''}&cql_filter=${cqlFilter}${filterByExtent ? `&bbox=${extent.west},${extent.south},${extent.east},${extent.north}` : ''
            }`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    };

    const fetchDataForCharts = async () => {
        setIsUpdatingChartData(true);
        const updatedCharts = await Promise.all(
            itemsDataChart.map(async (item) => {
                const isMetric = item.data.type === 'Metric';
                const newChartData = await fetchDataChartPropertyValue(
                    item?.data?.layer?.layerName as string,
                    extent,
                    filterByExtent,
                    cqlFilter,
                    [
                        { agg: isMetric ? item?.data?.aggMetric as string : "count", attr: item?.data?.label },
                        ...(item?.data?.attrAgg || []),
                    ],
                    isMetric
                );

                return {
                    ...item,
                    data: {
                        ...item.data,
                        chart: !isMetric ? newChartData : undefined,
                        value: isMetric ? newChartData?.value : undefined,
                    },
                };
            })
        );

        setItemsDataChart(updatedCharts as ItemDataChart[]);
        setIsUpdatingChartData(false)
    };

    useEffect(() => {
        fetchDataForCharts()
    }, [...(filterByExtent ? [extent] : []), filterByExtent])

    return (
        <React.Fragment>
            <div>
                <div className="bg-gray-100 h-screen p-4 gap-4 flex flex-col">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                        <h3 className="text-primary text-xl font-bold">Chart Builder</h3>
                        <div className="flex gap-2 items-center text-primary">
                            <Button
                                variant="outline"
                                onClick={() => setFilterByExtent(!filterByExtent)}
                                className={filterByExtent ? 'hover:bg-secondary hover:text-white bg-primary text-white' : ''}
                                size='sm'
                            >
                                <h3>Filter By Extent</h3>
                            </Button>
                            <Button
                                variant={'outline'}
                                className="text-primary bg-secondary rounded hover:bg-primary hover:text-white flex items-center gap-2"
                                size='sm'
                                onClick={handleOnCreate}
                            >
                                Create
                                <PlusCircle size={20} />
                            </Button>
                            {/* <div>Total: {itemsDataChart.length}</div> */}
                        </div>
                    </div>
                    <div className="relative">
                        {isUpdatingChartData && <LoadingComponent />}
                        {itemsDataChart.length > 0 ? (
                            <ChartList
                                items={itemsDataChart}
                                onEdit={handleChartEdit}
                                onRemove={handleChartRemove}
                            />
                        ) : <Card className="bg-[#F2F2F2] text-primary rounded-md shadow-md flex items-center gap-2 px-2 py-4">
                            <Info height={20} width={20} />
                            <span>Planning Tools tidak tersedia untuk Admin</span>
                        </Card>}
                    </div>
                </div>
            </div>
            <ChartDrawer
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                activeStep={activeStep}
                steps={steps}
                listChart={listChart}
                selectedChartType={selectedChartType}
                setSelectedChartType={setSelectedChartType}
                setActiveStep={setActiveStep}
                isDisabledNext={isDisabledNext}
                handleCreateChart={handleCreateChart}
                renderStep2={renderStep2}
                renderStep2ForMetric={renderStep2ForMetric}
                renderStep3={renderStep3}
                setAggMetric={setAggMetric}
                setSelectedLabel={setSelectedLabel}
                setSelectedAttr={setSelectedAttr}
                setInputValueMetric={setInputValueMetric}
                setInputValueBarArea={setInputValueBarArea}
                setInputValueLineScatter={setInputValueLineScatter}
                setInputValueRadarRadialPie={setInputValueRadarRadialPie}
                defaultValues={{
                    inputValueMetric: defaultInputValueMetrtic,
                    inputValueBarArea: defaultInputValueBarArea,
                    inputValueLineScatter: defaultInputValueLineScatter,
                    inputValueRadarRadialPie: defaultInputValueRadarRadialPie
                }}
            />
        </React.Fragment>
        // <React.Fragment>
        //     {isUpdatingChartData && <LoadingComponent />}
        //     <div>
        //         <div className="px-4 flex items-center justify-between text-sm flex-wrap gap-2">
        //             <Button
        //                 variant={'outline'}
        //                 className="px-4 py-2 text-primary bg-secondary rounded hover:bg-primary hover:text-white flex items-center gap-2"
        //                 size='sm'
        //                 onClick={handleOnCreate}
        //             >
        //                 Create
        //                 <PlusCircle size={20} />
        //             </Button>
        //             <div className="flex gap-2 items-center text-primary">
        //                 <Button
        //                     variant="outline"
        //                     onClick={() => setFilterByExtent(!filterByExtent)}
        //                     className={filterByExtent ? 'hover:bg-secondary hover:text-white bg-primary text-white' : ''}
        //                     size='sm'
        //                 >
        //                     <h3>Filter By Extent</h3>
        //                 </Button>
        //                 <div>Total: {itemsDataChart.length}</div>
        //             </div>
        //         </div>
        //         <div className="p-4">
        //             {itemsDataChart.length > 0 && (
        //                 <ChartList
        //                     items={itemsDataChart}
        //                     onEdit={handleChartEdit}
        //                     onRemove={handleChartRemove}
        //                 />
        //             )}
        //         </div>
        //     </div>
        //     <ChartDrawer
        //         isOpen={isDrawerOpen}
        //         onOpenChange={setIsDrawerOpen}
        //         activeStep={activeStep}
        //         steps={steps}
        //         listChart={listChart}
        //         selectedChartType={selectedChartType}
        //         setSelectedChartType={setSelectedChartType}
        //         setActiveStep={setActiveStep}
        //         isDisabledNext={isDisabledNext}
        //         handleCreateChart={handleCreateChart}
        //         renderStep2={renderStep2}
        //         renderStep2ForMetric={renderStep2ForMetric}
        //         renderStep3={renderStep3}
        //         setAggMetric={setAggMetric}
        //         setSelectedLabel={setSelectedLabel}
        //         setSelectedAttr={setSelectedAttr}
        //         setInputValueMetric={setInputValueMetric}
        //         setInputValueBarArea={setInputValueBarArea}
        //         setInputValueLineScatter={setInputValueLineScatter}
        //         setInputValueRadarRadialPie={setInputValueRadarRadialPie}
        //         defaultValues={{
        //             inputValueMetric: defaultInputValueMetrtic,
        //             inputValueBarArea: defaultInputValueBarArea,
        //             inputValueLineScatter: defaultInputValueLineScatter,
        //             inputValueRadarRadialPie: defaultInputValueRadarRadialPie
        //         }}
        //     />
        // </React.Fragment>
    )
}
"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMapControl } from '@/modules/map/control/hooks/useMapControl';
import { QueryObserverResult } from '@tanstack/react-query';
import { InfoIcon, PenLineIcon } from 'lucide-react';
import AttributeSummary from './AttributeSummary';
import { useAttributeData } from '../../hooks/useAttributeData';

interface QueryFilterProps {
    dataQuery: QueryObserverResult<any>;
    onApply: (x: string) => void;
    onCancel: () => void;
    onClear: () => void;
    onTest: (x: string) => void;
    cqlFilter?: string;
    isLoading: boolean;
    testPassed: boolean;
    onChangeQuery: (x: string) => void;
}

export const AttributeFilter: React.FC<QueryFilterProps> = (props) => {
    const {
        onApply,
        cqlFilter,
        onCancel,
        dataQuery,
        onClear,
        onTest,
        isLoading,
        testPassed,
        onChangeQuery,
    } = props;

    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [attData, setAttData] = React.useState<any[]>([]);

    
    const [selectAttribute, setSelectAttribute] = React.useState<any>()
    const mapControl = useMapControl();
    const attributeData = useAttributeData();


    React.useEffect(() => {
        setLoading(true);
        setError(null);

        const timeout = setTimeout(() => {
            setError("Data loading timed out. Please try again.");
            setLoading(false);
        }, 60000);

        if (dataQuery.error) {
            setError("Failed to load data. Please try again.");
            setLoading(false);
            clearTimeout(timeout);
        } else if (dataQuery.data) {
            setAttData(dataQuery.data.featureTypes);
            setLoading(false);
            clearTimeout(timeout);
        }

        return () => clearTimeout(timeout); // Clean up timeout on component unmount
    }, [dataQuery.data, dataQuery.error]);


    const insertText = (text: string) => {
        setQuery((prev) => `${prev}${text} `);
    };

    const clearQuery = () => {
        setQuery('');
        onClear();
    };

    const testQuery = () => {
        onTest(query);
    };

    const applyQuery = () => {
        onApply(query)
    };

    const cancelQuery = () => {
        setQuery('');
        onCancel();
    };
    const selectAtt = (attribute:any) => {
        setSelectAttribute(attribute)
    };

    const operators = [
        { symbol: '=', text: '=' },
        { symbol: '!=', text: '!=' },
        { symbol: '>', text: '>' },
        { symbol: '<', text: '<' },
        { symbol: '<>', text: '<>' },
        { symbol: '>=', text: '>=' },
        { symbol: '<=', text: '<=' },
        { symbol: '%', text: '%' },
        { symbol: '+', text: '+' },
        { symbol: '-', text: '-' },
        { symbol: '*', text: '*' },
        { symbol: '/', text: '/' },
        { symbol: 'AND', text: 'AND' },
        { symbol: 'OR', text: 'OR' },
        { symbol: 'LIKE', text: "LIKE 'value%'" },
        { symbol: 'ILIKE', text: "ILIKE 'value%'" },
        { symbol: 'IN', text: "IN ('value1', 'value2')" },
        { symbol: 'NOT IN', text: "NOT IN ('value1', 'value2')" },
        { symbol: 'NOT', text: "NOT(attribute_name = 'value')" },
        { symbol: 'BBOX', text: "BBOX(geometry,west,south,east,north,'EPSG:3857')" },
    ];

    return (
        <div className="w-full h-full p-4 flex flex-row gap-2">
            <Card className="w-[35vw] max-h-[70vh] overflow-auto custom-scrollbar">
                <table className="w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Attribute</th>
                            <th className="py-2 px-4 border-b">Type</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attData.length > 0 && attData.map((attribute) => (
                            <tr key={attribute.name}>
                                <td className="py-2 px-4 border-b font-medium">{attribute.name}</td>
                                <td className="py-2 px-4 border-b">{attribute.localType}</td>
                                <td className="py-2 px-4 border-b flex flex-row gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => insertText(attribute.name)}
                                        className="mx-1"
                                    >
                                        <PenLineIcon/>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => selectAtt(attribute)}
                                        // className="mx-1"
                                    >
                                        <InfoIcon/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <div className='flex flex-col w-[65vw] gap-4'>
                {selectAttribute && <AttributeSummary attribute={selectAttribute} layer={attributeData.selectedLayer?.layerName}/>}
                {/* <Card className='min-h-[15vh] p-2 w-full flex-col'>
                    <p>Summary (Attribute Name, Type Number: Count, Min, Median, Max, Average, Sum, StdDev)</p>
                    <p>Summary (Attribute Name, Type String : Example1, Example 2, Example 3)</p></Card> */}
                <div className="button-panel w-full grid grid-cols-10 gap-1">
                    {operators.map((op, index) => (
                        <Button
                            key={index}
                            variant={'outline'}
                            className="p-2 text-sm bg-secondary text-primary rounded hover:bg-primary hover:text-white min-w-[80px]"
                            onClick={() => insertText(op.text)}
                        >
                            {op.symbol}
                        </Button>
                    ))}
                </div>

                <textarea
                    className="w-full h-[15vh] mt-2 p-2 border border-gray-300 rounded"
                    placeholder="Write your query here..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChangeQuery(e.target.value);
                    }}
                />

                <div>Please test the query first to ensure accuracy before applying changes.</div>

                <div className='w-full'>
                    <Button
                        variant={'outline'}
                        className="mx-1 px-4 py-2 text-primary bg-secondary rounded hover:bg-primary hover:text-white"
                        onClick={testQuery}
                        disabled={query.length === 0 || isLoading}
                    >
                        Test
                    </Button>
                    <Button
                        variant={'outline'}
                        className="mx-1 px-4 py-2 text-primary bg-secondary rounded hover:bg-primary hover:text-white"
                        onClick={applyQuery}
                        disabled={isLoading || !testPassed}
                    >
                        Apply
                    </Button>
                    <Button
                        variant={'outline'}
                        className="mx-1 px-4 py-2 text-primary bg-secondary rounded hover:bg-primary hover:text-white"
                        onClick={clearQuery}
                        disabled={isLoading}
                    >
                        Clear
                    </Button>
                    <Button
                        variant={'outline'}
                        className="mx-1 px-4 py-2 text-primary bg-secondary rounded hover:bg-primary hover:text-white"
                        onClick={cancelQuery}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
                
                {cqlFilter && <Card className='p-4 w-full flex-row gap-2 flex items-center'>
                    <p className='font-bold text-primary'>Active Query Filter:</p>
                    <p>{cqlFilter}</p>
                </Card>}
            </div>
        </div>
    );
};
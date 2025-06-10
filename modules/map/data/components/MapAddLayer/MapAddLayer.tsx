"use client"

import SkeletonWrapper from '@/components/SkeletonWrapper';
import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatExecTime, substringText, toTitleCase } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { QueryObserverResult } from '@tanstack/react-query';
import { Meta, ResourceParams } from '@/types';

import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Layers } from 'lucide-react';


interface MapAddLayerProps {
    params: ResourceParams;
    dataQuery: QueryObserverResult<any>;
    meta: Meta;
    onMetaChange: (x: Partial<Meta>) => void;
    onParamsChange: (x: Partial<ResourceParams>) => void;
    onAddLayer: (x: any) => void;
}


export const MapAddLayer: React.FC<MapAddLayerProps> = (props) => {
    const {
        meta,
        params,
        dataQuery,
        onMetaChange,
        onParamsChange,
        onAddLayer,
    } = props;

    if (dataQuery.error) {
        return <div>Error: {dataQuery.error.message}</div>;
    }

    const totalRecords = dataQuery.data?.total || meta.total; // Get the total count
    const totalPages = Math.ceil(totalRecords / meta.pageSize); // Calculate total pages
    const years = Array.from({ length: 41 }, (_, i) => (2020 + i).toString()); // Generate years 2020 to 2060


    return (
        <div className='w-full h-full'>
            <div className='flex flex-row w-full h-full'>
                <div className='flex flex-col gap-2 justify-start items-start w-3/12 p-4'>
                    <div className='flex flex-row gap-2 w-full items-center'>
                        <h3 className="text-gray-700 text-sm w-2/12">Type</h3>
                        <Tabs defaultValue={params.type} className='w-10/12'>
                            <TabsList>
                                <TabsTrigger value="all" onClick={() => onParamsChange({ type: 'all' })}>All</TabsTrigger>
                                <TabsTrigger value="dataset" onClick={() => onParamsChange({ type: 'dataset' })}>Dataset</TabsTrigger>
                                <TabsTrigger value="map"
                                    onClick={() => {
                                        onParamsChange({ type: 'map' });
                                        onParamsChange({ subType: 'all' }); // Automatically set subtype to 'all' when 'map' is selected
                                    }}>Map
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className='flex flex-row gap-2 w-full items-center'>
                        <h3 className="text-gray-700 text-sm w-2/12">Subtype</h3>
                        <Select
                            defaultValue={params.subType}
                            disabled={params.type === 'map'}
                            onValueChange={(value) => onParamsChange({ subType: value })}
                        >
                            <SelectTrigger className="w-10/12">
                                <SelectValue placeholder="Select an Layer Sub Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subtype</SelectItem>
                                <SelectItem value="vector">Vector</SelectItem>
                                <SelectItem value="raster">Raster</SelectItem>
                                <SelectItem value="vector-time">Vector Time</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-row items-center w-full gap-2">
                        <h3 className="text-gray-700 text-sm w-2/12">Search</h3>
                        <Input
                            className="text-gray-700 text-sm w-10/12 focus:border-transparent focus:ring-0"
                            placeholder="Search layer..."
                            value={params.search}
                            onChange={(e) => onParamsChange({ search: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onParamsChange({ search: e.currentTarget.value });
                                }
                            }}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-4 justify-start items-start w-9/12 p-2 h-full'>
                    <div className='grid grid-cols-5 gap-2 w-full h-full'>
                        {dataQuery.isLoading ? (
                            // Show skeleton cards while data is loading
                            Array.from({ length: 10 }).map((_, index) => (
                                <SkeletonWrapper key={index} isLoading={true}>
                                    <Card className='w-full h-[30vh] shadow p-0' />
                                </SkeletonWrapper>
                            ))
                        ) : (dataQuery.data.resources.length > 0 ?
                            dataQuery.data.resources.map((item: any) => (
                                <SkeletonWrapper key={item.pk} isLoading={false}>
                                    <div className="relative group w-full h-[30vh] transition-transform transform hover:scale-105 duration-300 ease-in-out">
                                        <Card className="w-full h-full shadow p-0 rounded">
                                            {/* Image Section */}
                                            <div className="w-full h-3/6 relative rounded">
                                                {item.thumbnail_url ? (
                                                    <Image
                                                        src={item.thumbnail_url}
                                                        alt={item.title}
                                                        width="0"
                                                        height="0"
                                                        sizes="100vw"
                                                        className="w-full h-full"
                                                        placeholder='blur'
                                                        blurDataURL='/image/placeholder.jpg'
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/image/placeholder.jpg";
                                                        }}
                                                        onAbort={(e) => {
                                                            e.currentTarget.src = "/image/placeholder.jpg";
                                                        }}
                                                    />
                                                ) : (
                                                    <Image
                                                        src={"/image/placeholder.jpg"}
                                                        alt={item.title}
                                                        width="0"
                                                        height="0"
                                                        sizes="100vw"
                                                        className="w-full h-full"
                                                    />
                                                )}
                                                <div className="h-1/2 absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded rounded-bl-none rounded-br-none">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white shadow-lg"
                                                        onClick={() => onAddLayer(item)}
                                                    >
                                                        <Layers /> +Add
                                                    </Button>
                                                </div>
                                            </div>


                                            {/* Card Content */}
                                            <CardContent className="h-3/6 p-2 flex flex-col justify-between items-start w-full overflow-hidden">
                                                {/* Title Section */}
                                                <CardTitle className="text-md w-full">
                                                    <p className="flex text-wrap w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                                                        {toTitleCase(item.title)}
                                                    </p>
                                                </CardTitle>

                                                {/* Content Section */}
                                                <div className="flex flex-row justify-between items-end w-full gap-2">
                                                    <div className="flex flex-col justify-between items-start gap-1 min-w-0 flex-1">
                                                        <div className="flex flex-row gap-1 items-center min-w-0 flex-wrap">
                                                            {/* Avatar */}
                                                            {item.owner.avatar && (
                                                                <Image
                                                                    src={item.owner.avatar}
                                                                    alt="avatar"
                                                                    width={15}
                                                                    height={15}
                                                                    className="rounded-lg shrink-0"
                                                                />
                                                            )}

                                                            {/* Badges - Ensuring they wrap and don't overflow */}
                                                            <Badge variant="outline" className="truncate max-w-[40%]">
                                                                {item.resource_type}
                                                            </Badge>

                                                            {item.resource_type !== "map" && (
                                                                <Badge variant="outline" className="truncate max-w-[40%]">
                                                                    {item.subtype}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {/* Execution Time */}
                                                        <p className="text-xs truncate w-full">{formatExecTime(item.created)}</p>
                                                    </div>
                                                </div>
                                            </CardContent>

                                        </Card>
                                    </div>
                                </SkeletonWrapper>

                            )) : <Card className='w-full shadow p-2'>No Data Available</Card>
                        )}
                    </div>
                    <div className='flex flex-row justify-between items-center w-full gap-2'>
                        <div className='w-2/12'>Total: {totalRecords} Layers</div>
                        <Pagination className="w-10/12 flex justify-end items-center">
                            <PaginationContent className="flex items-end">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={() => onMetaChange({ page: meta.page - 1 })}
                                    />
                                </PaginationItem>

                                {/* Show first page */}
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => onMetaChange({ page: 1 })}
                                        className={meta.page === 1 ? 'bg-primary text-white' : ''}
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Show ellipsis if meta.page is greater than 3 */}
                                {meta.page > 3 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {/* Show two pages before and after the current page */}
                                {Array.from({ length: 3 }).map((_, index) => {
                                    const pageNumber = meta.page - 1 + index;
                                    if (pageNumber > 1 && pageNumber < totalPages) {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={() => onMetaChange({ page: pageNumber })}
                                                    className={meta.page === pageNumber ? 'bg-primary text-white' : ''}
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}

                                {/* Show ellipsis if there are pages between the last displayed and the last page */}
                                {meta.page < totalPages - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {/* Show the last page */}
                                {totalPages > 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={() => onMetaChange({ page: totalPages })}
                                            className={meta.page === totalPages ? 'bg-primary text-white' : ''}
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={() => onMetaChange({ page: meta.page + 1 })}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, { useState } from 'react'
import { useSppData, useSppCityIndicator } from '../../hooks/useSppData/useSppData'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MapPinIcon } from 'lucide-react'
import { useMapData } from '@/modules/map/data/hooks/useMapData'
import { useToast } from '@/components/ui/use-toast'
import { SppDetailPOI } from '../SppDetailPOI'

type SppDetailIndikatorAdminProps = {
    data: any,
    kode_kabkot: string
}

export const SppDetailIndikatorAdmin: React.FC<SppDetailIndikatorAdminProps> = ({ data, kode_kabkot }) => {
    const sppCityDetail = useSppCityIndicator(kode_kabkot, data[0].indikator_id, true)
    const [openDetail, setOpenDetail] = useState<{ [key: number]: boolean }>({});
    const {setCoordinates} = useSppData();
    const {layers} = useMapData();
    const { toast } = useToast()
    const [poiId, setPoiId] = useState<string | undefined>(undefined);

    if (sppCityDetail.data?.data.length === 0) {
        return "Loading Data..."
    }

    // Toggle row details
    const toggleDetail = (index: number) => {
        setOpenDetail((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return sppCityDetail.data?.data && (
        <Card className='w-full flex flex-col gap-2  rounded-lg overflow-x-auto custom-scrollbar'>
            <Table className="border border-gray-300 w-full rounded-lg">
                <TableHeader className="border-b border-gray-300">
                    <TableRow className="border-b border-gray-300">
                        <TableHead className="w-[100px] text-xs text-center">Nama Admin</TableHead>
                        <TableHead className="w-[100px] text-xs text-center">Jumlah Penduduk</TableHead>
                        <TableHead className="w-[100px] text-xs text-center">Penduduk Tertentu</TableHead>
                        <TableHead className="w-[100px] text-xs text-center">Fasilitas Tersedia</TableHead>
                        <TableHead className="w-[100px] text-xs text-center">Defisit Fasilitas</TableHead>
                        <TableHead className="w-[100px] text-xs text-center">Capaian (%)</TableHead>
                        <TableHead className="w-[100px] text-xs text-center">Kelas Capaian</TableHead>
                        <TableHead className="w-[100px] text-xs text-center">Detail</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sppCityDetail.data?.data.map((dt: any, index: number) => (
                        <React.Fragment key={`tb-${index}`}>
                            {/* Main Row */}
                            <TableRow className="border-b border-gray-300">
                                <TableCell className="text-left">{dt.nama_admin}</TableCell>
                                <TableCell className="text-center">{dt.jumlah_penduduk.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{dt.jumlah_penduduk_tertentu.toLocaleString()}</TableCell>
                                <TableCell className="text-center">{dt.jumlah_fasilitas}</TableCell>
                                <TableCell className="text-center">{dt.jumlah_defisit_fasilitas > 0 ? -(dt.jumlah_defisit_fasilitas) : 0}</TableCell>
                                <TableCell className="text-center">{dt.capaian}</TableCell>
                                <TableCell
                                    className="text-center text-xs text-white"
                                    style={{ backgroundColor: dt.color }}
                                >
                                    <div className='p-2 bg-white rounded text-primary font-bold'>
                                    {dt.kelas_capaian}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => toggleDetail(index)}>
                                            {openDetail[index] ? "Hide" : "POI"}
                                        </Button>
                                    </CollapsibleTrigger>
                                </TableCell>
                            </TableRow>

                            {/* Collapsible Row */}
                            <TableRow className={`bg-gray-100 ${openDetail[index] ? '' : 'hidden'}`}>
                                <TableCell colSpan={8} className='w-full p-0'>
                                    <Collapsible open={openDetail[index]}>
                                        <CollapsibleContent className="w-full">
                                            {dt.poi_detail.features.length > 0 ? <Table className="w-full">
                                                <TableHeader className="border-b border-gray-300">
                                                    <TableRow className="border-b border-gray-300">
                                                        <TableHead className="text-xs text-center">No</TableHead>
                                                        <TableHead className="text-xs text-center">Nama Fasilitas</TableHead>
                                                        <TableHead className="text-xs text-center">Sumber</TableHead>
                                                        <TableHead className="text-xs text-center">Detail</TableHead>
                                                        <TableHead className="text-xs text-center">Aksi</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    
                                                    {dt.poi_detail.features.map((poi: any, idx: number) => (
                                                        <TableRow key={`poi-${idx}`} className="border-b border-gray-300">
                                                            <TableCell className="text-center">{idx+1}</TableCell>
                                                            <TableCell className="text-left">{poi.properties.poi_name}</TableCell>
                                                            <TableCell className="text-center">{poi.properties.source}</TableCell>
                                                            <TableCell className="text-center">
                                                                <Button
                                                                    variant={'outline'}
                                                                    size={'sm'}
                                                                    onClick={() => {
                                                                        setPoiId(poi.properties.id)
                                                                    }}
                                                                >
                                                                    Detail
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Button
                                                                    variant={'outline'}
                                                                    size={'sm'}
                                                                    onClick={() => {
                                                                        const hasLayer = layers.find(v => v.name?.replace('POI_', '') === dt.indikator)?.active;
                                                                        if (!hasLayer) {
                                                                            toast({
                                                                                description: "Mohon lakukan add layer terlebih dahulu untuk melihat detail poi",
                                                                                variant: 'destructive',
                                                                            })
                                                                        } else {
                                                                            setCoordinates(poi.geometry.coordinates)
                                                                        }
                                                                    }}
                                                                >
                                                                    <MapPinIcon/>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table> : <div className='text-center w-full font-bold text-red-500'>Fasilitas Tidak Tersedia</div>}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
            <SppDetailPOI poiId={poiId} onClose={() => setPoiId(undefined)} />
        </Card>
    )
}

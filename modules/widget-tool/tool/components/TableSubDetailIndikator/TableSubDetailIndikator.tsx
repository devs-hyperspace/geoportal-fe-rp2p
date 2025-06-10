import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'

type TableSubDetailIndikatorProps={
    data:any
    onClickDetail: (indikator_id:string)=>void;
}

export const TableSubDetailIndikator:React.FC<TableSubDetailIndikatorProps> = ({data, onClickDetail}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-xs text-center">Nama Admin</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Jumlah Penduduk</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Penduduk Tertentu</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Fasilitas Tersedia</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Defisit Fasilitas</TableHead>
                    {/* <TableHead className="w-[100px] text-xs text-center">Detail</TableHead> */}
                </TableRow>
            </TableHeader>
            {

                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium text-center">{data.nama_admin}</TableCell>
                        <TableCell className="text-center">{data.jumlah_penduduk.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{data.jumlah_penduduk_tertentu.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{data.jumlah_fasilitas}</TableCell>
                        <TableCell className="text-center">{data.jumlah_defisit_fasilitas > 0 ? -data.jumlah_defisit_fasilitas : 0}</TableCell>
                        {/* <TableCell className="text-center"><Button variant={'outline'} size='sm' onClick={()=>onClickDetail(data.indikator_id)}>Detail</Button></TableCell> */}
                    </TableRow>
                </TableBody>
            }
        </Table>
    )
}

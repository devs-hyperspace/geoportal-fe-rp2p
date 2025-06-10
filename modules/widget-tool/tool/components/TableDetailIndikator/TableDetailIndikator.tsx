import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useMapData } from '@/modules/map/data/hooks/useMapData'
import { objectToUrl, urlToObject } from '@/lib/utils'
import { useUsersControl } from '@/modules/main-app/hooks/useUsersControl'
import { useUserBbox } from '@/hooks/useUsers'
import { ButtonAddSPPLayer } from '../ButtonAddSPPLayer/ButtonAddSPPLayer'

type TableDetailIndikatorProps = {
    data: any
    onClickDetail: (indikator_id: string) => void;
}

export const TableDetailIndikator: React.FC<TableDetailIndikatorProps> = ({ data, onClickDetail }) => {
    const userControl = useUsersControl()

    return (
        <Table className='w-full'>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-xs text-center">Level Administrasi</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Ambang Batas</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Penduduk Tertentu</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Fasilitas Tersedia</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Defisit Fasilitas</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Aksi</TableHead>
                    <TableHead className="w-[100px] text-xs text-center">Detail</TableHead>
                </TableRow>
            </TableHeader>
            {

                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">{data.admin_level}</TableCell>
                        <TableCell>1 : {data.ambang_batas.toLocaleString()}</TableCell>
                        <TableCell>{data.jumlah_penduduk_tertentu.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{data.jumlah_fasilitas}</TableCell>
                        <TableCell className="text-center">{data.jumlah_defisit_fasilitas > 0 ? -data.jumlah_defisit_fasilitas : 0}</TableCell>
                        <TableCell className="text-center"><ButtonAddSPPLayer kode_kabkot={userControl.user.activeKabkotId} data={data} /></TableCell>
                        <TableCell className="text-center"><Button variant={'outline'} size='sm' onClick={() => onClickDetail(data.indikator_id)}>Detail</Button></TableCell>
                    </TableRow>
                </TableBody>
            }
        </Table>
    )
}

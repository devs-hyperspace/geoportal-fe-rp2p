import React from 'react'
import { useSppCity } from '../../hooks/useSppData'
import { Card } from '@/components/ui/card'
import { ButtonExportSpp } from '../ButtonExportSPP'

type SppGeneralInfoProps = {
    kabkot_id: string
}

export const SppGeneralInfo: React.FC<SppGeneralInfoProps> = ({ kabkot_id }) => {
    const sppCity = useSppCity(kabkot_id, true)


    return sppCity.data && (
        <div className='flex flex-col gap-2 w-full'>
            {/* <Card className="flex flex-row gap-2 items-center shadow-md w-full">
                <div className="text-md text-center font-bold p-2 w-full">Jumlah Penduduk</div>
                <div className="text-md font-bold p-2 border-l text-center w-full">{sppCity.data?.data[0]?.jumlah_penduduk.toLocaleString()} Jiwa</div>
            </Card> */}
            <Card className="flex flex-row gap-2 items-center shadow-md w-full">
                <div className="text-md text-center font-bold w-1/3">Progress Capaian SPP</div>
                <div className="flex flex-row text-md font-bold p-3 border-l items-center text-center rounded-r w-2/3 gap-2 h-full" style={{ backgroundColor: sppCity.data?.data[0]?.color }} >
                    <p className='w-1/4 p-2 bg-white rounded'>{sppCity.data?.data[0]?.capaian.toFixed().toLocaleString()} %</p>
                    <p className='w-2/4 p-2 bg-white rounded'>{sppCity.data?.data[0]?.kelas_capaian}</p>
                    <div className='w-1/4'>
                        <ButtonExportSpp kode_kabkot={kabkot_id} />
                    </div>
                </div>
            </Card>

            {/* <Card className={`flex p-2 flex-row gap-2 justify-center items-center`} style={{ backgroundColor: sppCity.data?.data[0]?.color }}>
                <div className="text-md">Capaian SPP</div>
                <div className="text-md font-bold">{sppCity.data?.data[0]?.capaian.toFixed().toLocaleString()} % ({sppCity.data?.data[0]?.kelas_capaian})</div>
            </Card> */}
        </div>
    )
}
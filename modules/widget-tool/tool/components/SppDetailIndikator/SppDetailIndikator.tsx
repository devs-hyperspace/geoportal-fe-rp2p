import { Card } from '@/components/ui/card'
import React from 'react'
import { SppIndikatorChart } from '../SppIndikatorChart/SppIndikatorChart'
import { CollapsibleCard } from '../CollapsibleCard/CollapsibleCard'
import { SppDetailIndikatorAdmin } from '../SppDetailIndikatorAdmin'

type SppDetailIndikatorProps = {
    data: any,
    kode_kabkot: string
}

export const SppDetailIndikator: React.FC<SppDetailIndikatorProps> = ({ data, kode_kabkot}) => {
    
    return (
        <div className="p-3 mt-2 border rounded bg-gray-100 flex gap-2 flex-col w-full">
            <CollapsibleCard title='Grafik Rekapitulasi Capaian RP2P'>
                <SppIndikatorChart data={data}/>
            </CollapsibleCard>
            <SppDetailIndikatorAdmin data={data} kode_kabkot={kode_kabkot}/>
        </div>
    )
}
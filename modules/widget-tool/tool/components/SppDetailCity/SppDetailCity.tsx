import React, { useState } from 'react'
import { useSppCityDetail } from '../../hooks/useSppData/useSppData'
import { Card, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { TableDetailIndikator } from '../TableDetailIndikator'
import { Button } from '@/components/ui/button'
import { SppDetailIndikator } from '../SppDetailIndikator'

type SppDetailCityProps = {
    kabkot_id: string
}

export const SppDetailCity: React.FC<SppDetailCityProps> = ({ kabkot_id }) => {
    const sppCityDetail = useSppCityDetail(kabkot_id, true)

    // State to track which indikator_id is expanded
    const [openStatus, setOpenStatus] = useState<{ [key: string]: boolean }>({})
    const [openDetail, setOpenDetail] = useState<{ [key: string]: boolean }>({})

    // Toggle collapsible
    const toggleCollapsible = (indikator_id: string) => {
        setOpenStatus(prev => ({
            ...prev,
            [indikator_id]: !prev[indikator_id]
        }))
    }
    
    // Toggle details visibility
    const handleOnClickDetail = (indikator_id: string) => {
        setOpenDetail(prev => ({
            ...prev,
            [indikator_id]: !prev[indikator_id]
        }))
    }

    return sppCityDetail.data && kabkot_id && (
        <div className='w-full flex flex-col gap-2 bg-transparent'>
            {sppCityDetail.data?.data.map((dt: any, index: number) => {
                const isOpen = openStatus[dt.indikator_id] || false
                const isDetailOpen = openDetail[dt.indikator_id] || false

                return (
                    <Card key={dt.indikator_id} className={index === sppCityDetail.data?.data.length - 1 ? 'mb-2' : ''}>
                        <Collapsible open={isOpen} className='w-full'>
                            <CollapsibleTrigger 
                                className={`w-full ${openStatus[dt.indikator_id] && 'border-b-2'}`}
                                onClick={() => toggleCollapsible(dt.indikator_id)}
                            >
                                <div className='flex w-full flex-row justify-between items-center p-0'>
                                    <CardTitle className='flex text-sm w-full p-3 items-start justify-start text-start'>
                                        {index + 1}. {dt.indikator}
                                    </CardTitle>
                                    <div className='flex flex-row items-center justify-end gap-2 h-full'>
                                        <Card 
                                            className={`p-3 flex flex-row items-center gap-2 justify-between rounded-bl-none rounded-tl-none min-w-[300px] h-full ${openStatus[dt.indikator_id] && 'rounded-br-none'}`} 
                                            style={{ backgroundColor: dt.color }}
                                        >
                                            <div className='w-full flex items-center justify-center rounded h-full gap-2'>
                                                <p className='text-xs font-bold text-primary flex w-2/6 text-center p-2 bg-white rounded justify-center items-center'>
                                                    {dt.capaian.toFixed()} %
                                                </p>
                                                <p className='text-xs font-bold text-primary text-center w-4/6 p-2 bg-white rounded'>{dt.kelas_capaian}</p>
                                            </div>
                                            <div className='rounded p-2 shadow-lg border text-white' style={{ backgroundColor: dt.color }}>
                                                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className='p-3'>
                                <div className='overflow-x-auto custom-scrollbar'>

                                    <TableDetailIndikator data={dt} onClickDetail={handleOnClickDetail}/>
                                </div>
                                {isDetailOpen && (
                                    <SppDetailIndikator data={dt.grafik_source} kode_kabkot={kabkot_id}/>
                                )}
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                )
            })}
        </div>
    )
}

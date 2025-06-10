import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog"
import { Pencil, X } from "lucide-react";
import { useSppDetailPOI } from "../../hooks/useSppData/useSppData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payloadSppDetailPOI } from "@/app/api/spp/spp_detail_poi/[poi_id]/route";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SharedDropdownSelect } from "@/shared/components/SharedDropdownSelect";
import { format } from "date-fns";

interface SppDetailPOIProps extends Dialog.DialogProps {
    poiId?: string;
    onClose: () => void;
}

export const SppDetailPOI = (props: SppDetailPOIProps) => {
    const { data, refetch } = useSppDetailPOI(props.poiId)
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationKey: ['useUpdateSppDetailPOI'],
        mutationFn: async (payload: payloadSppDetailPOI) => {
            const url = `api/spp/spp_detail_poi/${payload?.id}`;
            const response = await fetch(url, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        onSuccess: () => {
            refetch()
        }
    })

    const [isEdit, setIsEdit] = useState(false);
    const [inputValue, setInputValue] = useState<Omit<payloadSppDetailPOI, 'id'>>({})

    useEffect(() => {
        setIsEdit(false)
        setInputValue({
            ...inputValue,
            poi_name: data?.data?.poi_name,
            source: data?.data?.source,
            lokasi: data?.data?.lokasi || undefined,
            kapasitas: data?.data?.kapasitas || undefined,
            pemilik: data?.data?.pemilik || undefined,
            kondisi: data?.data?.kondisi || undefined,
            nama_pengelola: data?.data?.nama_pengelola || undefined,
            okupansi: data?.data?.okupansi || undefined,
            kualitas: data?.data?.kualitas || undefined,
            emisi_karbon: data?.data?.emisi_karbon || undefined,
            nilai_aset: data?.data?.nilai_aset as unknown as number || undefined,
            tipe_penanganan: data?.data?.tipe_penanganan || undefined,
            biaya_penanganan: data?.data?.biaya_penanganan as unknown as number || undefined,
            tanggal_pembaharuan_data: data?.data?.tanggal_pembaharuan_data ? format(data?.data?.tanggal_pembaharuan_data as unknown as string, "yyyy-MM-dd'T'HH:mm") : undefined,
        })
    }, [data])

    return (
        <Dialog.Root {...props} open={!!props.poiId}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={props.onClose}
                />
                <Dialog.Content className="flex flex-col gap-2 fixed left-1/2 top-1/2 z-[999]  max-w-[95%] translate-x-[-50%] translate-y-[-50%] bg-white rounded shadow-xl p-2 transition-transform duration-300">
                    <div className="flex justify-between items-center border-b p-4 mb-4 w-full">
                        <h2 className="text-2xl font-semibold text-primary">Detail Informasi Fasilitas</h2>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => setIsEdit(!isEdit)} className={`${isEdit ? 'bg-primary text-white hover:bg-secondary hover:text-primary' : 'bg-white text-primary'}`}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={props.onClose}>
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col w-full h-[70vh]  bg-white overflow-y-auto custom-scrollbar px-4 pt-0 pb-4">
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Nama Fasilitas</div>
                            {!isEdit && <div>{data?.data?.poi_name || '-'}</div>}
                            {isEdit && (
                                <Input
                                    value={inputValue.poi_name || data?.data?.poi_name}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            poi_name: x.target.value,
                                        })
                                    }}
                                    placeholder="Nama Fasilitas"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Sumber</div>
                            {!isEdit && (<div>{data?.data?.source || '-'}</div>)}
                            {isEdit && (
                                <Input
                                    value={inputValue.source || data?.data?.source}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            source: x.target.value,
                                        })
                                    }}
                                    placeholder="Sumber"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Lokasi</div>
                            {!isEdit && (<div>{data?.data?.lokasi || '-'}</div>)}
                            {isEdit && (
                                <Input
                                    value={inputValue.lokasi || data?.data?.lokasi as string}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            lokasi: x.target.value,
                                        })
                                    }}
                                    placeholder="Lokasi"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Kapasitas</div>
                            {!isEdit && (<div>{data?.data?.kapasitas ?? '-'}</div>)}
                            {isEdit && (
                                <Input
                                    value={inputValue.kapasitas}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            kapasitas: +x.target.value,
                                        })
                                    }}
                                    placeholder="Kapasitas"
                                    type="number"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Pemilik</div>
                            {!isEdit && (<div className="capitalize">{data?.data?.pemilik || '-'}</div>)}
                            {isEdit && (
                                <SharedDropdownSelect
                                    value={inputValue.pemilik || ''}
                                    onValueChange={(v) => {
                                        setInputValue({
                                            ...inputValue,
                                            pemilik: v,
                                        })
                                    }}
                                    options={[
                                        { label: 'Swasta', value: 'swasta' },
                                        { label: 'Pemerintah', value: 'pemerintah' },
                                    ]}
                                    placeholder='Swasta/Pemerintah'
                                    className="w-full"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Kondisi</div>
                            {!isEdit && (<div className="capitalize">{data?.data?.kondisi || '-'}</div>)}
                            {isEdit && (
                                <SharedDropdownSelect
                                    value={inputValue.kondisi || ''}
                                    onValueChange={(v) => {
                                        setInputValue({
                                            ...inputValue,
                                            kondisi: v,
                                        })
                                    }}
                                    options={[
                                        { label: 'Layak', value: 'layak' },
                                        { label: 'Tidak Layak', value: 'tidak layak' },
                                    ]}
                                    placeholder='Layak/Tidak Layak'
                                    className="w-full"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Nama Pengelola</div>
                            {!isEdit && (<div>{data?.data?.nama_pengelola || '-'}</div>)}
                            {isEdit && (
                                <Input
                                    value={inputValue.nama_pengelola}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            nama_pengelola: x.target.value,
                                        })
                                    }}
                                    placeholder="Nama Pengelola"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Okupansi</div>
                            {!isEdit && (<div>{data?.data?.okupansi ?? '-'}</div>)}
                            {isEdit && (
                                <Input
                                    value={inputValue.okupansi}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            okupansi: +x.target.value,
                                        })
                                    }}
                                    placeholder="Okupansi"
                                    type="number"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Kualitas Pengelola</div>
                            {!isEdit && (<div className="capitalize">{data?.data?.kualitas || '-'}</div>)}
                            {isEdit && (
                                <SharedDropdownSelect
                                    value={inputValue.kualitas || ''}
                                    onValueChange={(v) => {
                                        setInputValue({
                                            ...inputValue,
                                            kualitas: v,
                                        })
                                    }}
                                    options={[
                                        { label: 'Baik', value: 'baik' },
                                        { label: 'Tidak', value: 'tidak' },
                                    ]}
                                    placeholder='Baik/Tidak'
                                    className="w-full"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Emisi Karbon (GtonCo2 eq.)</div>
                            {!isEdit && (
                                <div>{data?.data?.emisi_karbon ? Number(data?.data?.emisi_karbon)+ ' GtonCo2 equivalent' : '-'}</div>
                            )}
                            {isEdit && (
                                <Input
                                    value={inputValue.emisi_karbon}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            emisi_karbon: +x.target.value,
                                        })
                                    }}
                                    placeholder="Emisi Karbon"
                                    type="number"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Nilai Aset</div>
                            {!isEdit && (
                                <div>{data?.data?.nilai_aset ? 'Rp. ' + Number(data?.data?.nilai_aset)?.toLocaleString('id-ID') : '-'}</div>
                            )}
                            {isEdit && (
                                <Input
                                    value={inputValue.nilai_aset}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            nilai_aset: +x.target.value,
                                        })
                                    }}
                                    placeholder="Nilai Aset"
                                    type="number"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Tipe Penanganan</div>
                            {!isEdit && (<div className="capitalize">{data?.data?.tipe_penanganan || '-'}</div>)}
                            {isEdit && (
                                <SharedDropdownSelect
                                    value={inputValue.tipe_penanganan || ''}
                                    onValueChange={(v) => {
                                        setInputValue({
                                            ...inputValue,
                                            tipe_penanganan: v,
                                        })
                                    }}
                                    options={[
                                        { label: 'Pemeliharaan Rutin', value: 'pemeliharaan rutin' },
                                        { label: 'Perbaikan', value: 'perbaikan' },
                                        { label: 'Upgrade', value: 'upgrade' },
                                    ]}
                                    placeholder='Pemeliharaan Rutin/Perbaikan/Upgrage'
                                    className="w-full"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Biaya Penanganan</div>
                            {!isEdit && (
                                <div>{data?.data?.biaya_penanganan ? 'Rp. ' + Number(data?.data?.biaya_penanganan)?.toLocaleString('id-ID') : '-'}</div>
                            )}
                            {isEdit && (
                                <Input
                                    value={inputValue.biaya_penanganan}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            biaya_penanganan: +x.target.value,
                                        })
                                    }}
                                    placeholder="Biaya Penanganan"
                                    type="number"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                            <div className="font-semibold">Tanggal Pembaharuan Data</div>
                            {!isEdit && (<div>{data?.data?.tanggal_pembaharuan_data ? format(data?.data?.tanggal_pembaharuan_data as unknown as string, 'HH:mm, dd MMMM yyyy') : '-'}</div>)}
                            {isEdit && (
                                <Input
                                    value={inputValue.tanggal_pembaharuan_data as string}
                                    onChange={(x) => {
                                        setInputValue({
                                            ...inputValue,
                                            tanggal_pembaharuan_data: x.target.value,
                                        })
                                    }}
                                    placeholder="Okupansi"
                                    type="datetime-local"
                                />
                            )}
                        </div>
                    </div>
                    <div className={`flex justify-end items-center ${isEdit && 'border-t py-4 px-6'}`}>
                        {isEdit && (
                            <div className="flex flex-row gap-2">
                                <Button className="text-primary bg-secondary rounded hover:bg-primary hover:text-white flex items-center gap-2"
                                    size='sm'
                                    variant="ghost" 
                                    onClick={props.onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className="text-primary bg-secondary rounded hover:bg-primary hover:text-white flex items-center gap-2"
                                    size='sm'
                                    disabled={mutation.isPending}
                                    onClick={() => {
                                        mutation.mutate({
                                            id: data?.data?.id as unknown as string,
                                            ...inputValue,
                                        })
                                    }}
                                >
                                    Simpan
                                </Button>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

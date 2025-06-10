"use client";

import { useState, useEffect } from "react";
import { useAdminLevelOptions, useCreateSettingsLog, useCreateSppIndikator, useUpdateSppIndikator } from "../../hooks/useSppIndikators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const LoadingComponent = () => (
    <div className="absolute top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-40 rounded">
        <Loader2 className="w-12 h-12 animate-spin text-secondary" />
    </div>
);

export const SppIndikatorForm = ({ closeModal, indikator }: { closeModal: () => void; indikator?: any }) => {
    const isEditing = Boolean(indikator);

    const [formData, setFormData] = useState({
        indikator: "",
        kategori: "",
        id_kategori: "",
        sub_kategori: "",
        id_sub_kategori: "",
        unit: "",
        ambang_batas: "",
        admin_level_id: "",
        admin_level: "",
        attribute_penduduk: "",
        weight: 0,
    });

    const [kategoriOptions, setKategoriOptions] = useState<any>([]);
    const [subKategoriOptions, setSubKategoriOptions] = useState<any>([]);
    const [adminLevelOptions, setAdminLevelOptions] = useState<any>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [isLoadingUserData, setIsLoadingUserData] = useState(isEditing); // Only load user data if editing
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Confirmation dialog state



    // Fetch dropdown options with 1-second delay before removing the loader
    useEffect(() => {
        async function fetchOptions() {
            try {
                const [kategoriRes, subKategoriRes, adminLevelRes] = await Promise.all([
                    fetch("/api/settings/spp-indikator/kategori"),
                    fetch("/api/settings/spp-indikator/sub-kategori"),
                    fetch("/api/settings/spp-indikator/admin-level"),
                ]);

                if (!kategoriRes.ok || !subKategoriRes.ok || !adminLevelRes.ok) throw new Error("Failed to fetch data");

                const [kategoriData, subKategoriData, adminLevelData] = await Promise.all([
                    kategoriRes.json(),
                    subKategoriRes.json(),
                    adminLevelRes.json(),
                ]);

                setKategoriOptions(kategoriData);
                setSubKategoriOptions(subKategoriData);
                setAdminLevelOptions(adminLevelData);

                // Delay hiding the loader by 1 second
                setTimeout(() => {
                    setIsLoadingOptions(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
                setIsLoadingOptions(false);
            }
        }

        fetchOptions();
    }, []);

    useEffect(() => {
        if (indikator && !isLoadingOptions && isEditing) {
            setFormData({
                indikator: indikator.indikator || "",
                kategori: indikator.kategori || "",
                id_kategori: indikator.id_kategori || "",
                sub_kategori: indikator.sub_kategori || "",
                id_sub_kategori: indikator.id_sub_kategori || "",
                unit: indikator.unit || "",
                ambang_batas: indikator.ambang_batas.toString() || "",
                admin_level_id: indikator.admin_level_id || "",
                admin_level: indikator.admin_level || "",
                attribute_penduduk: indikator.attribute_penduduk || "",
                weight: indikator.weight || 0,
            });
            // Add a slight delay before setting user data as loaded
            setTimeout(() => {
                setIsLoadingUserData(false);
            }, 100);
        }
    }, [indikator, isLoadingOptions, isEditing]);

    const createIndikator = useCreateSppIndikator();
    const updateIndikator = useUpdateSppIndikator();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handleSelectChange = (name: string, value: string) => {

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "kategori" && { id_kategori: kategoriOptions?.find((opt: any) => opt.kategori === value)?.id_kategori || "" }),
            ...(name === "sub_kategori" && { id_sub_kategori: subKategoriOptions?.find((opt: any) => opt.sub_kategori === value)?.id_sub_kategori || "" }),
            ...(name === "admin_level" && { admin_level_id: adminLevelOptions?.find((opt: any) => opt.admin_level === value)?.admin_level_id || "" }),
        }));
    };

    const createSettingsLog = useCreateSettingsLog();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            setShowConfirmDialog(true);
        } else {
            await createIndikator.mutateAsync({
                ...formData,
                ambang_batas: Number(formData.ambang_batas),
                weight: Number(formData.weight),
            });

            // Log the update action
            await createSettingsLog.mutateAsync({
                table_name: "spp_indikator", // Change this based on the actual table
                operation: `update`,
            });
            closeModal();
        }
    };

    const handleConfirmUpdate = async () => {
        setShowConfirmDialog(false);
        await updateIndikator.mutateAsync({ ...indikator, ...formData, ambang_batas: Number(formData.ambang_batas) });
        closeModal();
    };

    return (
        <div className="relative max-h-[80vh] overflow-y-auto p-6">
            {(isLoadingUserData) && <LoadingComponent />}
            <div className="flex flex-col rounded shadow border">
                <div className="p-6 pb-0 text-2xl font-semibold text-gray-700">
                    {isEditing ? "Edit SPP Indikator" : "Create SPP Indikator"}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6">
                    <div className="flex flex-col gap-2">
                        <Label>Indikator</Label>
                        <Input name="indikator" value={formData.indikator} onChange={handleChange} placeholder="Indikator" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Admin Level</Label>
                        <Select onValueChange={(value) => handleSelectChange("admin_level", value)} value={formData.admin_level}>
                            <SelectTrigger className="text-gray-600">
                                <SelectValue placeholder="Pilih Admin Level">
                                    {adminLevelOptions.find((r: any) => r.admin_level_id.toString() === formData.admin_level_id)?.admin_level || "Pilih Admin Level"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {adminLevelOptions.map((r: any) => (
                                    <SelectItem key={r.admin_level_id} value={r.admin_level.toString()}>
                                        {r.admin_level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Kategori</Label>
                        <Select onValueChange={(value) => handleSelectChange("kategori", value)} value={formData.kategori}>
                            <SelectTrigger className="text-gray-600">
                                <SelectValue placeholder="Pilih Kategori">
                                    {kategoriOptions.find((r: any) => r.id_kategori.toString() === formData.id_kategori)?.kategori || "Pilih Kategori"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {kategoriOptions.map((r: any) => (
                                    <SelectItem key={r.id_kategori} value={r.kategori.toString()}>
                                        {r.kategori}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Sub Kategori</Label>
                        <Select onValueChange={(value) => handleSelectChange("sub_kategori", value)} value={formData.sub_kategori}>
                            <SelectTrigger className="text-gray-600">
                                <SelectValue placeholder="Pilih Sub Kategori">
                                    {subKategoriOptions.find((r: any) => r.id_sub_kategori.toString() === formData.id_sub_kategori)?.sub_kategori || "Pilih Sub Kategori"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {subKategoriOptions.map((r: any) => (
                                    <SelectItem key={r.id_sub_kategori} value={r.sub_kategori.toString()}>
                                        {r.sub_kategori}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="flex flex-col gap-2">
                        <Label>Unit</Label>
                        <Input name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Ambang Batas</Label>
                        <Input type="number" name="ambang_batas" value={formData.ambang_batas} onChange={handleChange} placeholder="Ambang Batas" required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Parameter Penduduk Tertentu</Label>
                        <Input name="attribute_penduduk" value={formData.attribute_penduduk} onChange={handleChange} placeholder="Parameter Penduduk" disabled />
                    </div>

                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                            {isEditing ? "Update" : "Create"} Indikator
                        </Button>
                    </div>
                </form>
            </div>
            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Update</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to update this indikator?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                        <Button onClick={handleConfirmUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

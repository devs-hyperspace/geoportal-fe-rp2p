import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useClassifications, useCreateClassification, useCreateSettingsLog, useDeleteClassification, useSppCalculation, useSppConfigStatus, useUpdateClassification } from "../../hooks/useSppIndikators";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";


const LoadingComponent = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40 rounded-lg min-h-[10vh]">
        <Loader2 className="w-12 h-12 animate-spin text-secondary" />
    </div>
);


export const SppConfigStatus = () => {
    const { data: status, isLoading, error } = useSppConfigStatus();
    const [isCalculating, setIsCalculating] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Dialog state
    const calculateMutation = useSppCalculation();


    const { toast } = useToast();

    const handleCalculate = () => {
        setShowConfirmDialog(true); // Show dialog on button click
    };

    
    const createSettingsLog = useCreateSettingsLog();

    const confirmCalculate = () => {
        setShowConfirmDialog(false);
        setIsCalculating(true);
        calculateMutation.mutate(undefined, {
            onSuccess: () => {
                toast({
                    variant: "success",
                    className: "bg-green-500 text-white",
                    title: "Success",
                    description: "SPP index calculation triggered successfully",
                });
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to trigger SPP index calculation",
                });
            },
            onSettled: () => {
                setIsCalculating(false);
            },
        });

         // Log the update action
        createSettingsLog.mutate({
            table_name: "-",
            operation: "calculation",
        });

    };

    return (
        <>
            <Card className="relative p-6 rounded-lg bg-white w-full border-none shadow-none">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-primary">Status SPP Indikator</h2>
                </div>
                <CardContent className="p-4 bg-white rounded-lg shadow border min-h-[10vh]">
                    {isLoading ? (
                        <LoadingComponent />
                    ) : error ? (
                        <p className="text-red-500">Failed to load data.</p>
                    ) : status ? (
                        <div className="flex items-center justify-between">
                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="grid grid-cols-2 flex flex-row gap-2 items-center">
                                    <p className="text-sm text-gray-600">
                                        <strong>Pembaharuan Konfigurasi SPP</strong>
                                    </p>
                                    <p>
                                        {formatTimestamp(status.settings_last_updated)}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 flex flex-row gap-2 items-center">
                                    <p className="text-sm text-gray-600">
                                        <strong>Pembaharuan Kalkulasi SPP</strong>
                                    </p>
                                    <p>
                                        {formatTimestamp(status.calculation_last_updated)}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 flex flex-row gap-2 items-center">
                                    <p className="text-sm text-gray-600">
                                        <strong>Status</strong>
                                    </p>
                                    <div className={`w-full flex flex-row gap-2 items-center ${status.status === "Up to date" ? "text-green-500" : "text-red-500"}`}>
                                        {isCalculating ? <div className={`flex flex-row p-1 px-2  text-white rounded ${status.status === "Up to date" ? "bg-green-500" : "bg-red-500"}`}>
                                            <Loader2 className="w-5 h-5 animate-spin p-1" />
                                        </div> : <div className={`flex flex-row p-1 px-2  text-white rounded ${status.status === "Up to date" ? "bg-green-500" : "bg-red-500"}`}>
                                            {status.status === "Up to date" ? <Check className="p-1" /> : <X className="p-1" />}
                                            <p>
                                                {status.status}
                                            </p>
                                        </div>}
                                        <div className="text-black text-sm">
                                            {status.status === "Outdated" && "(Diperlukan proses kalkulasi)"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="px-6 py-2 text-primary bg-secondary hover:bg-primary hover:text-white flex items-center gap-2 shadow-md"
                                onClick={handleCalculate}
                                disabled={isCalculating || status.status === "Up to date"}
                            >
                                {isCalculating ? (
                                    <p className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Rekalkulasi SPP
                                    </p>
                                ) : (
                                    <p>
                                        Kalkulasi SPP
                                    </p>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No status data available.</p>
                    )}
                </CardContent>
            </Card>
            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Kalkulasi</DialogTitle>
                    </DialogHeader>
                    <p>Apakah Anda yakin ingin memulai proses kalkulasi SPP? Proses ini akan menggantikan serluruh hasil analisis SPP.</p>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => setShowConfirmDialog(false)}>
                            Batal
                        </Button>
                        <Button variant="secondary" className={"hover:bg-primary hover:text-white"} onClick={confirmCalculate}>
                            Ya, Kalkulasi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Toaster />
        </>
    );
};


function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);

    const time = date.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();

    return `${time}, ${day} ${month} ${year}`;
}
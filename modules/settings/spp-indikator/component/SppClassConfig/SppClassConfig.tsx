import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { useClassifications, useCreateClassification, useCreateSettingsLog, useDeleteClassification, useUpdateClassification } from "../../hooks/useSppIndikators";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";


const LoadingComponent = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40 rounded-lg">
        <Loader2 className="w-12 h-12 animate-spin text-secondary" />
    </div>
);


interface Classification {
    id: number;
    kelas: string;
    min: number;
    max: number;
    color: string;
}

const validateClassifications = (klasifikasi: Classification[]) => {
    let errors: string[] = [];

    if (klasifikasi.length > 0) {
        if (klasifikasi[0].min !== 0) errors.push("The first class must start at 0%.");
        if (klasifikasi[klasifikasi.length - 1].max !== 100) errors.push("The last class must end at 100%.");

        for (let i = 0; i < klasifikasi.length - 1; i++) {
            if (klasifikasi[i + 1].min < klasifikasi[i].min) {
                errors.push("A class's min value cannot be lower than the previous class's min value.");
            }
            if (klasifikasi[i + 1].min !== klasifikasi[i].max) {
                errors.push(`Gap detected: Class "${klasifikasi[i].kelas}" (max: ${klasifikasi[i].max}%) does not align with Class "${klasifikasi[i + 1].kelas}" (min: ${klasifikasi[i + 1].min}%).`);
            }
        }
    }

    return errors;
};


export const SppClassConfig = () => {

    const { data: classifications = [], refetch, isLoading } = useClassifications();
    const [klasifikasi, setKlasifikasi] = useState<Classification[]>([])

    const createClassification = useCreateClassification();
    const updateClassification = useUpdateClassification();
    const deleteClassification = useDeleteClassification();

    const [errors, setErrors] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Confirmation dialog state

    useEffect(() => {
        if (classifications.length > 0) {
            setKlasifikasi(
                classifications.map((cls, index) => ({
                    ...cls,
                    min: index === 0 ? 0 : classifications[index - 1].max, // Ensure first class min is 0
                }))
            );
        }
    }, [classifications]);


    const addClass = () => {
        if (klasifikasi.length >= 5 && !isEditing) return;

        const lastClass = klasifikasi[klasifikasi.length - 1];
        const newMin = lastClass ? lastClass.max : 0;
        const newClass = {
            id: klasifikasi.length + 1,
            kelas: `Class ${klasifikasi.length + 1}`,
            min: newMin,
            max: 100,
            color: "#000"
        };

        setKlasifikasi([...klasifikasi, newClass]);

        // Call API to create classification
        createClassification.mutate(newClass, {
            onSuccess: () => {
                refetch(); // Refetch data after successful creation
            },
        });
    };


    const handleSliderChange = (id: any, newRange: any) => {
        setKlasifikasi((prev) => {
            return prev.map((c, index) => {
                if (c.id === id) {
                    return { ...c, min: index === 0 ? 0 : prev[index - 1].max, max: newRange[1] };
                }
                if (index > 0 && prev[index - 1].id === id) {
                    return { ...c, min: newRange[1] };
                }
                if (index < prev.length - 1 && prev[index + 1].id === id) {
                    return { ...c, max: newRange[0] };
                }
                return c;
            });
        });
    };


    const deleteClass = (id: number) => {
        setKlasifikasi((prev) => {
            const updated = prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, id: i + 1 }));

            // Ensure last item's max value is always 100
            if (updated.length > 0) {
                updated[updated.length - 1].max = 100;
            }

            return updated;
        });
        deleteClassification.mutate(id);
    };





    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            const validationErrors = validateClassifications(klasifikasi);
            setErrors(validationErrors);
            if (validationErrors.length === 0) {
                setShowConfirmDialog(true);
            }
        }
    };

    const createSettingsLog = useCreateSettingsLog();


    const handleConfirmUpdate = async () => {
        setShowConfirmDialog(false);
        setIsSubmitting(true);

        try {
            await Promise.all(
                klasifikasi.map(async (kelas) => {
                    const fullIndikator = klasifikasi.find((ind: any) => ind.id === kelas.id);
                    if (!fullIndikator) return;
                    await updateClassification.mutateAsync({ ...fullIndikator });
                })
            );

            // Log the update action
            createSettingsLog.mutate({
                table_name: "spp_klasifikasi",
                operation: "update",
            });

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update indikator:", error);
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <Card className="relative w-full shadow-none border-none rounded-lg">
                {isLoading && <LoadingComponent />}
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-primary">Pengaturan Klasifikasi SPP</CardTitle>
                    <div className="flex gap-2">
                        {isEditing && (
                            <Button
                                className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 font-bold shadow"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Update
                            </Button>
                        )}
                        {isEditing && <Button onClick={addClass} className="bg-blue-600 text-white hover:bg-blue-700" disabled={klasifikasi.length >= 5 && !isEditing}>
                            + Add Class
                        </Button>}
                        <Button
                            className="flex items-center gap-2 bg-secondary text-primary hover:bg-primary hover:text-white font-bold shadow"
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isSubmitting}
                        >
                            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                            {isEditing ? "Cancel" : "Edit"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex flex-col p-6 gap-2 rounded-lg shadow-md border">
                        <div className="flex flex-row gap-4 items-center">
                            <div className="w-4/12 font-bold">Kelasifikasi</div>
                            <div className="w-6/12"></div>
                            <div className="w-1/12 text-center font-bold">Interval</div>
                            <div className="w-1/12 text-center font-bold">Warna</div>
                            <div className="w-1/12 text-center"></div>
                        </div>
                        {klasifikasi.map((cls, index) => (
                            <div key={cls.id} className="w-full flex items-center gap-4">
                                <Input
                                    value={cls.kelas}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        setKlasifikasi((prev) =>
                                            prev.map((c) => (c.id === cls.id ? { ...c, kelas: newName } : c))
                                        );
                                    }}
                                    className="w-4/12"
                                    disabled={!isEditing}
                                />
                                <Slider
                                    value={[cls.min, index === klasifikasi.length - 1 ? 100 : cls.max]}
                                    onValueChange={(val) => handleSliderChange(cls.id, val)}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="w-6/12"
                                    disabled={!isEditing}
                                />
                                <span className="w-1/12 text-center">{cls.min} - {cls.max}%</span>
                                <div className={`w-1/12 flex items-center justify-center ${!isEditing ? "pointer-events-none opacity-50" : ""}`}>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                className="w-10 h-10 rounded-lg border shadow"
                                                style={{ backgroundColor: cls.color }}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-2 bg-white shadow-lg rounded-md">
                                            <HexColorPicker
                                                color={cls.color}
                                                onChange={(newColor) => {
                                                    setKlasifikasi((prev) =>
                                                        prev.map((c) => (c.id === cls.id ? { ...c, color: newColor } : c))
                                                    );
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {klasifikasi.length > 2 && (
                                    <div className="w-1/12 items-center justify-center flex gap-2">
                                        <Button
                                            variant="destructive"
                                            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-md"
                                            onClick={() => deleteClass(cls.id)} disabled={!isEditing}>
                                            <Trash2 className="w-4 h-4 text-white" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {errors.length > 0 && (
                            <div className="bg-red-100 border border-red-400 p-4 rounded-lg">
                                <div>
                                    <div className="text-red-600">Validation Errors</div>
                                </div>
                                <div className="text-red-600 space-y-1">
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Update</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to update this configuration?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                        <Button onClick={handleConfirmUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

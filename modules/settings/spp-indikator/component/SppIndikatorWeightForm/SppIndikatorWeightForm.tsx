import { useState, useEffect, Fragment } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSppIndikators, useUpdateSppIndikator } from "../../hooks";
import { Progress } from "@/components/ui/progress";
import { AlignEndVertical, Loader2, Pencil, Check, X } from "lucide-react";
import { ResetIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SppIndikatorType, useCreateSettingsLog } from "../../hooks/useSppIndikators";


const LoadingComponent = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40 rounded-lg">
    <Loader2 className="w-12 h-12 animate-spin text-secondary" />
  </div>
);

export const SppIndikatorWeightForm = () => {
  const { data: indikators, isLoading } = useSppIndikators();
  const updateIndikator = useUpdateSppIndikator();

  const [indicators, setIndicators] = useState<SppIndikatorType[]>([]);
  const [totalWeight, setTotalWeight] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Confirmation dialog state



  useEffect(() => {
    if (indikators && indikators.length > 0) {
      const initialWeight = 100 / indikators.length;
      setIndicators(
        indikators.map((ind: any) => ({
          ...ind,
          id: ind.id,
          weight: ind.weight ?? initialWeight,
        }))
      );
      setTotalWeight(100);
    }
  }, [indikators]);

  const handleWeightChange = (id: number, value: number) => {
    if (!isEditing) return;
    const updatedIndicators = indicators.map((ind) =>
      ind.id === id ? { ...ind, weight: value } : ind
    );
    setIndicators(updatedIndicators);
    setTotalWeight(updatedIndicators.reduce((sum, ind) => sum + ind.weight, 0));
  };

  const normalizeWeights = () => {
    if (!isEditing) return;
    const total = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    setIndicators(indicators.map((ind) => ({ ...ind, weight: (ind.weight / total) * 100 })));
    setTotalWeight(100);
  };

  const resetWeights = () => {
    if (!isEditing || !indikators) return;
    const initialWeight = 100 / indikators.length;
    setIndicators(
      indikators.map((ind: any) => ({
        ...ind,
        id: ind.id,
        weight: initialWeight,
      }))
    );
    setTotalWeight(100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setShowConfirmDialog(true);
    }
  };

  const createSettingsLog = useCreateSettingsLog();

  const handleConfirmUpdate = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      await Promise.all(
        indicators.map(async (indicator) => {
          const fullIndikator = indicators.find((ind: any) => ind.id === indicator.id);
          if (!fullIndikator) return;
          await updateIndikator.mutateAsync({
            ...fullIndikator,  // Spread all existing properties
            weight: indicator.weight, // Update only the weight
          });
        })
      );
      setIsEditing(false);
      // Log the update action
      await createSettingsLog.mutateAsync({
        table_name: "spp_indikator", // Change this based on the actual table
        operation: `update`,
      });
    } catch (error) {
      console.error("Failed to update indikator:", error);
    }

    setIsSubmitting(false);
  };



  return indicators && (
    <Fragment>
      <Card className="w-full shadow-none border-none rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Pengaturan Pembobotan SPP Indikator</CardTitle>
          <div className="flex gap-2">
            {isEditing && indikators && (
              <Button
                className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 font-bold shadow"
                onClick={handleSubmit}
                disabled={totalWeight !== 100}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Update
              </Button>
            )}
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
          <div className="rounded-lg shadow-md flex-row w-full flex items-center p-4 gap-2 border">
            <div className="w-10/12 flex-row flex items-center">
              <p className="font-bold w-2/12 flex">Total Bobot: {totalWeight.toFixed(2)}%</p>
              <Progress
                value={totalWeight > 100 ? 100 : totalWeight}
                className="h-4 w-10/12 rounded-lg bg-gray-200 overflow-hidden"
                indicator={`${totalWeight === 100 ? "bg-green-500" : "bg-red-500"}`}
              />
            </div>
            <div className="flex flex-row gap-2 items-center p-2">
              <Button
                onClick={normalizeWeights}
                disabled={!isEditing || totalWeight === 100}
                className="w-full bg-secondary text-primary hover:bg-primary hover:text-white disabled:opacity-50 font-bold flex flex-row gap-2"
              >
                <AlignEndVertical /> Normalisasi
              </Button>
              <Button
                onClick={resetWeights}
                disabled={!isEditing}
                className="w-full bg-secondary text-primary hover:bg-primary hover:text-white disabled:opacity-50 font-bold flex flex-row gap-2"
              >
                <ResetIcon /> Reset
              </Button>
            </div>
          </div>

          <Card className="flex flex-col space-y-4 p-6 relative rounded-lg">
            {isLoading && <LoadingComponent />}
            {indicators.map((indicator, index) => (
              <div key={indicator.id} className="grid grid-cols-12 items-center gap-4 w-full">
                <span className="col-span-4 text-sm font-medium">
                  {index + 1}. {indicator.indikator}
                </span>
                <Slider
                  value={[indicator.weight]}
                  onValueChange={(val) => handleWeightChange(indicator.id, val[0])}
                  min={0}
                  max={100}
                  step={0.01}
                  className="col-span-6"
                  disabled={!isEditing}
                />
                <Input
                  type="number"
                  value={indicator.weight.toFixed(2)}
                  onChange={(e) => handleWeightChange(indicator.id, parseFloat(e.target.value) || 0)}
                  className="col-span-1 text-center"
                  disabled={!isEditing}
                />
                <div className="col-span-1 flex space-x-2">
                  <Button
                    className="w-full bg-secondary text-primary hover:bg-primary hover:text-white disabled:opacity-50 font-bold flex flex-row gap-2"
                    variant="outline"
                    size="sm"
                    onClick={() => handleWeightChange(indicator.id, Math.max(0, indicator.weight - 0.01))}
                    disabled={!isEditing}
                  >
                    -
                  </Button>
                  <Button
                    className="w-full bg-secondary text-primary hover:bg-primary hover:text-white disabled:opacity-50 font-bold flex flex-row gap-2"
                    variant="outline"
                    size="sm"
                    onClick={() => handleWeightChange(indicator.id, Math.min(100, indicator.weight + 0.01))}
                    disabled={!isEditing}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </CardContent>
      </Card>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to update this indikator weight?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

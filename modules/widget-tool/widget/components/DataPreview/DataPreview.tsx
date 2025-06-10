import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface DataPreviewProps {
    data: any;
    isLoading: boolean;
    gap?: number;
}


export const DataPreview: React.FC<DataPreviewProps> = ({ data, isLoading, gap = 0 }) => (
    <div>
        <div className={cn('flex flex-col', `mb-${gap}`)}>
            <p>Data Preview</p>
        </div>
        <Card className="w-full h-[54vh] overflow-y-auto p-2 custom-scrollbar">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader className="animate-spin" />
                </div>
            ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </Card>
    </div>
);

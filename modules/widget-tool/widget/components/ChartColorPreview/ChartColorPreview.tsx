import { cn } from "@/lib/utils";
import { ChartColorsType } from "../../utils/chartConfig";

interface ChartColorPreviewProps {
    colorName: ChartColorsType;
    colorProperties: React.CSSProperties;
    active: boolean;
    onClick?: (v: ChartColorsType) => void;
}

export const ChartColorPreview:React.FC<ChartColorPreviewProps> = (props) => {
    const { colorName, colorProperties, active, onClick } = props;

    return (
        <div
            key={colorName}
            className={cn(
                "p-1 cursor-pointer rounded-sm",
                active && 'bg-secondary '
            )}
            style={colorProperties}
            onClick={() => onClick?.(colorName)}
        >
            <div className="grid grid-cols-2 h-8 w-8">
                <div className="h-4 w-4 bg-[var(--chart-1)] rounded-tl-sm" />
                <div className="h-4 w-4 bg-[var(--chart-2)] rounded-tr-sm" />
                <div className="h-4 w-4 bg-[var(--chart-3)] rounded-bl-sm" />
                <div className="h-4 w-4 bg-[var(--chart-4)] rounded-br-sm" />
            </div>
        </div>
    );
};
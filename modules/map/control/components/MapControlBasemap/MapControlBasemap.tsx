import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";
import { LayersIcon } from "@radix-ui/react-icons";
import { Layers3 } from "lucide-react";
import Image from "next/image";

// Define the types for the props
interface Basemap {
    key: string;
    label: string;
    screenshot?: string;
}

interface MapControlBasemapProps {
    active: boolean;
    onClick: () => void;
    basemaps: Basemap[];
    activeBasemap: string;
    setBasemap: (key: string) => void;
    disabled: boolean;
}

export const MapControlBasemap: React.FC<MapControlBasemapProps> = (props) => {
    const {
        active,
        onClick,
        basemaps,
        activeBasemap,
        setBasemap,
        disabled,
    } = props;
    return (
        <div className="MapControlBasemap">
            <div className="flex items-center gap-2">
                {active && (
                    <div className="flex gap-1 items-center">
                        {basemaps.map((v) => (
                            <SharedComponentButtonTooltip
                                key={v.label}
                                tooltipProps={{
                                    side: 'bottom',
                                    children: v.label
                                }}
                                style={{
                                    width: 29,
                                    height: 29,
                                    padding: 0,
                                    background: v.key === activeBasemap ? '#0088EA' : '#fff'
                                }}
                                onClick={() => setBasemap(v.key)}
                            >
                                <Image className="rounded-sm" src={v.screenshot || ''} alt={v.label} width={22} height={22} />
                            </SharedComponentButtonTooltip>
                        ))}
                    </div>
                )}
                <SharedComponentButtonTooltip
                    tooltipProps={{
                        side: 'right',
                        children: 'Basemap'
                    }}
                    style={{
                        width: 29,
                        height: 29,
                        padding: 0,
                    }}
                    onClick={onClick}
                    disabled={disabled}
                >
                    <Layers3 width={18} height={18} color={active ? '#0088EA' : '#000'} />
                </SharedComponentButtonTooltip>
            </div>
        </div>
    );
};

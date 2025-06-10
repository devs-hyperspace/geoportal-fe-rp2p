// import { Button } from "@/components/ui/button";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import { SharedComponentDrawer } from "@/shared/components/SharedComponentDrawer"
// import { CirclePlus } from "lucide-react";

// interface MapControlLayersProps {
//     open: boolean;
//     style?: React.CSSProperties
//     addLayer?: () => void;
//     children?:React.ReactNode;
// }

// export const MapControlLayers:React.FC<MapControlLayersProps> = (props) => {
//     const { open, style, children, addLayer } = props;

//     return (
//         <SharedComponentDrawer open={open} style={style} direction="left">
//             <div className="absolute bg-white flex flex-col shadow-md text-primary" style={{ width: 310 }}>
//                 <div
//                     className={cn(
//                         'flex items-center justify-between',
//                         'h-[40px] px-4',
//                         'bg-[#F2F2F2] shadow-md'
//                     )}
//                 >
//                     <div>Layers</div>
//                     <TooltipProvider>
//                         <Tooltip delayDuration={0}>
//                             <TooltipTrigger asChild>
//                                 <Button variant='ghost' className="p-2" onClick={addLayer}>
//                                     <CirclePlus />
//                                 </Button>
//                             </TooltipTrigger>
//                             <TooltipContent className="flex items-center gap-4 h-6" side="left">
//                                 Add Layer
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>
//                 </div>
//                 <div style={{ height: 'calc(100% - 90px)' }} className="overflow-y-auto custom-scrollbar">
//                     {children}
//                 </div>
//             </div>
//         </SharedComponentDrawer>
//     )
// }

import Logo from "@/components/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SharedComponentDrawer } from "@/shared/components/SharedComponentDrawer"
import { ChevronsDownUpIcon, ChevronsUpDownIcon, CirclePlus, CopyCheckIcon, CopyXIcon, ExpandIcon, Folder, FolderArchive, FolderCheckIcon, FolderPlus, FolderPlusIcon, LayersIcon, Settings2Icon, SquareCheck } from "lucide-react";
import Image from "next/image";
import { useMapControl } from "../../hooks/useMapControl";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ButtonToggleSidebar } from "../ButtonToggleSidebar";


const CityPlanSVG = () => {
    return (

        <svg width="85" height="30" viewBox="0 0 51 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.38 15L3.66 8.8V15H0.24V0.96H3.66V7.12L8.34 0.96H12.36L6.92 7.84L12.56 15H8.38ZM17.6053 12.36H22.0853V15H14.1853V0.96H17.6053V12.36ZM35.8766 0.96V15H32.4566V9.22H27.1366V15H23.7166V0.96H27.1366V6.46H32.4566V0.96H35.8766ZM46.4855 15L41.7655 8.8V15H38.3455V0.96H41.7655V7.12L46.4455 0.96H50.4655L45.0255 7.84L50.6655 15H46.4855Z" fill="white" />
        </svg>
    )
}

interface MapControlLayersProps {
    open: boolean;
    style?: React.CSSProperties
    addLayer?: () => void;
    children?: React.ReactNode;
}

export const MapControlLayers: React.FC<MapControlLayersProps> = (props) => {
    const { open, style, children, addLayer } = props;

    const mapControl = useMapControl();

    return mapControl.tools.layerControl.active ? (
        <div className="flex flex-col text-primary" style={{ width: 350 }}>
            <div className="flex flex-col rounded-lg bg-white shadow">
                <div className="flex items-center justify-center rounded-lg flex-col">
                    <div className="flex items-center justify-center w-full gap-2 rounded-br-lg rounded-bl-lg flex-col h-full">
                        <div className="w-full rounded-lg">
                            <div className="flex flex-col">
                                <div
                                    className={cn(
                                        'flex items-center justify-between rounded-tl-lg rounded-tr-lg',
                                        'py-2 px-4',
                                        'bg-white shadow-md border-b'
                                    )}
                                >
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        <LayersIcon />
                                        <p className="font-bold text-md">Layers Control</p>
                                    </div>
                                    <div>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <Button variant='ghost' className="p-2" onClick={addLayer}>
                                                        <FolderPlusIcon />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="flex items-center gap-4 h-6" side="left">
                                                    Add Layer
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        onClick={() => {
                                                            mapControl.toolConfig({ key: 'layerControl', config: { active: !mapControl.tools.layerControl.active } })
                                                        }}
                                                        variant={'ghost'}
                                                        className="px-0 m-0 text-sm"
                                                    >
                                                        <ChevronsDownUpIcon size={'small'} className="text-xs" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="flex items-center gap-4 h-6" side="left">
                                                    Collapse Layers Control
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                <div className="overflow-y-auto custom-scrollbar max-h-[85vh] bg-slate-100 rounded-lg">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div
            className={cn(
                'flex items-center justify-between rounded-lg gap-2 text-primary',
                'py-2 px-4',
                'bg-white shadow-md'
            )}
        >
            <div className="flex flex-row gap-2">
                <LayersIcon />
            </div>
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() => {
                                mapControl.toolConfig({ key: 'layerControl', config: { active: !mapControl.tools.layerControl.active } })
                            }}
                            variant={'ghost'}
                            className="px-0 m-0 text-sm"
                        >
                            <ChevronsUpDownIcon size={'small'} className="text-xs" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="flex items-center gap-4 h-6" side="left">
                        Expand Layers Control
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
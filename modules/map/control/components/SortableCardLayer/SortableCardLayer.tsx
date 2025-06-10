import { Checkbox } from "@/components/ui/checkbox";
import { cn, toTitleCase } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronsDownUp, ChevronsUpDown, CircleMinus, Filter, Fullscreen, GripVerticalIcon, Info } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { LayerListItem } from "@/types";
import { TooltipContentProps } from "@radix-ui/react-tooltip";
import { useMapControl } from "../../hooks/useMapControl";
import { Card } from "@/components/ui/card";
import SkeletonWrapper from "@/components/SkeletonWrapper";


interface TooltipWrapperProps {
    children?: React.ReactNode;
    tooltipContentProps: TooltipContentProps;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = (props) => {
    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                {props.children}
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-4 h-6" {...props.tooltipContentProps} />
        </Tooltip>
    )
}

interface TriggerProps {
    open: boolean;
    active: boolean;
    name: string;
    id: string;
    attributes: any;
    listeners: any;
    onOpenChange: () => void;
    onCheck: (id: string) => void;
    onZoomToLayer: () => void;
    onDeleteLayer: () => void;
}

const Trigger: React.FC<TriggerProps> = (props) => {
    const {
        open,
        name,
        attributes,
        listeners,
        id,
        active,
        onOpenChange,
        onCheck,
        onZoomToLayer,
        onDeleteLayer,
    } = props

    return (
        <div className={`flex items-center justify-between p-1 w-full bg-white ${open ? 'rounded-tl-lg rounded-tr-lg border-b' : 'rounded-lg'}`} onClick={(e) => e.preventDefault()}>
            <div className="flex items-center gap-1">
                <div {...attributes} {...listeners} className='cursor-grab' >
                    <GripVerticalIcon />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id={`${id}-${name}`} defaultChecked={active} onCheckedChange={() => onCheck(id)} />
                    <Label
                        htmlFor={`${id}-${name}`}
                        className="text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {name}
                    </Label>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <TooltipWrapper tooltipContentProps={{ side: 'top', children: 'Zoom to Layer' }}>
                    <Button variant="ghost" size="sm" className="p-2" onClick={onZoomToLayer}>
                        <Fullscreen className="h-4 w-4" />
                        <span className="sr-only">Zoom to Layer</span>
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltipContentProps={{ side: 'top', children: 'Delete Layer' }}>
                    <Button variant="ghost" size="sm" className="p-2" onClick={onDeleteLayer}>
                        <CircleMinus className="h-4 w-4" />
                        <span className="sr-only">Delete Layer</span>
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltipContentProps={{ side: 'top', children: open ? 'Collapse' : 'Expand' }}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={onOpenChange}
                    >
                        {open ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </TooltipWrapper>
            </div>
        </div>
    )
}

interface ContentProps {
    opacity: number;
    onOpacityChange: (value: number) => void;
    imgUrl?: string;
    isOpen: boolean;
}

const Content: React.FC<ContentProps> = (props) => {
    const { onOpacityChange, opacity, imgUrl, isOpen } = props;
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => setIsLoading(false);

    useEffect(() => {
        return () => {
            setIsLoading(true);
        }
    }, [isOpen])

    return (
        <CollapsibleContent className="p-2 bg-white rounded-bl-lg rounded-br-lg" onClick={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-10 my-2 w-full">
                <div className="text-sm">Legend</div>
                <div className="flex items-center gap-1">
                    <Slider
                        defaultValue={[opacity]}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                        onValueChange={([value]) => onOpacityChange(value)}
                    />
                    <span className="text-xs">{opacity * 100}%</span>
                </div>
            </div>
            <div>
                <SkeletonWrapper isLoading={isLoading}>
                    <div className="w-full min-h-12">
                        <img
                            src={imgUrl}
                            alt="legend"
                            onLoad={handleImageLoad}
                            style={{ display: isLoading ? 'none' : 'block' }}
                        />
                    </div>
                </SkeletonWrapper>
            </div>
        </CollapsibleContent>
    );
}

interface SortableCardLayerProps {
    onCheck: (id: string) => void;
    layer: LayerListItem;
    onOpacityChange: (x: number) => void;
    onZoomToLayer: () => void;
    onDeleteLayer: () => void;
}

export const SortableCardLayer: React.FC<SortableCardLayerProps> = (props) => {
    const { layer, onCheck, onOpacityChange, onZoomToLayer, onDeleteLayer } = props;
    const [isOpen, setIsOpen] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: layer.id });

    const styles = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: '100%',
    };
    return (
        <div ref={setNodeRef} style={styles}>
            <Collapsible
                className="shadow-md rounded"
                open={isOpen}
            >
                <TooltipProvider>
                    <Trigger
                        open={isOpen}
                        active={layer.active}
                        onOpenChange={() => setIsOpen(!isOpen)}
                        name={toTitleCase(layer.name)}
                        listeners={listeners}
                        attributes={attributes}
                        id={layer.id}
                        onCheck={onCheck}
                        onZoomToLayer={onZoomToLayer}
                        onDeleteLayer={onDeleteLayer}
                    />
                    <Content
                        opacity={layer.opacity ?? 1}
                        onOpacityChange={(value) => {
                            onOpacityChange(value)
                        }}
                        imgUrl={layer.legend}
                        isOpen={isOpen}
                    />
                </TooltipProvider>
            </Collapsible>
        </div>
    )
}
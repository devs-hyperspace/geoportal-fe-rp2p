"use client";

import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CollapsibleCardProps = {
    children : ReactNode,
    title: string
}

export const CollapsibleCard:React.FC<CollapsibleCardProps> = ({children, title}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="w-full p-2">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="flex items-center w-full justify-between p-2">
                            <span className="text-md font-medium">{title}</span>
                            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 p-2">
                        {children}
                    </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};
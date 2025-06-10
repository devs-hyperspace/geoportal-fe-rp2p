import React from "react";

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { UserSettingsLayout } from "../../user/layout/UserSettingsLayout";
import { SppSettingsLayout } from "../../spp-indikator/layout/SppSettingsLayout";

export const SettingsLayout: React.FC<{ children?: React.ReactNode, session?: any }> = (props) => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment);

    return (
        <React.Fragment>
            <header className="fixed z-50 border-b bg-white w-full flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {pathSegments.map((segment, index) => {
                                const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                                const isLast = index === pathSegments.length - 1;

                                return (
                                    <React.Fragment key={href}>
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={href}>{decodeURIComponent(segment)}</BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!isLast && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <Separator />
            <div className="py-8">
                {pathSegments[pathSegments.length - 1] == 'user' && <UserSettingsLayout session={props.session}/>}
                {pathSegments[pathSegments.length - 1] == 'spp' && <SppSettingsLayout session={props.session}/>}
            </div>

        </React.Fragment>
    )
}
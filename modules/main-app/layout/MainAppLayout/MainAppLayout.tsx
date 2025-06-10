import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from "../../components/app-sidebar";
import { useUsersControl } from "../../hooks/useUsersControl";
import { useEffect } from "react";

export const MainAppLayout: React.FC<{ children?: React.ReactNode; session: any }> = (props) => {
    const { setUser } = useUsersControl();

    useEffect(() => {
        if (props.session?.user) {
            setUser({
                activeUsername: props.session.user.name?.toString() || '',
                activeGeonodeUid: props.session.user.geonodeUid?.toString() || '',
                activeGeonodeAccessToken: props.session.user.geonodeAccessToken || '',
                activeRoleId: props.session.user.roleId ?? null,
                activeKabkotId: props.session.user.kabkotId || '',
            });
        }
    }, []);

    return (
        <main className="MainAppLayout flex">
            <SidebarProvider defaultOpen={false}>
                <AppSidebar session={props.session} />
                <SidebarInset>
                    {/* <SidebarTrigger
                        className="absolute left-[-1.25rem] top-1/2 -translate-y-1/2 z-50 rounded bg-background hover:bg-muted transition
                        shadow-none 
                        before:absolute before:right-0 before:top-0 before:w-1/2 before:h-full 
                        before:border-r before:border-gray-300 before:shadow-lg before:shadow-gray-500/30 before:rounded-r"
                    /> */}
                    <div className='relative w-full h-full'>
                        {props.children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
};

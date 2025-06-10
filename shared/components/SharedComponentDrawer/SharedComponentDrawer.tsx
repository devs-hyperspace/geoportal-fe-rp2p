import { Drawer } from 'vaul';

interface SharedComponentDrawerProps {
    children?: React.ReactNode;
    open: boolean;
    style?: React.CSSProperties
    direction?: "right" | "top" | "left" | "bottom";
}

export const SharedComponentDrawer:React.FC<SharedComponentDrawerProps> = (props) => {
    const { open, children, style, direction } = props;
    return (
        <Drawer.Root direction={direction} modal={false} open={open}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-transparent" />
                <Drawer.Content
                    style={{
                        bottom: 0,
                        top: 0,
                        ...style,
                        animation: 'none'
                    }}
                    className="fixed z-10 flex outline-none"
                    data-vaul-no-drag
                >
                    <Drawer.Title />
                    <Drawer.Description />
                   {children}
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
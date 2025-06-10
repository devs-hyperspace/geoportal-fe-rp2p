import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip"
import { ChevronLeft, ChevronRight, LucidePanelRightClose, LucidePanelRightOpen, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightCloseIcon, PanelRightOpen, PanelRightOpenIcon } from "lucide-react"

interface ButtonToggleSidebarProps {
    isOpen: boolean;
    disabled: boolean;
    onClick: () => void;
    position: 'left' | 'right'
}

export const ButtonToggleSidebar:React.FC<ButtonToggleSidebarProps> = (props) => {
    const { disabled, isOpen, onClick, position } = props;

    const tooltipText = isOpen ? 'Close' : 'Open';

    const Icon = position === 'left' 
    ? isOpen ? PanelLeftClose : PanelLeftOpen 
    : isOpen ? LucidePanelRightClose : LucidePanelRightOpen;

    return (
        <SharedComponentButtonTooltip
            tooltipProps={{
                side: position === 'left' ? 'right' : 'left',
                children: tooltipText,
            }}
            style={{ width: 29, height: 29, padding: 0 }}
            disabled={disabled}
            onClick={onClick}
        >
            <Icon />
        </SharedComponentButtonTooltip>
    )
}
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip"
import { ChevronLeft, ChevronRight, TableProperties } from "lucide-react"

interface ButtonToggleAttributeLayersProps {
    isOpen: boolean;
    disabled: boolean;
    onClick: () => void;
    position: 'left' | 'right'
}

export const ButtonToggleAttributeLayers:React.FC<ButtonToggleAttributeLayersProps> = (props) => {
    const { disabled, isOpen, onClick, position } = props;

    const tooltipText = isOpen ? 'Close Attributes Table' : 'Open Attributes Table';

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
            <TableProperties />
        </SharedComponentButtonTooltip>
    )
}
import { SharedDropdownSelect } from "@/shared/components/SharedDropdownSelect";

interface AggSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
}

const options = [
    {label: 'Sum', value: 'sum'},
    {label: 'Count', value: 'count'},
    {label: 'Average', value: 'average'},
]

export const AggSelector: React.FC<AggSelectorProps> = ({ value, onValueChange, placeholder = 'Select Aggregate' }) => (
    <SharedDropdownSelect
        value={value}
        onValueChange={onValueChange}
        options={options}
        placeholder={placeholder}
    />
);
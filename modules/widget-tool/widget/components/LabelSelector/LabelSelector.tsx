import React from "react";
import { SharedDropdownSelect } from "@/shared/components/SharedDropdownSelect";

interface LabelSelectProps {
    listAttr: any[];
    selectedLabel: string | undefined;
    handleSelectLabel: (value: string) => void;
    placeholder: string;
    filter: string[];
}

export const LabelSelect: React.FC<LabelSelectProps> = ({
    listAttr,
    selectedLabel,
    handleSelectLabel,
    placeholder,
    filter,
}) => {
    // Filtered options for the dropdown
    const options = listAttr
        .filter((attr: any) => filter.includes(attr.localType))
        .map((attr) => ({
            value: attr.name,
            label: `${attr.name} (${attr.localType})`,
        }));

    return (
        <div className="flex flex-col justify-center gap-2 mb-4">
            <div className="flex flex-col min-w-44">
                <p>Select Label</p>
                <span className="text-xs text-gray-400">
                    Allowed data type <span className="capitalize">({filter.join(", ")})</span>
                </span>
            </div>
            <SharedDropdownSelect
                value={selectedLabel || ""}
                onValueChange={handleSelectLabel}
                options={options}
                placeholder={placeholder}
            />
        </div>
    );
};

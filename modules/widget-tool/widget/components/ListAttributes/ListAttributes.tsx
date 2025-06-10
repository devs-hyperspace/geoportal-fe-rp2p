import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface SelectedAttribute {
    attr: string;
    agg: string;
}

export const ListAttributes: React.FC<{
    listAttr: any[];
    selectedLabel: string | null;
    selectedAttr: SelectedAttribute[];
    setSelectedAttr: React.Dispatch<React.SetStateAction<SelectedAttribute[]>>;
}> = ({ listAttr, selectedLabel, selectedAttr, setSelectedAttr }) => (
    <div>
        <div className="mb-4 flex flex-col">
            <p className="">Select Attribute</p>
            <span className="text-xs text-gray-400">allowed data type (Number, Int)</span>
        </div>
        <Card className="w-full h-[54vh] overflow-auto custom-scrollbar">
            <table className="w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Attribute</th>
                        <th className="py-2 px-4 border-b text-left">Type</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listAttr.length > 0 &&
                        listAttr.map((attribute) => (
                            <tr key={attribute.name}>
                                <td className="py-2 px-4 border-b font-medium">{attribute.name}</td>
                                <td className="py-2 px-4 border-b">{attribute.localType}</td>
                                <td className="py-2 px-4 border-b flex items-center justify-center">
                                    <Button
                                        disabled={[selectedLabel, ...selectedAttr.map(v => v.attr)].includes(attribute.name) || !['number', 'int'].includes(attribute.localType)}
                                        variant="outline"
                                        onClick={() => setSelectedAttr((prev) => [...prev, { agg: 'count', attr: attribute.name }])}
                                        className="mx-1"
                                    >
                                        <PlusCircle />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </Card>
    </div>
);
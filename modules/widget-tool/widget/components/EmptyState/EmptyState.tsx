import { Card } from "@/components/ui/card";

interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, icon }) => (
    <Card className="p-2 bg-[#F2F2F2] text-[#376C9F] flex flex-row gap-2 justify-center items-center">
        {icon && <div className="w-5 h-5">{icon}</div>}
        <p>{message}</p>
    </Card>
);

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CustomMetricProps {
    value?: number;
    withoutTitle?: boolean;
    inputValue: {
        title: string;
        subTitle: string;
        unit: string;
        footer: string;
    }
}

export const CustomMetric: React.FC<CustomMetricProps> = (props) => {
    const { value, withoutTitle, inputValue } = props;

    return (
        <Card className="h-full rounded-md">
            {!withoutTitle && (
                <CardHeader>
                    <CardTitle className="text-primary text-xl font-normal">
                        <span>Chart Preview</span>
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent className={cn('text-primary', withoutTitle && 'pt-2')}>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">{inputValue.title}</h2>
                    <p>{inputValue.subTitle}</p>
                </div>
                <div className="text-5xl font-bold">
                    {value?.toLocaleString("id")}
                </div>
                <p className="text-3xl font-normal mt-4">{inputValue.unit}</p>
                {inputValue.footer.length > 0 && (
                    <div className="mt-4 text-balance">
                        <p>{inputValue.footer}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

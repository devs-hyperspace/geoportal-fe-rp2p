import { Check } from "lucide-react";

export const Stepper:React.FC<{steps: any[], activeStep: number}> = ({ steps, activeStep }) => {
    return (
        <ol className="flex items-center w-1/2 text-sm text-gray-500 font-medium sm:text-base">
            {steps.map((step, index) => (
            <li
                key={index}
                className={`flex md:w-full items-center text-primary ${
                index < activeStep
                    ? 'font-bold'
                    : index === activeStep
                    ? 'font-bold'
                    : 'font-normal'
                } ${
                index === steps.length - 1
                    ? ''
                    : "sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-400 after:border-1 after:hidden sm:after:inline-block after:mx-2 xl:after:mx-4"
                }`}
            >
                <div className="flex items-center text-xs whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
                    <span
                        className={`w-7 h-7 border border-gray-200 rounded-full flex justify-center items-center mr-1 text-sm ${
                        index < activeStep
                            ? 'bg-primary text-white'
                            : index === activeStep
                            ? 'bg-secondary text-primary'
                            : 'bg-gray-200'
                        }`}
                    >
                        {index < activeStep ? <Check size={16} /> : index + 1}
                    </span>
                    {step}
                </div>
            </li>
            ))}
        </ol>
    );
};
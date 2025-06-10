export type ChartColorsType = 'default' | 'sapphire' | 'ruby' | 'emerald' | 'daylight' | 'midnight'
type CustomCSSProperties = React.CSSProperties & {
    [key: `--chart-${number}`]: string;
};


export const chartColors: Record<ChartColorsType, CustomCSSProperties> = {
    default: {
        "--chart-1": "hsl(0 0% 50%)",
        "--chart-2": "hsl(0 0% 60%)",
        "--chart-3": "hsl(0 0% 70%)",
        "--chart-4": "hsl(0 0% 80%)",
        "--chart-5": "hsl(0 0% 90%)",
        "--chart-6": "hsl(0 0% 85%)",
        "--chart-7": "hsl(0 0% 75%)",
        "--chart-8": "hsl(0 0% 65%)",
        "--chart-9": "hsl(0 0% 55%)",
        "--chart-10": "hsl(0 0% 45%)"
    },
    sapphire: {
        "--chart-1": "hsl(221 83.2% 53.3%)",
        "--chart-2": "hsl(212 95% 68%)",
        "--chart-3": "hsl(216 92% 60%)",
        "--chart-4": "hsl(210 98% 78%)",
        "--chart-5": "hsl(212 97% 87%)",
        "--chart-6": "hsl(208 96% 85%)",
        "--chart-7": "hsl(206 95% 82%)",
        "--chart-8": "hsl(204 94% 80%)",
        "--chart-9": "hsl(202 93% 77%)",
        "--chart-10": "hsl(200 92% 75%)"
    },
    ruby: {
        "--chart-1": "hsl(0 78% 52%)",
        "--chart-2": "hsl(0 85% 63%)",
        "--chart-3": "hsl(0 90% 70%)",
        "--chart-4": "hsl(0 95% 80%)",
        "--chart-5": "hsl(0 97% 87%)",
        "--chart-6": "hsl(0 96% 85%)",
        "--chart-7": "hsl(0 94% 82%)",
        "--chart-8": "hsl(0 92% 80%)",
        "--chart-9": "hsl(0 90% 77%)",
        "--chart-10": "hsl(0 88% 75%)"
    },
    emerald: {
        "--chart-1": "hsl(140 60% 50%)",
        "--chart-2": "hsl(145 68% 60%)",
        "--chart-3": "hsl(150 70% 65%)",
        "--chart-4": "hsl(155 75% 70%)",
        "--chart-5": "hsl(160 80% 75%)",
        "--chart-6": "hsl(155 78% 70%)",
        "--chart-7": "hsl(150 76% 65%)",
        "--chart-8": "hsl(145 74% 60%)",
        "--chart-9": "hsl(140 72% 55%)",
        "--chart-10": "hsl(135 70% 50%)"
    },
    daylight: {
        "--chart-1": "hsl(50 80% 60%)",
        "--chart-2": "hsl(45 85% 70%)",
        "--chart-3": "hsl(40 90% 75%)",
        "--chart-4": "hsl(35 95% 80%)",
        "--chart-5": "hsl(30 97% 87%)",
        "--chart-6": "hsl(35 94% 85%)",
        "--chart-7": "hsl(40 92% 82%)",
        "--chart-8": "hsl(45 90% 80%)",
        "--chart-9": "hsl(50 88% 77%)",
        "--chart-10": "hsl(55 86% 75%)"
    },
    midnight: {
        "--chart-1": "hsl(240 60% 30%)",
        "--chart-2": "hsl(235 50% 40%)",
        "--chart-3": "hsl(230 45% 50%)",
        "--chart-4": "hsl(225 40% 60%)",
        "--chart-5": "hsl(220 35% 70%)",
        "--chart-6": "hsl(225 37% 65%)",
        "--chart-7": "hsl(230 39% 55%)",
        "--chart-8": "hsl(235 41% 45%)",
        "--chart-9": "hsl(240 43% 35%)",
        "--chart-10": "hsl(245 45% 25%)"
    }
};

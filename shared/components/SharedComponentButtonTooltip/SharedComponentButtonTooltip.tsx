import { Button, ButtonProps, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipContentProps } from '@radix-ui/react-tooltip';
import React from 'react';

interface SharedComponentButtonTooltipProps extends ButtonProps {
	tooltipProps: TooltipContentProps
}

export const SharedComponentButtonTooltip: React.FC<SharedComponentButtonTooltipProps> = (props) => {
	const { tooltipProps, className, ...prps } = props;

	return props.disabled ? (
		<Button
			className={buttonVariants({ variant: 'ghost', className: 'text-black bg-white' })}
			{...prps}
			style={{ boxShadow: '0 0 0 2px rgba(0, 0, 0, .1)', ...props.style }}
		/>
	) : (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<Button
						className={buttonVariants({ variant: 'ghost', className: 'text-black bg-white' })}
						{...prps}
						style={{ ...props.style, boxShadow: '0 0 0 2px rgba(0, 0, 0, .1)' }}
					/>
				</TooltipTrigger>
				<TooltipContent className="flex items-center gap-4 h-6" {...tooltipProps} />
			</Tooltip>
		</TooltipProvider>
	);
};

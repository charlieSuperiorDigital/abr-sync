import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
    onClick?: (args: any) => any;
    buttonIcon?: ReactNode;
    additionalProps?: any;
    tooltipText?: string;
};

export default function RoundButtonWithTooltip({
    onClick,
    buttonIcon,
    additionalProps,
    tooltipText,
}: Props) {
    // If there's no tooltip text, just render the button without the tooltip wrapper
    if (!tooltipText) {
        return (
            <button
                className="hover:bg-white hover:text-black bg-black text-white px-2 py-2 rounded-full flex items-center justify-center h-full"
                onClick={onClick}
                {...additionalProps}
            >
                {buttonIcon && <span>{buttonIcon}</span>}
            </button>
        );
    }

    // With tooltip text, use the Radix UI tooltip component
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="bg-white text-black hover:bg-black hover:text-white px-2 py-2 rounded-full flex items-center justify-center h-full"
                        onClick={onClick}
                        {...additionalProps}
                    >
                        {buttonIcon && <span>{buttonIcon}</span>}
                    </button>
                </TooltipTrigger>
                <TooltipContent 
                    side="top" 
                    align="center" 
                    sideOffset={5}
                    className={cn("w-[400px] max-w-[400px] text-sm")}
                >
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
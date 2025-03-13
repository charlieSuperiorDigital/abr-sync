import { ReactNode } from "react";

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
    return (
        <button
            className="relative group hover:bg-white hover:text-black bg-black text-white px-2 py-2 rounded-full flex items-center justify-center h-full"
            onClick={onClick}
            {...additionalProps}
        >
            {buttonIcon && <span className="">{buttonIcon}</span>}
            {tooltipText && (
                <span className="hidden group-hover:block absolute top-10 transform-translate-x-2 bg-white text-black text-xs px-2 py-1 rounded-md">
                    {tooltipText}
                </span>
            )}
        </button>
    )
}
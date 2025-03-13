import { ReactNode } from "react";

type Props = {
    buttonText: string;
    onClick?: (args: any) => any;
    buttonIcon?: ReactNode;
    additionalProps?: any;
};

export default function DarkButton({
    buttonText,
    onClick,
    buttonIcon,
    additionalProps,
}: Props) {
    return (
        <button
            className="group hover:bg-white hover:text-black bg-black text-white px-4 py-2 rounded-full flex items-center justify-center h-full"
            onClick={onClick}
            {...additionalProps}
        >
            {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
            <span className="group-hover:text-black font-semibold">{buttonText}</span>
        </button>
    )
}
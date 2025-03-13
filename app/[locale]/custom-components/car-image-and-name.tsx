import { Car } from "lucide-react";
import Image from "next/image";

type Props = {
    image: string;
    name: string;
    isInRental: boolean;
    onClick?: (args: any) => void;
}

export default function CarImageAndName({
    image,
    name,
    isInRental,
    onClick,
}: Props) {
    return (
        <div onClick={onClick} className="cursor-pointer flex items-center gap-4 hover:opacity-80 group h-full">
            <Image src={image} alt={name} width={40} height={40} className="w-10 h-10 group-hover:opacity-80 transition-all duration-100" />
            <p className="text-lg font-medium">{name}</p>
            {isInRental && <Car className="w-5 h-5 text-green-500"/>}
        </div>
    )
}
import Image from "next/image";

type Props = {
    image: string;
    name: string;
    onClick?: (args:any) => void;
}

export default function UserImageAndName({
    image,
    name,
    onClick,
}: Props) {
    return (
        <div onClick={onClick} className="cursor-pointer flex items-center gap-4 hover:opacity-80 group h-full">
            <Image src={image} alt={name} width={40} height={40} className="w-10 h-10 rounded-full group-hover:opacity-80 transition-all duration-100" />
            <p className="text-lg font-bold">{name}</p>
        </div>
    )
}
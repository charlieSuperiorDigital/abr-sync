import React from 'react'
import Image from 'next/image'

interface SVGIconProps {
  className?: string
  src: string
}

const svgIcon: React.FC<SVGIconProps> = ({ className, src }) => {
  return (
    <Image
      src={src}
      alt="Note Text Icon"
      width={20}
      height={20}
      className={`${className} filter invert brightness-100 group-hover:filter-none group-hover:invert-0`}
    />
  )
}

export default svgIcon

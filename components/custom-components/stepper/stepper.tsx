'use client'

type Props = {
  activeTab: number
  length: number
}

const Stepper = ({ activeTab, length }: Props) => {
  return (
    <div className="flex gap-2 w-full" data-testid="stepper-container">
      {Array.from({ length }, (_, index) => (
        <div
          key={index}
          className={`flex-1 h-1 ${activeTab >= index ? 'bg-black' : 'bg-gray-300'}`}
        ></div>
      ))}
    </div>
  )
}

export default Stepper

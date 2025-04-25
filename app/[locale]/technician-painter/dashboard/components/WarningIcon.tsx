import React from 'react';

interface WarningIconProps {
  className?: string;
  size?: number;
}

const WarningIcon: React.FC<WarningIconProps> = ({ className = '', size = 16 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Red circle background */}
      <circle cx="12" cy="12" r="10" fill="#FF0000" />
      
      {/* White exclamation mark */}
      <path 
        d="M12 7v6" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle 
        cx="12" 
        cy="17" 
        r="1.5" 
        fill="white" 
      />
    </svg>
  );
};

export default WarningIcon; 
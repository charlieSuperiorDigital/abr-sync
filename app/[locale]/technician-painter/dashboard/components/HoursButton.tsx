import React from 'react';
import { Printer } from 'lucide-react';

interface HoursButtonProps {
  count: number;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

const HoursButton: React.FC<HoursButtonProps> = ({ count, onClick, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className="flex gap-1 justify-center items-center px-3 h-11 text-lg font-bold text-white bg-black rounded-full shadow transition-colors duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black hover:bg-gray-800 active:bg-gray-900"
    style={{ border: 'none' }}
  >
    <span>{count}</span>
    <Printer size={20} className="ml-2 text-white" />
  </button>
);

export default HoursButton;

"use client";

import * as React from "react";
import { useState } from "react";
import { X } from "lucide-react";

interface HoursModalProps {
  open: boolean;
  onClose: () => void;
}

const HoursModal: React.FC<HoursModalProps> = ({ open, onClose }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="flex fixed inset-0 z-50 justify-end transition-opacity duration-300 bg-black/50"
      style={{ opacity: isAnimating ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white w-[500px] h-full shadow-xl flex flex-col"
        style={{ transform: isAnimating ? "translateX(0)" : "translateX(100%)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="pl-4 text-2xl font-bold">Hours</h1>
          <button
            onClick={onClose}
            className="p-2 mr-6 rounded-full hover:bg-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Modal Content (empty for now) */}
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default HoursModal;

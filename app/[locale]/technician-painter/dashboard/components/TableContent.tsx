import React from 'react';
import Image from 'next/image';
import { Opportunity } from '@/app/types/opportunity';
import { formatCurrency } from '@/lib/utils';
import PartsButton from './PartsButton';
import { CalendarDays } from 'lucide-react';

interface TableContentProps {
  opportunity: Opportunity;
}

const formatDate = (date?: string) => {
  if (!date) return '---';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getDaysUntil = (date?: string) => {
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0); // Reset time to start of day

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

const TableContent: React.FC<TableContentProps> = ({ opportunity }) => {
  // Updated action buttons as requested
  const actionButtons = [
    { label: 'Supplement . X', className: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900', onClick: () => { } },
    { label: 'Needs Parts . 2', className: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900', onClick: () => { } },
    { label: 'Paint . 5', className: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900', onClick: () => { } },
    { label: 'Done', className: 'bg-green-600 text-white hover:bg-green-500 active:bg-green-700', onClick: () => { } },
  ];

  return (
    <div className="max-w-[99.99vw] bg-gray-200 ">
      {/* First Row: RO, Car details, ECD, action buttons */}
      <div className="flex flex-row gap-0 justify-between items-center py-4">
        <div className="flex flex-row gap-6 items-center">
          <div className="px-4 text-2xl font-bold text-black">RO #{opportunity.roNumber}</div>
          <div className="text-xl font-semibold text-black">
            {opportunity.vehicle.year} {opportunity.vehicle.make} {opportunity.vehicle.model} ({opportunity.vehicle.exteriorColor})
          </div>
          {(() => {
            const daysUntil = getDaysUntil(opportunity.estimatedCompletionDate);
            const isUrgent = daysUntil !== null && daysUntil <= 3;

            return (
              <div className={`flex items-center px-4 py-2 text-lg font-semibold rounded-full ${isUrgent ? 'text-white bg-red-600' : 'text-black bg-gray-200'
                }`}>
                <CalendarDays size={20} className="mr-3" />
                {daysUntil !== null
                  ? `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} until ECD`
                  : `ECD: ${formatDate(opportunity.estimatedCompletionDate)}`}
              </div>
            );
          })()}
        </div>
        <div className="flex flex-row gap-0 ml-auto">
          {actionButtons.map((btn, idx) => (
            <button
              key={btn.label}
              className={`font-bold px-7 py-3 rounded-3xl shadow text-lg transition-colors duration-150 ${btn.className} ${idx !== 0 ? 'ml-2' : ''}`}
              onClick={btn.onClick}
              style={{ minWidth: 140 }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Second Row: Car image, info blocks, damage, parts, repair plan */}
      <div className="flex flex-row gap-0 justify-between items-stretch bg-gray-200">
        <div className='flex flex-[4]'>
          {/* Car Image */}
          <div className="overflow-hidden w-48 h-full bg-red-200">
            <Image
              src={`https://picsum.photos/seed/${opportunity.vehicle.vin}/320/240`}
              alt="Vehicle"
              width={320}
              height={320}
              className="object-fill w-full h-full cover"
              priority
            />
          </div>
          <div className='flex-[4] border  border-gray-300 flex-row flex'>

            {/* Car Info Block */}
            <div className=" flex flex-col gap-1 justify-center bg-opacity-90  px-6 py-4 min-w-[400px] flex-[1]">
              <div className='flex-[1]'><span className="font-bold">VIN:</span> {opportunity.vehicle.vin}</div>
              <div className='flex flex-[4] flex-row justify-between  start max-w-[300px]'>
                <div className='flex flex-col justify-around'>
                  <div><span className="font-bold">Estimate:</span> ${opportunity.estimateAmount?.toLocaleString() || '---'}</div>
                  <div><span className="font-bold">Tech:</span> {'---'}</div>
                  <div><span className="font-bold">Color:</span> {opportunity.vehicle.exteriorColor}</div>
                </div>
                <div className='flex flex-col justify-around'>
                  <div><span className="font-bold">Hours:</span> {'---'}</div>
                  <div><span className="font-bold">Est.:</span> {'---'}</div>
                  <div><span className="font-bold">License:</span> {opportunity.vehicle.licensePlate || '---'}</div>
                </div>
              </div>
            </div>
            {/* Damage Description */}
            <div className="flex flex-col bg-opacity-90 items-center justify-center h-full px-6 py-4 flex-[1]">

              <div className="text-gray-800">{opportunity.vehicle.damageDescription || '---'}</div>
            </div>
          </div>
        </div>
        {/* Parts Block */}
        <div className="border border-gray-300  flex flex-col bg-opacity-90 px-6 py-4 min-w-[180px] flex-[1]">
          <div className="mb-2 text-xl font-bold">PARTS</div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between">
              <span className="font-bold">ON EST.:</span>
              <span className='font-bold'>XY</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-bold text-red-500">RECEIVED</span>
              <span className='font-bold text-red-500'>XY</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-bold text-red-500">DIFFERENCE</span>
              <span className='font-bold text-red-500'>XY</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-bold text-red-500">CORES:</span>
              <span className='font-bold text-red-500'>XY</span>
            </div>
            <div className="flex flex-row justify-between font-semibold">
              <span className="font-bold text-red-500">TOTAL RETURNS:</span>
              <span className='font-bold text-red-500'>XY</span>
            </div>
          </div>
        </div>
        {/* Repair Plan Block */}
        <div className=" border border-gray-300 flex flex-col bg-opacity-90 px-6 py-4 min-w-[180px] flex-[1]">
          <div className="mb-2 text-xl font-bold">REPAIR PLAN</div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between">
              <span className="font-semibold">START</span>
              <span>{formatDate(opportunity.repairStartDate)}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-semibold">IN PROGRESS</span>
              <span>{formatDate(opportunity.repairInProgressDate)}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-semibold">COMPLETED</span>
              <span>{formatDate(opportunity.repairCompletedDate)}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-semibold">VEHICLE OUT</span>
              <span>{formatDate(opportunity.vehicleOutDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableContent;

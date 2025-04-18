'use client'

import * as React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Opportunity } from '@/app/types/opportunity';
import TableContent from './components/TableContent';
import PartsButton from './components/PartsButton';
import PartsModal from './components/PartsModal';
import { technicianPainterMockData } from '@/app/mocks/technician-painter-dashboard';
import { Car } from 'lucide-react';

export default function TechnicianPainterDashboard() {
  // Use local mock data for now
  const data: Opportunity[] = technicianPainterMockData;
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const toggleRow = (opportunityId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [opportunityId]: !prev[opportunityId],
    }));
  };
  const openPartsModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };
  const closePartsModal = () => setModalOpen(false);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="h-10 text-md">
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">UPDATES</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">VEHICLE</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">RO #</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">ECD</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">IN RENTAL</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">TOTAL PARTS</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">TO RECEIVE</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">CORES</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">SUBLET</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">SUBLET DUE</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">SUBLET TYPE</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-black whitespace-nowrap">HOURS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((opportunity) => (
            <React.Fragment key={opportunity.opportunityId}>
              <TableRow
                className="h-14 text-lg cursor-pointer select-none hover:bg-gray-300"
                style={{ minHeight: '96px', touchAction: 'manipulation' }}
                onClick={() => toggleRow(opportunity.opportunityId)}
              >
                <TableCell className="px-6 py-4"><span>No Updates</span></TableCell>
                <TableCell className="px-6 py-4">{opportunity.vehicle.make} {opportunity.vehicle.model} {opportunity.vehicle.year}</TableCell>
                <TableCell className="px-6 py-4">{opportunity.roNumber}</TableCell>
                <TableCell className="px-6 py-4">{opportunity.estimatedCompletionDate ? new Date(opportunity.estimatedCompletionDate).toLocaleDateString() : '---'}</TableCell>
                <TableCell className="px-6 py-4">
                  {opportunity.isInRental && (
                    <Car color="#22c55e" size={32}  className="inline-block" />
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <PartsButton count={opportunity.parts?.total || 0} title="Total Parts" onClick={openPartsModal} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <PartsButton count={ 0} title="To Receive" onClick={openPartsModal} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <PartsButton count={opportunity.parts?.cores || 0} title="Cores" onClick={openPartsModal} />
                </TableCell>
                <TableCell className="px-6 py-4">Sublet Name</TableCell>
                <TableCell className="px-6 py-4">Days amount</TableCell>
                <TableCell className="px-6 py-4">TYPE_1  TYPE_2</TableCell>
                <TableCell className="px-6 py-4">HOURS AMOUNT</TableCell>
                
              </TableRow>
              <TableRow key={`expanded-${opportunity.opportunityId}`}>
                <TableCell colSpan={12} className="p-0 bg-gray-50 border-0" style={{ height: expandedRows[opportunity.opportunityId] ? 'auto' : 0 }}>
                  <div
                    style={{
                      overflow: 'hidden',
                      transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
                      maxHeight: expandedRows[opportunity.opportunityId] ? '900px' : '0px',
                      opacity: expandedRows[opportunity.opportunityId] ? 1 : 0,
                      visibility: expandedRows[opportunity.opportunityId] ? 'visible' : 'hidden',
                    }}
                  >
                    <TableContent opportunity={opportunity} />
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {modalOpen && <PartsModal open={modalOpen} onClose={closePartsModal} />}
    </div>
  );
}

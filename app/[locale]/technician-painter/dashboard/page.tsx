'use client'

import * as React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Opportunity } from '@/app/types/opportunity';
import TableContent from './components/TableContent';
import PartsButton from './components/PartsButton';
import PartsModal from './components/PartsModal';
import TaskSidebar from './components/TaskSidebar';
import { technicianPainterMockData } from '@/app/mocks/technician-painter-dashboard';
import { CalendarDays, Car, CloudRain, Sun, Cloud } from 'lucide-react';
import { TimeDisplay } from './components/TimeDisplay';
import { UserCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import WeatherDropdown from './components/WeatherDropdown';
import HoursButton from './components/HoursButton';
import HoursModal from './components/HoursModal';
import EditProfileModal from '@/app/components/custom-components/edit-profile-modal';

export default function TechnicianPainterDashboard() {
  // Use local mock data for now
  const data: Opportunity[] = technicianPainterMockData;
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user ? `${session.user.firstName} ${session.user.lastName}` : 'Technician';

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
  const openHoursModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoursModalOpen(true);
  };
  const closeHoursModal = () => setHoursModalOpen(false);

  return (
    <div className="flex h-full">
      <TaskSidebar />
      <div className="flex-1">
          <div className="flex sticky top-0 z-30 justify-between items-center px-6 py-8 bg-white border-b border-gray-200">
                <div className="flex gap-4 items-center">
                  <span className="mr-2 text-2xl font-bold">Workfiles</span>
                  <span className="flex items-center px-4 py-2 text-lg font-semibold text-white bg-red-600 rounded-full">
                    <CalendarDays size={16} className="mr-3" />
                    2 CARS LEAVING IN 3 DAYS
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <WeatherDropdown />
                  <TimeDisplay />
                  <span className="flex gap-4 items-center ml-4">
                    <button
                      className="flex justify-center items-center w-16 h-16 bg-gray-300 rounded-full focus:outline-none hover:bg-gray-400 active:bg-gray-500 transition-all"
                      style={{ fontSize: 36 }}
                      aria-label="Edit Profile"
                      onClick={() => setEditProfileOpen(true)}
                    >
                      <UserCircle size={36} />
                    </button>
                    <button
                      className="text-2xl font-semibold px-6 py-4 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 focus:outline-none transition-all"
                      style={{ minWidth: 120 }}
                      onClick={() => setEditProfileOpen(true)}
                    >
                      {userName}
                    </button>
                  </span>
                </div>
              </div>
        <div className="">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-none">
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">UPDATES</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">VEHICLE</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">RO #</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">ECD</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">IN RENTAL</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">TOTAL PARTS</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">TO RECEIVE</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">CORES</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">SUBLET</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">SUBLET DUE</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">SUBLET TYPE</TableHead>
                <TableHead className="text-sm font-semibold text-left text-black whitespace-nowrap border-none">HOURS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((opportunity) => (
                <React.Fragment key={opportunity.opportunityId}>
                  <TableRow
                    className="h-20 transition-colors cursor-pointer select-none text-md hover:bg-gray-300"
                    style={{ minHeight: '120px', touchAction: 'manipulation' }}
                    onClick={() => toggleRow(opportunity.opportunityId)}
                  >
                    <TableCell className=""><span className="">No Updates</span></TableCell>
                    <TableCell className="">{opportunity.vehicle.make} {opportunity.vehicle.model} {opportunity.vehicle.year}</TableCell>
                    <TableCell className="">{opportunity.roNumber}</TableCell>
                    <TableCell className="">{opportunity.estimatedCompletionDate ? new Date(opportunity.estimatedCompletionDate).toLocaleDateString() : '---'}</TableCell>
                    <TableCell className="flex justify-center items-center px-2 py-6">
                      {opportunity.isInRental && (
                        <Car color="#22c55e" size={40} className="inline-block" />
                      )}
                    </TableCell>
                    <TableCell className="">
                      <PartsButton count={opportunity.parts?.total || 0} title="Total Parts" onClick={openPartsModal} />
                    </TableCell>
                    <TableCell className="">
                      <PartsButton count={0} title="To Receive" onClick={openPartsModal} />
                    </TableCell>
                    <TableCell className="">
                      <PartsButton count={opportunity.parts?.cores || 0} title="Cores" onClick={openPartsModal} />
                    </TableCell>
                    <TableCell className="">Sublet Name</TableCell>
                    <TableCell className="">Days amount</TableCell>
                    <TableCell className="">
                      {/*
                      {(Array.isArray(opportunity.subletTypes) ? opportunity.subletTypes : (opportunity.subletTypes ? [opportunity.subletTypes] : []))
                        .map((type: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 mr-2 mb-1 text-sm font-semibold text-black bg-gray-200 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                      */}
                      {["TYPE_1", "TYPE_2", "TYPE_3"].map((type, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 mr-1 mb-1 text-sm font-semibold text-black bg-gray-200 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="">
                      <HoursButton count={0} title="Hours" onClick={openHoursModal} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={`expanded-${opportunity.opportunityId}`}>
                    <TableCell colSpan={12} className="p-0 bg-gray-50 border-0" style={{ borderTop: 'none', borderBottom: 'none', padding: 0 }}>
                      <div
                        style={{
                          overflow: 'hidden',
                          transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
                          maxHeight: expandedRows[opportunity.opportunityId] ? '900px' : '0px',
                          opacity: expandedRows[opportunity.opportunityId] ? 1 : 0,
                          visibility: expandedRows[opportunity.opportunityId] ? 'visible' : 'hidden',
                          borderTop: 'none',
                          borderBottom: 'none',
                          padding: 0,
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
          {hoursModalOpen && <HoursModal open={hoursModalOpen} onClose={closeHoursModal} />}
          <EditProfileModal open={editProfileOpen} onOpenChange={setEditProfileOpen} />
        </div>
      </div>
    </div>
  );
}

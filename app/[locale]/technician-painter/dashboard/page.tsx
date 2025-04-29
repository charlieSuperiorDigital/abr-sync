'use client'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Opportunity } from '@/app/types/opportunity';
import TableContent from './components/TableContent';
import PartsButton from './components/PartsButton';
import PartsModal from './components/PartsModal';
import TaskSidebar from './components/TaskSidebar';
import { technicianPainterMockData } from '@/app/mocks/technician-painter-dashboard';
import { CalendarDays, Car, CloudRain, Sun, Cloud, AlertCircle } from 'lucide-react';
import { TimeDisplay } from './components/TimeDisplay';
import { UserCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import WeatherDropdown from './components/WeatherDropdown';
import HoursButton from './components/HoursButton';
import HoursModal from './components/HoursModal';
import EditProfileModal from '@/app/components/custom-components/edit-profile-modal';
import { useGetWorkfilesByUserId } from '@/app/api/hooks/useWorkfiles';
import { Workfile, WorkfileApiResponse } from '@/app/types/workfile';
import { useWeather } from '@/app/api/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { useGetTasksByAssignedUser } from '@/app/api/hooks/useGetTasksByAssignedUser';
import Image from 'next/image';

// Define types for workfile extended properties
interface WorkfileWithParts extends WorkfileApiResponse {
  parts?: {
    total: number;
    cores: number;
  };
}

// Define types for opportunity with sublet types
interface OpportunityWithSublet {
  subletTypes?: string[] | string;
}


export default function TechnicianPainterDashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.userId;
  const { workfiles: data } = useGetWorkfilesByUserId({ userId: userId || '' });
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const userName = session?.user ? `${session.user.firstName} ${session.user.lastName}` : 'Technician';
  // Geolocation states
  const [coordinates, setCoordinates] = useState<{ latitude?: number; longitude?: number }>({});
  const [locationRequested, setLocationRequested] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Weather hook
  const { weatherData, isLoading: weatherLoading, error: weatherError } = useWeather(coordinates);

  // Request user location
  const requestLocation = () => {
    setLocationRequested(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission was denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
      }
    );
  };

  // Request location on initial load
  useEffect(() => {
    if (!locationRequested) {
      requestLocation();
    }
  }, [locationRequested]);

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
            {locationError ? (
              <Button
                variant="outline"
                className="flex gap-2 items-center px-4 py-2"
                onClick={requestLocation}
              >
                <AlertCircle size={16} />
                <span>Request location access</span>
              </Button>
            ) : weatherLoading ? (
              <span className="px-4 py-2">Loading weather...</span>
            ) : (
              <WeatherDropdown latitude={coordinates.latitude} longitude={coordinates.longitude} />
            )}
            <TimeDisplay />
            <span className="flex gap-4 items-center ml-4">
              <button
                className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded-full transition-all focus:outline-none hover:bg-gray-400 active:bg-gray-500"
                
                aria-label="Edit Profile"
                onClick={() => setEditProfileOpen(true)}
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User profile"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircle size={30} />
                )}
              </button>
              <button
                className="px-6 py-2 text-xl font-semibold bg-gray-200 rounded-full transition-all hover:bg-gray-300 active:bg-gray-400 focus:outline-none"
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
              {data?.map((workfile: WorkfileApiResponse) => {
                // Cast to extended types for added properties
                const workfileWithParts = workfile as WorkfileWithParts;

                // Define default empty subletTypes array
                const subletTypes: string[] = [];

                // Safely check if opportunity has subletTypes
                const opportunitySublet = workfile.workfile.opportunity as unknown as OpportunityWithSublet;
                if (opportunitySublet?.subletTypes) {
                  if (Array.isArray(opportunitySublet.subletTypes)) {
                    subletTypes.push(...opportunitySublet.subletTypes);
                  } else {
                    subletTypes.push(opportunitySublet.subletTypes);
                  }
                }

                return (
                  <React.Fragment key={workfile.workfile.id}>
                    <TableRow
                      className="h-20 transition-colors cursor-pointer select-none text-md hover:bg-gray-300"
                      style={{ minHeight: '120px', touchAction: 'manipulation' }}
                      onClick={() => toggleRow(workfile.workfile.id)}
                    >
                      <TableCell className=""><span className="">No Updates</span></TableCell>
                      <TableCell className="">{workfile.workfile.opportunity.vehicle.make} {workfile.workfile.opportunity.vehicle.model} {workfile.workfile.opportunity.vehicle.year}</TableCell>
                      <TableCell className="">{workfile.workfile.id}</TableCell>
                      <TableCell className="">{workfile.workfile.estimatedCompletionDate ? new Date(workfile.workfile.estimatedCompletionDate).toLocaleDateString() : '---'}</TableCell>
                      <TableCell className="flex justify-center items-center px-2 py-6">
                        {workfile.workfile.opportunity.inRental && (
                          <Car color="#22c55e" size={40} className="inline-block" />
                        )}
                      </TableCell>
                      <TableCell className="">
                        <PartsButton count={workfileWithParts.parts?.total || 0} title="Total Parts" onClick={openPartsModal} />
                      </TableCell>
                      <TableCell className="">
                        <PartsButton count={0} title="To Receive" onClick={openPartsModal} />
                      </TableCell>
                      <TableCell className="">
                        <PartsButton count={workfileWithParts.parts?.cores || 0} title="Cores" onClick={openPartsModal} />
                      </TableCell>
                      <TableCell className="">Sublet Name</TableCell>
                      <TableCell className="">Days amount</TableCell>
                      <TableCell className="">
                        {subletTypes.map((type: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 mr-2 mb-1 text-sm font-semibold text-black bg-gray-200 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell className="">
                        <HoursButton count={0} title="Hours" onClick={openHoursModal} />
                      </TableCell>
                    </TableRow>
                    <TableRow key={`expanded-${workfile.workfile.id}`}>
                      <TableCell colSpan={12} className="p-0 bg-gray-50 border-0" style={{ borderTop: 'none', borderBottom: 'none', padding: 0 }}>
                        <div
                          style={{
                            overflow: 'hidden',
                            transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
                            maxHeight: expandedRows[workfile.workfile.id] ? '900px' : '0px',
                            opacity: expandedRows[workfile.workfile.id] ? 1 : 0,
                            visibility: expandedRows[workfile.workfile.id] ? 'visible' : 'hidden',
                            borderTop: 'none',
                            borderBottom: 'none',
                            padding: 0,
                          }}
                        >
                          <TableContent workfileId={workfile.workfile.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
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

'use client';

import { DataTable } from '@/components/custom-components/custom-table/data-table';
import { VehicleCell } from '@/components/custom-components/custom-table/table-cells';
import { workfiles } from '@/app/mocks/workfiles_new';
import { Workfile, WorkfileStatus } from '@/app/types/workfile';

export default function InProgress() {
  // Filter for in-progress workfiles
  const inProgressWorkfiles = workfiles.filter(wf => wf.status === WorkfileStatus.InProgress);

  // Define the cell rendering functions separately
  const renderVehicleCell = ({ row }: { row: { original: Workfile } }) => (
    <VehicleCell
      make={row.original.vehicle.make}
      model={row.original.vehicle.model}
      year={row.original.vehicle.year}
      imageUrl={row.original.vehicle.vehiclePicturesUrls[0]}
    />
  );

  const columns = [
    {
      accessorKey: 'roNumber',
      header: 'RO #',
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: renderVehicleCell,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      cell: ({ row }: { row: { original: Workfile } }) => row.original.owner.name,
    },
    {
      accessorKey: 'estimateAmount',
      header: 'Estimate',
      cell: ({ row }: { row: { original: Workfile } }) => 
        row.original.estimateAmount ? 
        `$${row.original.estimateAmount.toLocaleString()}` : 
        'N/A',
    },
    {
      accessorKey: 'inDate',
      header: 'In Date',
      cell: ({ row }: { row: { original: Workfile } }) => 
        new Date(row.original.inDate).toLocaleDateString(),
    },
    {
      accessorKey: 'estimatedCompletionDate',
      header: 'ECD',
      cell: ({ row }: { row: { original: Workfile } }) => 
        row.original.estimatedCompletionDate ? 
        new Date(row.original.estimatedCompletionDate).toLocaleDateString() : 
        'N/A',
    },
    {
      accessorKey: 'insurance',
      header: 'Insurance',
      cell: ({ row }: { row: { original: Workfile } }) => row.original.insurance.company,
    },
    {
      accessorKey: 'lastUpdatedDate',
      header: 'Last Updated',
      cell: ({ row }: { row: { original: Workfile } }) => 
        new Date(row.original.lastUpdatedDate).toLocaleDateString(),
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }: { row: { original: Workfile } }) => (
        <div className="flex flex-col text-sm">
          <span>{row.original.owner.name}</span>
          <span>{row.original.owner.phone}</span>
          <span>{row.original.owner.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'addTask',
      header: 'Actions',
      cell: ({ row }: { row: { original: Workfile } }) => (
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => console.log('Add task for:', row.original.workfileId)}
        >
          Add Task
        </button>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={inProgressWorkfiles}
      />
    </div>
  );
}
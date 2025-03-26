import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '@/components/custom-components/custom-table/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

// Sample data types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const meta: Meta<typeof DataTable<User, any>> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[800px] border rounded-lg p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DataTable<User, any>>;

// Sample data
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'Inactive',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Editor',
    status: 'Active',
  },
];

// Sample columns
const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          row.original.status === 'Active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        )}
      >
        {row.original.status}
      </span>
    ),
  },
];

export const Default: Story = {
  args: {
    columns,
    data: users,
    pageSize: 5,
    showPageSize: true,
    pageSizeOptions: [5, 10, 20],
  },
};

export const WithRowClick: Story = {
  args: {
    columns,
    data: users,
    pageSize: 5,
    onRowClick: (row: User) => {
      console.log('Clicked row:', row);
    },
  },
};

export const CustomPageSizes: Story = {
  args: {
    columns,
    data: users,
    pageSize: 2,
    showPageSize: true,
    pageSizeOptions: [2, 5, 10],
  },
};

// Generate a lot of data for pagination example
const manyUsers = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'User',
  status: i % 4 === 0 ? 'Inactive' : 'Active',
}));

export const WithManyRows: Story = {
  args: {
    columns,
    data: manyUsers,
    pageSize: 10,
    showPageSize: true,
    pageSizeOptions: [10, 20, 50],
  },
};

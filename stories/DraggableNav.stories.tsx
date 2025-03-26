import type { Meta, StoryObj } from '@storybook/react';
import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav';

const meta: Meta<typeof DraggableNav> = {
  title: 'Components/DraggableNav',
  component: DraggableNav,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/dashboard',
        push: (path: string) => console.log('Navigate to:', path),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DraggableNav>;

const defaultNavItems = [
  { id: 'all', label: 'All Tasks', count: 12 },
  { id: 'pending', label: 'Pending', count: 5 },
  { id: 'in-progress', label: 'In Progress', count: 3 },
  { id: 'completed', label: 'Completed', count: 4 },
];

export const Default: Story = {
  args: {
    navItems: defaultNavItems,
    defaultTab: 'all',
  },
};

export const WithManyItems: Story = {
  args: {
    navItems: [
      ...defaultNavItems,
      { id: 'archived', label: 'Archived', count: 8 },
      { id: 'draft', label: 'Draft', count: 2 },
      { id: 'review', label: 'Under Review', count: 3 },
    ],
    defaultTab: 'all',
  },
};

export const WithLongLabels: Story = {
  args: {
    navItems: [
      { id: 'all', label: 'All Outstanding Tasks', count: 12 },
      { id: 'pending', label: 'Pending Approval', count: 5 },
      { id: 'in-progress', label: 'Currently In Progress', count: 3 },
      { id: 'completed', label: 'Recently Completed', count: 4 },
    ],
    defaultTab: 'all',
  },
};

export const WithHighCounts: Story = {
  args: {
    navItems: [
      { id: 'all', label: 'All Tasks', count: 1250 },
      { id: 'pending', label: 'Pending', count: 543 },
      { id: 'in-progress', label: 'In Progress', count: 328 },
      { id: 'completed', label: 'Completed', count: 379 },
    ],
    defaultTab: 'all',
  },
};

export const WithCustomDefaultTab: Story = {
  args: {
    navItems: defaultNavItems,
    defaultTab: 'in-progress',
  },
};

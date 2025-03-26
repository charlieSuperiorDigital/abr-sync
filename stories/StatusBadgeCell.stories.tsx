import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadgeCell } from '@/components/custom-components/custom-table/table-cells';

const meta: Meta<typeof StatusBadgeCell> = {
  title: 'Components/Table Cells/StatusBadgeCell',
  component: StatusBadgeCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'danger',
        'warning',
        'neutral',
        'slate',
        'info',
        'success',
        'forest',
        'dark',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadgeCell>;

export const Open: Story = {
  args: {
    status: 'Open',
    variant: 'success',
  },
};

export const InProgress: Story = {
  args: {
    status: 'In Progress',
    variant: 'warning',
  },
};

export const Completed: Story = {
  args: {
    status: 'Completed',
    variant: 'slate',
  },
};

export const Urgent: Story = {
  args: {
    status: 'Urgent',
    variant: 'danger',
  },
};

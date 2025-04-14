import type { Meta, StoryObj } from '@storybook/react';
import { PriorityBadgeCell } from '@/components/custom-components/custom-table/table-cells';

const meta: Meta<typeof PriorityBadgeCell> = {
  title: 'Components/Table Cells/PriorityBadgeCell',
  component: PriorityBadgeCell,
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
type Story = StoryObj<typeof PriorityBadgeCell>;

export const Urgent: Story = {
  args: {
    priority: 'Urgent',
    variant: 'danger',
  },
};

export const High: Story = {
  args: {
    priority: 'High',
    variant: 'warning',
  },
};

export const Normal: Story = {
  args: {
    priority: 'Normal',
    variant: 'success',
  },
};

export const Low: Story = {
  args: {
    priority: 'Low',
    variant: 'slate',
  },
};

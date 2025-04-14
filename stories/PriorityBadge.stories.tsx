import type { Meta, StoryObj } from '@storybook/react';
import { PriorityBadge } from '@/components/custom-components/priority-badge/priority-badge';

const meta: Meta<typeof PriorityBadge> = {
  title: 'Components/PriorityBadge',
  component: PriorityBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PriorityBadge>;

export const Urgent: Story = {
  args: {
    variant: 'danger',
    children: 'Urgent',
  },
};

export const High: Story = {
  args: {
    variant: 'warning',
    children: 'High',
  },
};

export const Normal: Story = {
  args: {
    variant: 'success',
    children: 'Normal',
  },
};

export const Low: Story = {
  args: {
    variant: 'slate',
    children: 'Low',
  },
};

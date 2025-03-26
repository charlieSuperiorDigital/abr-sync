import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
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
type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {
  args: {
    children: 'Default Status',
    variant: 'default',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Status',
    variant: 'danger',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Status',
    variant: 'warning',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Status',
    variant: 'success',
  },
};

export const Info: Story = {
  args: {
    children: 'Info Status',
    variant: 'info',
  },
};

export const Slate: Story = {
  args: {
    children: 'Slate Status',
    variant: 'slate',
  },
};

export const Forest: Story = {
  args: {
    children: 'Forest Status',
    variant: 'forest',
  },
};

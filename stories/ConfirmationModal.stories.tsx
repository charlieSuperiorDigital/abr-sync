import type { Meta, StoryObj } from '@storybook/react';
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, LogOut } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Components/ConfirmationModal',
  component: ConfirmationModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmationModal>;

const ConfirmationModalDemo = ({
  title,
  description,
  confirmText,
  confirmIcon,
}: {
  title: string;
  description: string;
  confirmText: string;
  confirmIcon?: any;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <ConfirmationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => console.log('Confirmed')}
        title={title}
        description={description}
        confirmText={confirmText}
        confirmIcon={confirmIcon}
      />
    </div>
  );
};

export const DeleteConfirmation: Story = {
  render: () => (
    <ConfirmationModalDemo
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      confirmText="Delete"
      confirmIcon={Trash2}
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <ConfirmationModalDemo
      title="Warning"
      description="This action will affect multiple items in your workspace. Please confirm to proceed."
      confirmText="Proceed"
      confirmIcon={AlertTriangle}
    />
  ),
};

export const Logout: Story = {
  render: () => (
    <ConfirmationModalDemo
      title="Logout"
      description="Are you sure you want to log out? Any unsaved changes will be lost."
      confirmText="Logout"
      confirmIcon={LogOut}
    />
  ),
};

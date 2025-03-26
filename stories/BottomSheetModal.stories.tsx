import type { Meta, StoryObj } from '@storybook/react';
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const meta: Meta<typeof BottomSheetModal> = {
  title: 'Components/BottomSheetModal',
  component: BottomSheetModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BottomSheetModal>;

const BottomSheetModalDemo = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <BottomSheetModal
        isOpen={open}
        onOpenChange={setOpen}
        title={title}
      >
        {content}
      </BottomSheetModal>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <BottomSheetModalDemo
      title="Basic Modal"
      content={
        <div className="p-4">
          <p>This is a basic bottom sheet modal.</p>
          <p>Double-click to expand/collapse.</p>
        </div>
      }
    />
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <BottomSheetModalDemo
      title="Long Content Modal"
      content={
        <div className="p-4 space-y-4">
          <p>This modal contains a lot of content to demonstrate scrolling.</p>
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
      }
    />
  ),
};

export const WithFormContent: Story = {
  render: () => (
    <BottomSheetModalDemo
      title="Form Modal"
      content={
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <Button className="w-full">Submit</Button>
        </div>
      }
    />
  ),
};

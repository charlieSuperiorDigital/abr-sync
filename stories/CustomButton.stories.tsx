import type { Meta, StoryObj } from '@storybook/react';
import { CustomButton } from '@/components/custom-components/buttons/custom-button';
import { Plus } from 'lucide-react';

const meta: Meta<typeof CustomButton> = {
  title: 'Components/CustomButton',
  component: CustomButton,
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
type Story = StoryObj<typeof CustomButton>;

export const Filled: Story = {
  args: {
    children: 'Filled Button',
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    variant: 'outlined',
  },
};

export const Gray: Story = {
  args: {
    children: 'Gray Button',
    variant: 'gray',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Underlined: Story = {
  args: {
    children: 'Underlined Button',
    variant: 'underlined',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="w-4 h-4 mr-2" />
        Add New
      </>
    ),
    variant: 'filled',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'filled',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'filled',
    disabled: true,
  },
};

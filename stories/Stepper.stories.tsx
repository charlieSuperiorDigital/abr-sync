import type { Meta, StoryObj } from '@storybook/react';
import Stepper from '@/components/custom-components/stepper/stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Step1of3: Story = {
  args: {
    activeTab: 0,
    length: 3,
  },
};

export const Step2of3: Story = {
  args: {
    activeTab: 1,
    length: 3,
  },
};

export const Step3of3: Story = {
  args: {
    activeTab: 2,
    length: 3,
  },
};

export const Step2of5: Story = {
  args: {
    activeTab: 1,
    length: 5,
  },
};

export const AllStepsComplete: Story = {
  args: {
    activeTab: 4,
    length: 5,
  },
};

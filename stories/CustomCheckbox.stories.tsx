import type { Meta, StoryObj } from '@storybook/react';
import { CustomCheckbox } from '@/components/custom-components/checkbox/custom-checkbox';

const meta: Meta<typeof CustomCheckbox> = {
  title: 'Components/CustomCheckbox',
  component: CustomCheckbox,
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
type Story = StoryObj<typeof CustomCheckbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Invalid checkbox',
    variant: 'error',
    error: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    variant: 'disabled',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked checkbox',
    variant: 'disabled',
    disabled: true,
    checked: true,
  },
};

export const WithLongLabel: Story = {
  args: {
    label: 'This is a very long label that demonstrates how the checkbox handles wrapping text. It should wrap nicely and maintain proper alignment with the checkbox.',
  },
};

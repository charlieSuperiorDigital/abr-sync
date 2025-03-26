import type { Meta, StoryObj } from '@storybook/react';
import {
  CustomRadioGroup,
  CustomRadioGroupItem,
} from '@/components/custom-components/custom-radio-button/custom-radio-button';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof CustomRadioGroup> = {
  title: 'Components/CustomRadioButton',
  component: CustomRadioGroup,
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
type Story = StoryObj<typeof CustomRadioGroup>;

export const Default: Story = {
  render: () => (
    <CustomRadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <CustomRadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <CustomRadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <CustomRadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </CustomRadioGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <CustomRadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <CustomRadioGroupItem value="option-1" id="error-1" variant="error" />
        <Label htmlFor="error-1">Error Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <CustomRadioGroupItem value="option-2" id="error-2" variant="error" />
        <Label htmlFor="error-2">Error Option 2</Label>
      </div>
    </CustomRadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <CustomRadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <CustomRadioGroupItem
          value="option-1"
          id="disabled-1"
          variant="disabled"
          disabled
        />
        <Label htmlFor="disabled-1" className="text-gray-400">
          Disabled Option 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <CustomRadioGroupItem
          value="option-2"
          id="disabled-2"
          variant="disabled"
          disabled
        />
        <Label htmlFor="disabled-2" className="text-gray-400">
          Disabled Option 2
        </Label>
      </div>
    </CustomRadioGroup>
  ),
};

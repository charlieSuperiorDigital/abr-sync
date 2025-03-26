import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from '@/components/custom-components/color-picker/custom-color-picker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {
    rowCount: 3,
  },
};

export const SingleRow: Story = {
  args: {
    rowCount: 1,
  },
};

export const WithDefaultSelections: Story = {
  args: {
    rowCount: 3,
    defaultSelections: ['blue', 'red', 'green'],
  },
};

export const ManyRows: Story = {
  args: {
    rowCount: 7,
  },
};

// Interactive example with onChange handler
export const WithChangeHandler: Story = {
  args: {
    rowCount: 3,
    onChange: (rowIndex: number, colorId: string) => {
      console.log(`Row ${rowIndex} changed to color: ${colorId}`);
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { CustomSelect } from '@/components/custom-components/selects/custom-select';

const meta: Meta<typeof CustomSelect> = {
  title: 'Components/CustomSelect',
  component: CustomSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CustomSelect>;

const sampleOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
];

const sampleOptionsWithAvatars = [
  { value: '1', label: 'John Doe', avatar: 'https://github.com/shadcn.png' },
  { value: '2', label: 'Jane Smith', avatar: 'https://github.com/shadcn.png' },
  { value: '3', label: 'Bob Johnson', avatar: 'https://github.com/shadcn.png' },
];

export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    options: sampleOptions,
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Select an option',
    options: sampleOptions,
    value: ['1'],
  },
};

export const MultiSelect: Story = {
  args: {
    placeholder: 'Select multiple options',
    options: sampleOptions,
    multiSelect: true,
  },
};

export const MultiSelectWithValues: Story = {
  args: {
    placeholder: 'Select multiple options',
    options: sampleOptions,
    multiSelect: true,
    value: ['1', '3'],
  },
};

export const WithAvatars: Story = {
  args: {
    placeholder: 'Select a user',
    options: sampleOptionsWithAvatars,
  },
};

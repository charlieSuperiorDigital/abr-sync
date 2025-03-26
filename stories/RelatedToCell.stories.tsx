import type { Meta, StoryObj } from '@storybook/react';
import { RelatedToCell } from '@/components/custom-components/custom-table/table-cells';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof RelatedToCell> = {
  title: 'Components/Table Cells/RelatedToCell',
  component: RelatedToCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center ">
        <Story/>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RelatedToCell>;

export const SingleRelation: Story = {
  args: {
    relatedObjects: [
      {
        type: 'opportunity',
        id: 'OPP123456',
      },
    ],
  },
};

export const MultipleRelations: Story = {
  args: {
    relatedObjects: [
      {
        type: 'opportunity',
        id: 'OPP123456',
      },
      {
        type: 'opportunity',
        id: 'OPP789012',
      },
      {
        type: 'opportunity',
        id: 'OPP345678',
      },
    ],
  },
};

export const NoRelations: Story = {
  args: {
    relatedObjects: [],
  },
};

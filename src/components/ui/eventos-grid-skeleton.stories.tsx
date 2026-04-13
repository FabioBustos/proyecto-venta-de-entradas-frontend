import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './skeleton'
import { EventosGridSkeleton } from './eventos-grid-skeleton'

const meta = {
  title: 'UI/EventosGridSkeleton',
  component: EventosGridSkeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Skeleton loader para el grid de eventos. Muestra placeholders mientras cargan los eventos.',
      },
    },
  },
} satisfies Meta<typeof EventosGridSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <EventosGridSkeleton />,
}
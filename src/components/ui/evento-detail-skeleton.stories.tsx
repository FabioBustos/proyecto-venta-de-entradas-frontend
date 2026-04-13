import type { Meta, StoryObj } from '@storybook/react'
import { EventoDetailSkeleton } from './evento-detail-skeleton'

const meta = {
  title: 'UI/EventoDetailSkeleton',
  component: EventoDetailSkeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Skeleton loader para la página de detalle de evento. Placeholder visual mientras carga.',
      },
    },
  },
} satisfies Meta<typeof EventoDetailSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <EventoDetailSkeleton />,
}
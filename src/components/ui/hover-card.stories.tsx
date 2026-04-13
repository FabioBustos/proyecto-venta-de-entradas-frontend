import type { Meta, StoryObj } from '@storybook/react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'

const meta = {
  title: 'UI/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Card que aparece en hover. Componentes: HoverCard, HoverCardTrigger, HoverCardContent. Basado en Radix UI.',
      },
    },
  },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button>@username</button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p>User information appears here.</p>
      </HoverCardContent>
    </HoverCard>
  ),
}
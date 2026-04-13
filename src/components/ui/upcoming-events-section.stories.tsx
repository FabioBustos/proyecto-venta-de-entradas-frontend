import type { Meta, StoryObj } from '@storybook/react'
import { UpcomingEventsSection } from './upcoming-events-section'

const meta = {
  title: 'UI/UpcomingEventsSection',
  component: UpcomingEventsSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Sección que muestra eventos próximos. Incluye carousel o grid de EventCards.',
      },
    },
  },
} satisfies Meta<typeof UpcomingEventsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <UpcomingEventsSection />,
}
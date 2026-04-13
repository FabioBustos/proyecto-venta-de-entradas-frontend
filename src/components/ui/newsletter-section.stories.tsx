import type { Meta, StoryObj } from '@storybook/react'
import { NewsletterSection } from './newsletter-section'

const meta = {
  title: 'UI/NewsletterSection',
  component: NewsletterSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Sección para suscripción a newsletter. Incluye input de email y botón de enviar.',
      },
    },
  },
} satisfies Meta<typeof NewsletterSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <NewsletterSection />,
}
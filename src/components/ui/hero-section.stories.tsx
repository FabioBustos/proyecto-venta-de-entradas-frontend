import type { Meta, StoryObj } from '@storybook/react'
import { HeroSection } from './hero-section'

const meta = {
  title: 'UI/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Sección hero para la página principal. Incluye título, descripción, CTA y fondo visual.',
      },
    },
  },
} satisfies Meta<typeof HeroSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <HeroSection />,
}
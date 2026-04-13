import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './footer'

const meta = {
  title: 'UI/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Pie de página con enlaces a secciones, redes sociales, newsletter y copyright. Diseño fijo en la parte inferior.',
      },
    },
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Footer />,
}
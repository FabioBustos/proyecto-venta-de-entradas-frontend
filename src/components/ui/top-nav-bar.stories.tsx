import type { Meta, StoryObj } from '@storybook/react'
import { TopNavBar } from './top-nav-bar'

const meta = {
  title: 'UI/TopNavBar',
  component: TopNavBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Barra de navegación superior fija. Incluye logo, búsqueda, menú y botón de usuario. Visible en desktop.',
      },
    },
  },
} satisfies Meta<typeof TopNavBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TopNavBar />,
}
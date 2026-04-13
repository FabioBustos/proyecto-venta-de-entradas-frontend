import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './sidebar'

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Barra lateral para navegación. Puede ser collapsible, contiene menu de categorías y filtros.',
      },
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Sidebar />,
}
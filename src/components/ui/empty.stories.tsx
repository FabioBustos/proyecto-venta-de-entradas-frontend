import type { Meta, StoryObj } from '@storybook/react'
import { Empty } from './empty'

const meta = {
  title: 'UI/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Componente para mostrar cuando no hay contenido. Props: title, description, children. Uso: listas vacías, sin resultados.',
      },
    },
  },
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Empty>No results found</Empty>,
}

export const WithDescription: Story = {
  render: () => (
    <Empty
      title="No events"
      description="There are no events available at the moment."
    />
  ),
}
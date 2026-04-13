import type { Meta, StoryObj } from '@storybook/react'
import { Kbd } from './kbd'

const meta = {
  title: 'UI/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Componente para mostrar teclas del teclado. Uso: atajos de teclado, documentación de comandos.',
      },
    },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Ctrl',
  },
}

export const Shortcuts: Story = {
  render: () => (
    <div className="flex gap-2">
      <Kbd>Ctrl</Kbd>
      <Kbd>+</Kbd>
      <Kbd>C</Kbd>
    </div>
  ),
}

export const WithCommand: Story = {
  render: () => (
    <div className="flex gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
}
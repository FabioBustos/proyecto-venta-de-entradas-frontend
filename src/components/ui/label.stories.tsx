import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'

const meta = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Etiqueta para inputs. Mejora accesibilidad. Forzando click en el input asociado. Basado en Radix UI.',
      },
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Label>Label text</Label>,
}

export const ForInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <input id="email" type="email" placeholder="user@example.com" />
    </div>
  ),
}
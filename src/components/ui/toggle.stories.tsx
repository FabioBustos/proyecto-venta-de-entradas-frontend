import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './toggle'

const meta = {
  title: 'UI/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Button toggle on/off. Similar a Switch pero con estilo de botón. Props: pressed, onPressedChange, disabled.',
      },
    },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Toggle',
  },
}

export const Pressed: Story = {
  args: {
    children: 'Toggle',
    pressed: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}
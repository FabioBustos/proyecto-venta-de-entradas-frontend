import type { Meta, StoryObj } from '@storybook/react'
import { Toast } from './toast'
import { Toaster } from './toaster'
import { useToast } from './use-toast'

const meta = {
  title: 'UI/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Notificaciones toast temporales. Usa useToast hook para mostrar. Variantes: default, destructive.',
      },
    },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Toaster />,
}

export const Success: Story = {
  render: () => (
    <Toaster toast={{ title: 'Success', description: 'Event created successfully', variant: 'default' }} />
  ),
}

export const Error: Story = {
  render: () => (
    <Toaster toast={{ title: 'Error', description: 'Something went wrong', variant: 'destructive' }} />
  ),
}
import type { Meta, StoryObj } from '@storybook/react'
import { Toaster as SonnerToaster } from './sonner'

const meta = {
  title: 'UI/Sonner',
  component: SonnerToaster,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Toaster de notificaciones basado en Sonner. Notificaciones toast elegantes con animaciones. Uso: Toaster debe estar en el root de la app.',
      },
    },
  },
} satisfies Meta<typeof SonnerToaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SonnerToaster />,
}
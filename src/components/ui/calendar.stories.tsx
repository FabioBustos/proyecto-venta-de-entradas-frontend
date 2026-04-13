import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { Calendar } from './calendar'

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Calendario interactivo basado en react-day-picker. Props: mode (single, multiple, range), selected, onSelect, disabled, fromDate, toDate.',
      },
    },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const form = useForm()
    return (
      <form>
        <Calendar form={form} mode="single" />
      </form>
    )
  },
}
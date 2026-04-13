import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './separator'

const meta = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Línea divisoria visual. Prop: orientation (horizontal | vertical). Usa role="separator" para accesibilidad.',
      },
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Separator />,
}

export const Horizontal: Story = {
  render: () => <Separator className="w-[200px]" />,
}

export const Vertical: Story = {
  render: () => (
    <div className="h-[200px]">
      <Separator orientation="vertical" />
    </div>
  ),
}
import type { Meta, StoryObj } from '@storybook/react'
import { ChartContainer } from './chart'

const meta = {
  title: 'UI/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Contenedor de gráficos basado en Recharts. Proporciona theming y config para charts. Usa ChartConfig para definir colores.',
      },
    },
  },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

const config = {
  visitors: { label: 'Visitors' },
}

export const Default: Story = {
  render: () => (
    <ChartContainer config={config} className="min-h-[200px] w-full max-w-md">
      <p className="text-sm text-muted-foreground">Chart content</p>
    </ChartContainer>
  ),
}
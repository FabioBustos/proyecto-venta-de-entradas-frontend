import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './progress'

const meta = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Barra de progreso para mostrar el avance de una operación.\n\n## Uso\n- Mostrar porcentaje de entradas vendidas\n- Carga de archivos\n- Progreso de configuración\n- Estadísticas\n\n## Props\n- **value**: Valor actual (0-100)\n- **max**: Valor máximo (default: 100)\n- **getValueLabel**: Función para label personalizado\n\n## Import\n\`\`\`tsx\nimport { Progress } from '@/components/ui/progress'\n\`\`\``,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Valor actual (0-100)',
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 50,
  },
}

export const Zero: Story = {
  args: {
    value: 0,
  },
}

export const Complete: Story = {
  args: {
    value: 100,
  },
}

export const VariousValues: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
      <div>
        <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>25%</label>
        <Progress value={25} />
      </div>
      <div>
        <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>50%</label>
        <Progress value={50} />
      </div>
      <div>
        <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>75%</label>
        <Progress value={75} />
      </div>
      <div>
        <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>100%</label>
        <Progress value={100} />
      </div>
    </div>
  ),
}

export const TicketSales: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px' }}>General</span>
          <span style={{ fontSize: '14px', opacity: 0.7 }}>350/500</span>
        </div>
        <Progress value={70} />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px' }}>VIP</span>
          <span style={{ fontSize: '14px', opacity: 0.7 }}>80/100</span>
        </div>
        <Progress value={80} />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px' }}>Preferencia</span>
          <span style={{ fontSize: '14px', opacity: 0.7 }}>20/200</span>
        </div>
        <Progress value={10} />
      </div>
    </div>
  ),
}
import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './spinner'

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Indicador de carga animado con animación de giro.\n\n## Uso\n- Loading de contenido\n- Estados de carga\n- Esperando respuesta del servidor\n- spinners de botones\n\n## Personalización\nUsa clases de Tailwind para el tamaño:\n- **h-4 w-4**: Pequeño\n- **h-6 w-6**: Mediano (default)\n- **h-8 w-8**: Grande\n- **h-12 w-12**: Extra grande\n\n## Import\n\`\`\`tsx\nimport { Spinner } from '@/components/ui/spinner'\n\`\`\`\n\n## Ejemplo con botón\n\`\`\`tsx\n<Button disabled>\n  <Spinner className=\"h-4 w-4 mr-2\" />\n  Cargando...\n</Button>\n\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Spinner />,
}

export const Small: Story = {
  render: () => <Spinner className="h-4 w-4" />,
}

export const Large: Story = {
  render: () => <Spinner className="h-12 w-12" />,
}

export const WithText: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spinner className="h-5 w-5" />
      <span style={{ fontSize: '14px' }}>Cargando...</span>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner className="h-4 w-4" />
        <span style={{ fontSize: '12px' }}>Small</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner className="h-6 w-6" />
        <span style={{ fontSize: '12px' }}>Default</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner className="h-8 w-8" />
        <span style={{ fontSize: '12px' }}>Large</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Spinner className="h-12 w-12" />
        <span style={{ fontSize: '12px' }}>XL</span>
      </div>
    </div>
  ),
}
import type { Meta, StoryObj } from '@storybook/react'
import { Badge, badgeVariants } from './badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente de etiqueta pequeña para mostrar estados, categorías o contadores.\n\n## Uso\n- Estados de eventos (disponible, vendido, agotado)\n- Categorías de eventos\n- Notificaciones\n- Contadores\n- Labels de precios\n\n## Props\n- **variant**: Variante visual (default, secondary, destructive, outline)\n- **asChild**: Renderizar como Slot de Radix UI\n\n## Import\n\`\`\`tsx\nimport { Badge, badgeVariants } from '@/components/ui/badge'\n\`\`\`\n\n## Ejemplo con variantes CSS\n\`\`\`tsx\n<span className={badgeVariants({ variant: 'destructive' })}>Sold Out</span>\n\`\`\``,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Variante visual del badge',
      table: {
        type: { summary: "'default' | 'secondary' | 'destructive' | 'outline'" },
        defaultValue: { summary: "'default'" },
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const EventStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="default">Disponible</Badge>
      <Badge variant="secondary">Próximamente</Badge>
      <Badge variant="destructive">Agotado</Badge>
      <Badge variant="outline">Cancelado</Badge>
    </div>
  ),
}

export const Category: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="outline">Rock</Badge>
      <Badge variant="outline">Pop</Badge>
      <Badge variant="outline">Jazz</Badge>
      <Badge variant="outline">Electrónica</Badge>
    </div>
  ),
}

export const Price: Story = {
  render: () => (
    <Badge variant="default" style={{ fontSize: '16px', padding: '4px 12px' }}>$50.00</Badge>
  ),
}
import type { Meta, StoryObj } from '@storybook/react'
import { Button, buttonVariants } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente de botón interactivo con múltiples variantes de estilo.\n\n## Uso\n- Acciones principales en formularios\n- Envío de datos\n- Navegación\n- Acciones de confirmación\n\n## Props\n- **variant**: Variante visual (default, destructive, outline, secondary, ghost, link)\n- **size**: Tamaño del botón (default, sm, lg, icon, icon-sm, icon-lg)\n- **disabled**: Estado deshabilitado\n- **asChild**: Renderizar como hijo de Slot (para componentes compuestos)\n\n## Import\n\`\`\`tsx\nimport { Button, buttonVariants } from '@/components/ui/button'\n\`\`\`\n\n## Ejemplo con variantes CSS\n\`\`\`tsx\n// Usar clases de variantes directamente\n<button className={buttonVariants({ variant: 'outline', size: 'lg' })}>\n  Click me\n</button>\n\`\`\``,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Variante visual del botón',
      table: {
        type: { summary: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
      description: 'Tamaño del botón',
      table: {
        type: { summary: "'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'" },
        defaultValue: { summary: "'default'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado del botón',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Renderizar como Slot de Radix UI para componentes compuestos',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
    size: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
}

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const IconButton: Story = {
  args: {
    size: 'icon',
    variant: 'default',
    children: '+',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon-sm">+</Button>
      <Button size="icon">+</Button>
      <Button size="icon-lg">+</Button>
    </div>
  ),
}
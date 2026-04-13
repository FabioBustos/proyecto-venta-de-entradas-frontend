import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente de campo de texto input para formularios.\n\n## Uso\n- Entrada de texto en formularios\n- Campos de búsqueda\n- Inputs con validación\n\n## Props\n- **type**: Tipo de input (text, password, email, number, etc.)\n- **placeholder**: Texto de marcador de posición\n- **disabled**: Estado deshabilitado\n- **value**: Valor controlado\n- **onChange**: Handler de cambio\n- **className**: Clases CSS adicionales\n\n## Import\n\`\`\`tsx\nimport { Input } from '@/components/ui/input'\n\`\`\``,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date'],
      description: 'Tipo de input HTML',
      table: {
        type: { summary: "'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date'" },
        defaultValue: { summary: "'text'" },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Texto de marcador de posición',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '300px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500 }}>Email</label>
      <Input type="email" placeholder="user@example.com" />
    </div>
  ),
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
}

export const WithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '300px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500 }}>Email</label>
      <Input type="email" placeholder="your@email.com" aria-invalid="true" />
      <span style={{ fontSize: '12px', color: '#ef4444' }}>Please enter a valid email</span>
    </div>
  ),
}
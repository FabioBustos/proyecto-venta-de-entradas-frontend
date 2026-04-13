import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente de entrada de texto multilínea.\n\n## Uso\n- Campos de descripción largos\n- Comentarios\n- Mensajes\n- Bio/perfiles\n\n## Props\n- **placeholder**: Texto de marcador\n- **disabled**: Estado deshabilitado\n- **value**: Valor controlado\n- **onChange**: Handler de cambio\n- **rows**: Número de filas\n- **className**: Clases adicionales\n\n## Import\n\`\`\`tsx\nimport { Textarea } from '@/components/ui/textarea'\n\`\`\``,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Texto de marcador',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
    rows: {
      control: 'number',
      description: 'Número de filas',
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px' }}>
      <label style={{ fontSize: '14px', fontWeight: 500 }}>Description</label>
      <Textarea placeholder="Tell us about your event..." />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
}

export const WithRows: Story = {
  args: {
    placeholder: 'Enter a long description...',
    rows: 6,
  },
}

export const WithValue: Story = {
  args: {
    value: 'This is a pre-filled textarea with some content that was previously saved.',
  },
}
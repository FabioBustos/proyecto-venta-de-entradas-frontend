import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Casilla de verificación basada en Radix UI.\n\n## Uso\n- Aceptar términos y condiciones\n- Seleccionar múltiples opciones\n- Filtros\n- Tareas pendientes\n\n## Props\n- **checked**: Estado controlado\n- **onCheckedChange**: Callback al cambiar\n- **disabled**: Estado deshabilitado\n- **id**: ID para accesibilidad\n- **indeterminate**: Estado parcialmente seleccionado\n\n## Import\n\`\`\`tsx\nimport { Checkbox } from '@/components/ui/checkbox'\n\`\`\`\n\n## Ejemplo\n\`\`\`tsx\n<Checkbox \n  checked={accepted}\n  onCheckedChange={setAccepted}\n/>\n<label htmlFor=\"terms\">Acepto los términos</label>\n\`\`\``,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Estado del checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'checkbox',
  },
}

export const Checked: Story = {
  args: {
    id: 'checkbox-checked',
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    id: 'checkbox-disabled',
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Checkbox id="terms" />
      <label htmlFor="terms" style={{ fontSize: '14px' }}>Accept terms and conditions</label>
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox id="newsletter" defaultChecked />
        <label htmlFor="newsletter" style={{ fontSize: '14px' }}>Suscribirse al newsletter</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox id="offers" />
        <label htmlFor="offers" style={{ fontSize: '14px' }}>Recibir ofertas de eventos</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox id="terms" defaultChecked />
        <label htmlFor="terms" style={{ fontSize: '14px' }}>Aceptar términos y condiciones</label>
      </div>
    </div>
  ),
}
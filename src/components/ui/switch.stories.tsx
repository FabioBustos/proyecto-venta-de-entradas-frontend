import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './switch'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Interruptor de palanca (toggle) basado en Radix UI.\n\n## Uso\n- Activar/desactivar notificaciones\n- Configuración de usuario\n- Filtros\n- Modo oscuro\n\n## Props\n- **checked**: Estado controlado\n- **onCheckedChange**: Callback al cambiar\n- **disabled**: Estado deshabilitado\n- **id**: ID para accesibilidad\n\n## Import\n\`\`\`tsx\nimport { Switch } from '@/components/ui/switch'\n\`\`\`\n\n## Ejemplo\n\`\`\`tsx\n<Switch \n  checked={notifications}\n  onCheckedChange={setNotifications}\n/>\n<label htmlFor=\"notifications\">Notificaciones</label>\n\`\`\``,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Estado del switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'switch',
  },
}

export const Checked: Story = {
  args: {
    id: 'switch-checked',
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    id: 'switch-disabled',
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Switch id="notifications" />
      <label htmlFor="notifications" style={{ fontSize: '14px' }}>Enable notifications</label>
    </div>
  ),
}

export const Settings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '250px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor="email" style={{ fontSize: '14px' }}>Email notifications</label>
        <Switch id="email" defaultChecked />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor="push" style={{ fontSize: '14px' }}>Push notifications</label>
        <Switch id="push" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor="sms" style={{ fontSize: '14px' }}>SMS alerts</label>
        <Switch id="sms" disabled />
      </div>
    </div>
  ),
}
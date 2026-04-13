import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente de pestañas basado en Radix UI para organizar contenido.\n\n## Componentes\n- **Tabs**: Contenedor principal\n- **TabsList**: Contenedor de los triggers\n- **TabsTrigger**: Botón de cada pestaña\n- **TabsContent**: Contenido de cada pestaña\n\n## Uso\n- Alternar entre vistas\n- Secciones de configuración\n- Categorías de contenido\n- Wizard de varios pasos\n\n## Props\n- **defaultValue**: Pestaña inicial\n- **value**: Valor controlado\n- **onValueChange**: Callback al cambiar\n\n## Import\n\`\`\`tsx\nimport { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'\n\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{ width: '100%', maxWidth: '400px' }}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" style={{ padding: '16px 0' }}>
        <p>Account settings content</p>
      </TabsContent>
      <TabsContent value="password" style={{ padding: '16px 0' }}>
        <p>Password settings content</p>
      </TabsContent>
    </Tabs>
  ),
}

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="events" style={{ width: '100%', maxWidth: '500px' }}>
      <TabsList>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="venues">Venues</TabsTrigger>
        <TabsTrigger value="organizers">Organizers</TabsTrigger>
      </TabsList>
      <TabsContent value="events" style={{ padding: '16px 0' }}>
        <p>List of events</p>
      </TabsContent>
      <TabsContent value="venues" style={{ padding: '16px 0' }}>
        <p>List of venues</p>
      </TabsContent>
      <TabsContent value="organizers" style={{ padding: '16px 0' }}>
        <p>List of organizers</p>
      </TabsContent>
    </Tabs>
  ),
}

export const EventDetails: Story = {
  render: () => (
    <Tabs defaultValue="info" style={{ width: '100%', maxWidth: '600px' }}>
      <TabsList>
        <TabsTrigger value="info">Información</TabsTrigger>
        <TabsTrigger value="tickets">Entradas</TabsTrigger>
        <TabsTrigger value="location">Ubicación</TabsTrigger>
      </TabsList>
      <TabsContent value="info" style={{ padding: '16px 0' }}>
        <h3>Información del Evento</h3>
        <p>Detalles completos sobre el evento...</p>
      </TabsContent>
      <TabsContent value="tickets" style={{ padding: '16px 0' }}>
        <h3>Tipos de Entrada</h3>
        <p>VIP, General, Preferencia...</p>
      </TabsContent>
      <TabsContent value="location" style={{ padding: '16px 0' }}>
        <h3>Ubicación</h3>
        <p>Dirección y mapa del lugar...</p>
      </TabsContent>
    </Tabs>
  ),
}
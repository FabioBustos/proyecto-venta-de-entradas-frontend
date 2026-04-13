import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from './card'
import { Button } from './button'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente de tarjeta reutilizable para mostrar contenido relacionado.\n\n## Componentes hijos\n- **Card**: Contenedor principal\n- **CardHeader**: Encabezado con estructura de grid\n- **CardTitle**: Título de la tarjeta\n- **CardDescription**: Descripción secundaria\n- **CardAction**: Botón de acción en el header\n- **CardContent**: Contenido principal\n- **CardFooter**: Pie de tarjeta para acciones\n\n## Uso\n- Mostrar información de eventos\n- Tarjetas de productos\n- Paneles de información\n- Contenedores de formularios\n\n## Import\n\`\`\`tsx\nimport { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'\n\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card style={{ width: '100%', maxWidth: '400px' }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '14px' }}>This is the card content.</p>
      </CardContent>
      <CardFooter>
        <p style={{ fontSize: '12px', opacity: 0.6 }}>Card footer</p>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card style={{ width: '100%', maxWidth: '400px', padding: '1.5rem' }}>
      <h3 style={{ fontWeight: 600 }}>Simple Card</h3>
      <p style={{ fontSize: '14px', opacity: 0.6, marginTop: '0.5rem' }}>
        This is a simple card without header/footer.
      </p>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card style={{ width: '100%', maxWidth: '400px' }}>
      <CardHeader>
        <CardTitle>Event Name</CardTitle>
        <CardDescription>Concierto de rock en vivo</CardDescription>
        <CardAction>
          <Button size="sm">Buy</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '14px' }}>Fecha: 15 de Junio 2024</p>
        <p style={{ fontSize: '14px' }}>Precio: $50.00</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" style={{ width: '100%' }}>View Details</Button>
      </CardFooter>
    </Card>
  ),
}

export const EventCard: Story = {
  render: () => (
    <Card style={{ width: '300px' }}>
      <div style={{ height: '150px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px 12px 0 0' }} />
      <CardHeader>
        <CardTitle>Rock en el Parque</CardTitle>
        <CardDescription>Concierto al aire libre</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: '13px', color: '#666' }}>📅 15 Jun 2024</p>
        <p style={{ fontSize: '13px', color: '#666' }}>📍 Parque Central</p>
        <p style={{ fontSize: '18px', fontWeight: 700, marginTop: '8px', color: '#22c55e' }}>$50.00</p>
      </CardContent>
      <CardFooter>
        <Button style={{ width: '100%' }}>Comprar Entrada</Button>
      </CardFooter>
    </Card>
  ),
}
import type { Meta, StoryObj } from '@storybook/react'
import { EventCard } from './event-card'
import type { Evento } from '@/types'

const meta = {
  title: 'UI/EventCard',
  component: EventCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Tarjeta interactiva para mostrar información de eventos con imagen, fecha, precio y botón de compra.\n\n## Características\n- Imagen del evento con Next.js Image\n- Badge de preventa (esPreVenta)\n- Fecha formateada (día + mes)\n- Indicador visual de entradas vendidas (barra de progreso)\n- Estado de \"Agotado\" cuando no hay entradas\n- Hover con efectos visuales\n- Botón de compra condicional\n\n## Tipos\n\`\`\`typescript\ninterface Evento {\n  id: string\n  titulo: string\n  descripcion?: string\n  fecha: string // ISO date\n  hora?: string\n  lugar: string\n  direccion?: string\n  precio: number\n  capacidad: number\n  entradasVendidas: number\n  categoria?: string\n  imagenUrl?: string\n  estado: 'borrador' | 'publicado' | 'cancelado'\n  esPreVenta?: boolean\n}\n\ninterface EventCardProps {\n  evento: Evento\n  className?: string\n  onComprar?: (evento: Evento) => void\n}\n\`\`\`\n\n## Uso\n\`\`\`tsx\nimport { EventCard } from '@/components/ui/event-card'\n\n<EventCard \n  evento={{\n    id: '1',\n    titulo: 'Concierto Rock',\n    fecha: '2024-12-15',\n    lugar: 'Estadio Nacional',\n    precio: 50,\n    capacidad: 1000,\n    entradasVendidas: 750,\n    estado: 'publicado'\n  }}\n  onComprar={(e) => console.log('Buy', e)}\n/>\n\`\`\``,
      },
    },
  },
} satisfies Meta<typeof EventCard>

export default meta
type Story = StoryObj<typeof meta>

const mockEvento: Evento = {
  id: '1',
  titulo: 'Tech Conference 2024',
  descripcion: 'The biggest tech event of the year',
  fecha: '2024-12-15T18:00:00Z',
  hora: '18:00',
  lugar: 'Convention Center',
  direccion: '123 Main St',
  precio: 99,
  capacidad: 500,
  entradasVendidas: 350,
  categoria: 'Conferencia',
  imagenUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80',
  estado: 'publicado',
  esPreVenta: false,
}

export const Default: Story = {
  args: {
    evento: mockEvento,
  },
}

export const SoldOut: Story = {
  args: {
    evento: {
      ...mockEvento,
      titulo: 'Sold Out Event',
      entradasVendidas: 500,
    },
  },
}

export const PreSale: Story = {
  args: {
    evento: {
      ...mockEvento,
      titulo: 'Pre-Sale Event',
      esPreVenta: true,
      entradasVendidas: 100,
    },
  },
}

export const AlmostSoldOut: Story = {
  args: {
    evento: {
      ...mockEvento,
      titulo: 'Almost Sold Out',
      entradasVendidas: 480,
    },
  },
}

export const FreeEvent: Story = {
  args: {
    evento: {
      ...mockEvento,
      titulo: 'Free Event',
      precio: 0,
      entradasVendidas: 50,
    },
  },
}
import type { Meta, StoryObj } from '@storybook/react'
import { EventCardStich } from './event-card-stich'
import type { Evento } from '@/types'

const meta = {
  title: 'UI/EventCardStich',
  component: EventCardStich,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta de evento con estilo Stitch (diseño específico). Variante visual diferente del EventCard estándar.',
      },
    },
  },
} satisfies Meta<typeof EventCardStich>

export default meta
type Story = StoryObj<typeof meta>

const mockEvento: Evento = {
  id: '1',
  titulo: 'Tech Conference',
  descripcion: 'Tech event',
  fecha: '2024-12-15T18:00:00Z',
  hora: '18:00',
  lugar: 'Center',
  direccion: '123 St',
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
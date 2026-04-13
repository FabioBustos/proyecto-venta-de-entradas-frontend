import type { Meta, StoryObj } from '@storybook/react'
import { EventCardCompact } from './event-card-compact'
import type { Evento } from '@/types'

const meta = {
  title: 'UI/EventCardCompact',
  component: EventCardCompact,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta de evento en formato compacto. Similar a EventCard pero con diseño más pequeño para listas densas.',
      },
    },
  },
} satisfies Meta<typeof EventCardCompact>

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
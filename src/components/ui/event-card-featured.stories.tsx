import type { Meta, StoryObj } from '@storybook/react'
import { EventCardFeatured } from './event-card-featured'
import type { Evento } from '@/types'

const meta = {
  title: 'UI/EventCardFeatured',
  component: EventCardFeatured,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta de evento destacada/featured. Mayor tamaño, diseño premium para eventos principales.',
      },
    },
  },
} satisfies Meta<typeof EventCardFeatured>

export default meta
type Story = StoryObj<typeof meta>

const mockEvento: Evento = {
  id: '1',
  titulo: 'Tech Conference 2024',
  descripcion: 'The biggest tech event',
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
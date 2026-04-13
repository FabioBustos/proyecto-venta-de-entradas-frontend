import type { Meta, StoryObj } from '@storybook/react'
import { EventosGrid } from './eventos-grid'
import type { Evento } from '@/types'

const meta = {
  title: 'UI/EventosGrid',
  component: EventosGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Grid de eventos que muestra múltiples EventCards. Props: eventos (Evento[]), loading, onLoadMore.',
      },
    },
  },
} satisfies Meta<typeof EventosGrid>

export default meta
type Story = StoryObj<typeof meta>

const mockEventos: Evento[] = [
  {
    id: '1',
    titulo: 'Tech Conference',
    descripcion: 'Tech event',
    fecha: '2024-12-15',
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
  },
  {
    id: '2',
    titulo: 'Music Festival',
    descripcion: 'Music event',
    fecha: '2024-12-20',
    hora: '20:00',
    lugar: 'Stadium',
    direccion: '456 Ave',
    precio: 150,
    capacidad: 1000,
    entradasVendidas: 800,
    categoria: 'Musica',
    imagenUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    estado: 'publicado',
    esPreVenta: false,
  },
]

export const Default: Story = {
  args: {
    eventos: mockEventos,
  },
}
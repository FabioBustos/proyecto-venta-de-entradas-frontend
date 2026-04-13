import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio } from './aspect-ratio'

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Contenedor con proporción aspect fixed. Mantiene relación ancho/alto. Uso: imágenes, videos, iframes responsive. Props: ratio (default 16/9).',
      },
    },
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={16 / 9}>
        <img src="https://picsum.photos/300/169" alt="16:9" />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={1}>
        <img src="https://picsum.photos/200/200" alt="1:1" />
      </AspectRatio>
    </div>
  ),
}
import type { Meta, StoryObj } from '@storybook/react'
import { CategoriesDisplaySection } from './categories-display-section'

const meta = {
  title: 'UI/CategoriesDisplaySection',
  component: CategoriesDisplaySection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Sección que muestra categorías de eventos. Acepta array de strings con nombres de categorías. Props: categorias (string[]).',
      },
    },
  },
} satisfies Meta<typeof CategoriesDisplaySection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    categorias: ['Conferencia', 'Musica', 'Teatro', 'Deportes'],
  },
}
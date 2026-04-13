import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from './scroll-area'

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Área con scroll personalizado. Añade scrollbar estilizado. Wrapper que contiene el contenido scrolleable.',
      },
    },
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-4">
        <p>Scroll down to see more content...</p>
        <p>Content item 1</p>
        <p>Content item 2</p>
        <p>Content item 3</p>
        <p>Content item 4</p>
        <p>Content item 5</p>
        <p>Content item 6</p>
        <p>End of content</p>
      </div>
    </ScrollArea>
  ),
}
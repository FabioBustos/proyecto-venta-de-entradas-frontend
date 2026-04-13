import type { Meta, StoryObj } from '@storybook/react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable'

const meta = {
  title: 'UI/Resizable',
  component: ResizablePanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Componente de paneles redimensionables. Uso: layouts con paneles ajustables, paneles laterales,Split views.',
      },
    },
  },
} satisfies Meta<typeof ResizablePanel>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30}>
        <div className="p-4">Left panel</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="p-4">Right panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={40}>
        <div className="p-4">Top panel</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="p-4">Bottom panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
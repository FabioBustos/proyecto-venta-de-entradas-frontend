import type { Meta, StoryObj } from '@storybook/react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer'

const meta = {
  title: 'UI/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Drawer mobile-first (sheet desde abajo). Componentes: Drawer, Trigger, Content, Header, Title, Description, Footer, Close. Basado en Vaul.',
      },
    },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <button>Open Drawer</button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Event</DrawerTitle>
          <DrawerDescription>Make changes to your event here.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
          <DrawerClose>Save</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
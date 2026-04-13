import type { Meta, StoryObj } from '@storybook/react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet'

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Panel lateral deslizante basado en Vaul. Uso: menus de navegación móvil, formularios, detalles. Prop: side (top, bottom, left, right).',
      },
    },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <button>Open Sheet</button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
          <SheetClose>Save changes</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <button>Open from right</button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Slide from right</SheetTitle>
          <SheetDescription>This sheet slides from the right side.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}
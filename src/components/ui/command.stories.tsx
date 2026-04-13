import type { Meta, StoryObj } from '@storybook/react'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './command'

const meta = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Comando tipo command palette (Cmd+K) basado en cmdk. Componentes: Command, Dialog, Input, List, Group, Item, Separator, Empty.',
      },
    },
  },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Events">
          <CommandItem>Tech Conference</CommandItem>
          <CommandItem>Music Festival</CommandItem>
          <CommandItem>Art Exhibition</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
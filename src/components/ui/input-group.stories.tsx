import type { Meta, StoryObj } from '@storybook/react'
import { InputGroup, InputGroupText, InputGroupButton, InputGroupAddon } from './input-group'
import { Input } from './input'

const meta = {
  title: 'UI/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Grupo de input con elementos adicionales. Componentes: InputGroup, InputGroupText, InputGroupButton, InputGroupAddon.',
      },
    },
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupText>@</InputGroupText>
      <Input placeholder="username" />
    </InputGroup>
  ),
}

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <Input placeholder="Search..." />
      <InputGroupButton>Search</InputGroupButton>
    </InputGroup>
  ),
}

export const WithAddon: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>https://</InputGroupAddon>
      <Input placeholder="example.com" />
      <InputGroupAddon>.com</InputGroupAddon>
    </InputGroup>
  ),
}

export const WithButtonBoth: Story = {
  render: () => (
    <InputGroup>
      <InputGroupButton variant="outline">$</InputGroupButton>
      <Input placeholder="0.00" />
      <InputGroupButton>USD</InputGroupButton>
    </InputGroup>
  ),
}
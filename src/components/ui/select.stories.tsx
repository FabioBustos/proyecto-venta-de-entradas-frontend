import type { Meta, StoryObj } from '@storybook/react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select'

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente de selección desplegable basado en Radix UI.\n\n## Componentes\n- **Select**: Contenedor principal\n- **SelectTrigger**: Botón que abre el select\n- **SelectValue**: Muestra el valor seleccionado\n- **SelectContent**: Contenedor de opciones\n- **SelectGroup**: Grupo de opciones\n- **SelectLabel**: Label para grupo\n- **SelectItem**: Opción individual\n\n## Uso\n- Selección de categorías\n- Filtros de búsqueda\n- Formularios\n\n## Props\n- **defaultValue**: Valor inicial\n- **value**: Valor controlado\n- **onValueChange**: Callback cuando cambia el valor\n- **disabled**: Estado deshabilitado\n- **required**: Campo requerido\n\n## Import\n\`\`\`tsx\nimport { \n  Select, SelectTrigger, SelectValue, SelectContent, \n  SelectItem, SelectGroup, SelectLabel \n} from '@/components/ui/select'\n\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger style={{ width: '200px' }}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithCategories: Story = {
  render: () => (
    <Select>
      <SelectTrigger style={{ width: '250px' }}>
        <SelectValue placeholder="Select an event" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Conferences</SelectLabel>
          <SelectItem value="tech">Tech Conference 2024</SelectItem>
          <SelectItem value="music">Music Festival</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Workshops</SelectLabel>
          <SelectItem value="design">Design Workshop</SelectItem>
          <SelectItem value="code">Coding Bootcamp</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger style={{ width: '200px' }} disabled>
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
    </Select>
  ),
}
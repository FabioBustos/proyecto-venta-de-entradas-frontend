import type { Meta, StoryObj } from '@storybook/react'
import { BottomNavBar } from './bottom-nav-bar'

const meta = {
  title: 'UI/BottomNavBar',
  component: BottomNavBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Barra de navegación inferior fija para dispositivos móviles.\n\n## Características\n- Navegación fija en la parte inferior de la pantalla\n- 4 enlaces: Explore, Search, Tickets, Profile\n- Se oculta automáticamente en pantallas medianas o mayores (md:hidden)\n- Usa blur y transparencia para el fondo\n- Usa iconos de Material Symbols\n\n## Uso\n- Navegación principal en la versión móvil de la app\n- Aparece solo en viewports menores a 768px (Tailwind: md)\n\n## Import\n\`\`\`tsx\nimport { BottomNavBar } from '@/components/ui/bottom-nav-bar'\n\`\`\`\n\n## Props\nNo acepta props - es un componente fijo con navegación hardcodeada.\nPara personalización, modificar el componente directamente.`,
      },
    },
  },
} satisfies Meta<typeof BottomNavBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', height: '200px', width: '100%', background: '#f5f5f5' }}>
      <BottomNavBar />
    </div>
  ),
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div style={{ position: 'relative', height: '200px', width: '100%', background: '#f5f5f5' }}>
      <BottomNavBar />
    </div>
  ),
}
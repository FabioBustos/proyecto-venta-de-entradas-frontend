import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Componente colapsable basado en Radix UI para mostrar contenido organizado.\n\n## Componentes\n- **Accordion**: Contenedor principal\n- **AccordionItem**: Cada sección\n- **AccordionTrigger**: Botón para expandir/colapsar\n- **AccordionContent**: Contenido de la sección\n\n## Tipos\n- **single**: Solo una sección abierta a la vez\n- **multiple**: Múltiples secciones abiertas\n\n## Uso\n- FAQs\n- Secciones de información\n- Configuración avanzada\n- Detalles de productos\n\n## Props\n- **type**: 'single' | 'multiple'\n- **collapsible**: Permite cerrar todos (solo type=\"single\")\n- **defaultValue**: Sección inicial abierta\n- **value**: Valor controlado\n\n## Import\n\`\`\`tsx\nimport { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'\n\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: '100%', maxWidth: '400px' }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is this event about?</AccordionTrigger>
        <AccordionContent>This is a tech conference event.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>When does it start?</AccordionTrigger>
        <AccordionContent>The event starts at 9:00 AM.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Where is it located?</AccordionTrigger>
        <AccordionContent>It is at the Convention Center.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" style={{ width: '100%', maxWidth: '400px' }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section 1</AccordionTrigger>
        <AccordionContent>Content for section 1.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section 2</AccordionTrigger>
        <AccordionContent>Content for section 2.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ width: '100%', maxWidth: '500px' }}>
      <AccordionItem value="faq-1">
        <AccordionTrigger>¿Cómo puedo comprar entradas?</AccordionTrigger>
        <AccordionContent>
          Selecciona el evento de tu interés, elige la cantidad de entradas y proceed al pago.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-2">
        <AccordionTrigger>¿Puedo obtener un reembolso?</AccordionTrigger>
        <AccordionContent>
          Los reembolsos están disponibles hasta 48 horas antes del evento. Consulta términos.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-3">
        <AccordionTrigger>¿Las entradas son transferibles?</AccordionTrigger>
        <AccordionContent>
          Sí, puedes transferir tus entradas a otra persona desde tu perfil.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
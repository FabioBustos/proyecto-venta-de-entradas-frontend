import type { Meta, StoryObj } from '@storybook/react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Button } from './button'

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Modal de diálogo basado en Radix UI para mostrar contenido superpuesto.\n\n## Componentes\n- **Dialog**: Contenedor principal\n- **DialogTrigger**: Botón que abre el diálogo\n- **DialogContent**: Contenido del diálogo\n- **DialogHeader**: Encabezado (title + description)\n- **DialogTitle**: Título del diálogo\n- **DialogDescription**: Descripción\n- **DialogFooter**: Pie con acciones\n- **DialogClose**: Botón para cerrar\n\n## Uso\n- Confirmaciones de acciones\n- Formularios modales\n- Alertas importantes\n--edición de contenido\n\n## Props\n- **open**: Estado controlado\n- **onOpenChange**: Callback al cambiar estado\n- **defaultOpen**: Estado inicial\n\n## Import\n\`\`\`tsx\nimport {\n  Dialog, DialogContent, DialogHeader, DialogTitle,\n  DialogDescription, DialogFooter, DialogTrigger, DialogClose\n} from '@/components/ui/dialog'\n\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <div style={{ padding: '16px 0' }}>
          <p style={{ fontSize: '14px' }}>This is the dialog content area.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
"use client"
import { Button } from "@/components/shadcn/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog"
import { cn } from "@/lib/shadcnUtils"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Eye, EyeOff, GripVertical, Settings } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback } from "./Avatar"

type FooterItem = {
  id: string
  altText: string
  img: string
}

type FooterCustomizeDialogProps = {
  items: FooterItem[]
  order: string[]
  hidden: string[]
  onReorder: (activeId: string, overId: string) => void
  onToggleHidden: (id: string) => void
  onReset: () => void
}

export default function FooterCustomizeDialog({
  items,
  order,
  hidden,
  onReorder,
  onToggleHidden,
  onReset,
}: FooterCustomizeDialogProps) {
  const itemsById = new Map(items.map((item) => [item.id, item]))
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Customize footer"
          className="flex shrink-0 items-center justify-center"
        >
          <Avatar className="size-11 bg-gray-400 p-1.5 dark:bg-neutral-600">
            <AvatarFallback className="bg-transparent">
              <Settings className="size-6 text-black" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-200">
            Customize Footer
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={order}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex flex-col gap-1">
                {order.map((id) => {
                  const item = itemsById.get(id)
                  if (!item) return null
                  return (
                    <FooterSortableRow
                      key={id}
                      item={item}
                      isHidden={hidden.includes(id)}
                      onToggleHidden={onToggleHidden}
                    />
                  )
                })}
              </ul>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onReset}>
            Reset to default
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type FooterSortableRowProps = {
  item: FooterItem
  isHidden: boolean
  onToggleHidden: (id: string) => void
}

function FooterSortableRow({
  item,
  isHidden,
  onToggleHidden,
}: FooterSortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-md border p-2 dark:bg-neutral-600",
        isHidden && "opacity-50",
      )}
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${item.altText}`}
        className="cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="text-muted-foreground size-4" />
      </button>

      <Image src={item.img} width={24} height={24} alt="" className="size-6" />

      <span className="flex-1 truncate text-sm font-semibold text-black">
        {item.altText}
      </span>

      <button
        type="button"
        aria-label={isHidden ? `Show ${item.altText}` : `Hide ${item.altText}`}
        onClick={() => onToggleHidden(item.id)}
      >
        {isHidden ? (
          <EyeOff className="text-muted-foreground size-4" />
        ) : (
          <Eye className="text-muted-foreground size-4" />
        )}
      </button>
    </li>
  )
}

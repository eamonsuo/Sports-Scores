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
import { Calendar, CalendarOff, Eye, EyeOff, GripVertical } from "lucide-react"
import Image from "next/image"
import { ReactNode } from "react"

export type CustomizeOrderItem = {
  id: string
  altText: string
  img: string
}

type CustomizeOrderDialogProps = {
  title: string
  // Omit to drive open state externally via `open`/`onOpenChange` instead.
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  items: CustomizeOrderItem[]
  order: string[]
  hidden: string[]
  onReorder: (activeId: string, overId: string) => void
  onToggleHidden: (id: string) => void
  onReset: () => void
  // Omit both to hide the "include in Today" toggle entirely (e.g. footer items).
  excludedFromToday?: string[]
  onToggleExcludedFromToday?: (id: string) => void
}

// Generic drag-to-reorder + show/hide dialog for a persisted order preference
// (footer icons, a sport's leagues, etc.).
export default function CustomizeOrderDialog({
  title,
  trigger,
  open,
  onOpenChange,
  items,
  order,
  hidden,
  onReorder,
  onToggleHidden,
  onReset,
  excludedFromToday,
  onToggleExcludedFromToday,
}: CustomizeOrderDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-200">{title}</DialogTitle>
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
                    <CustomizeOrderRow
                      key={id}
                      item={item}
                      isHidden={hidden.includes(id)}
                      onToggleHidden={onToggleHidden}
                      isExcludedFromToday={excludedFromToday?.includes(id)}
                      onToggleExcludedFromToday={onToggleExcludedFromToday}
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

type CustomizeOrderRowProps = {
  item: CustomizeOrderItem
  isHidden: boolean
  onToggleHidden: (id: string) => void
  // Undefined isExcludedFromToday/onToggleExcludedFromToday hides the Today toggle.
  isExcludedFromToday?: boolean
  onToggleExcludedFromToday?: (id: string) => void
}

function CustomizeOrderRow({
  item,
  isHidden,
  onToggleHidden,
  isExcludedFromToday,
  onToggleExcludedFromToday,
}: CustomizeOrderRowProps) {
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
        "flex touch-none items-center gap-2 rounded-md border p-2 select-none dark:bg-neutral-600",
        "cursor-grab active:cursor-grabbing",
        isHidden && "opacity-50",
      )}
      aria-label={`Drag to reorder ${item.altText}`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="text-muted-foreground size-4 shrink-0" />

      <Image src={item.img} width={24} height={24} alt="" className="size-6" />

      <span className="flex-1 truncate text-sm font-semibold text-black">
        {item.altText}
      </span>

      {onToggleExcludedFromToday && (
        <button
          type="button"
          aria-label={
            isExcludedFromToday
              ? `Show ${item.altText} on Today`
              : `Hide ${item.altText} from Today`
          }
          onClick={() => onToggleExcludedFromToday(item.id)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isExcludedFromToday ? (
            <CalendarOff className="text-muted-foreground size-4" />
          ) : (
            <Calendar className="text-muted-foreground size-4" />
          )}
        </button>
      )}

      <button
        type="button"
        aria-label={isHidden ? `Show ${item.altText}` : `Hide ${item.altText}`}
        onClick={() => onToggleHidden(item.id)}
        onPointerDown={(e) => e.stopPropagation()}
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

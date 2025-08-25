"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { closestCenter, DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DraggableImage } from "./draggable-image";
import type { productMultimedia } from "@/lib/database/schema";
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";

interface DragAndDropMediaProps {
  items: (typeof productMultimedia.$inferSelect)[];
  setItems: React.Dispatch<React.SetStateAction<(typeof productMultimedia.$inferSelect)[]>>;
  invalidate: () => unknown;
}

export function DragAndDropMedia({ items, setItems, invalidate }: DragAndDropMediaProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const dataIds = useMemo<UniqueIdentifier[]>(() => items.map((item: { id: UniqueIdentifier }) => item.id), [items]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (active && over && active.id !== over.id) {
      setItems((data: typeof items) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const activeItem = activeId ? items.find((item: { id: UniqueIdentifier }) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={dataIds} strategy={rectSortingStrategy}>
        {items.map((item, index) => (
          <DraggableImage key={item.id} productImage={{ ...item, order: index + 1 }} invalidate={invalidate} />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <div className="relative size-full scale-105 overflow-hidden rounded-2xl opacity-95 shadow-lg">
            <div className="bg-secondary text-secondary-foreground absolute top-2 left-2 z-10 rounded-md px-2 py-1 text-xs font-semibold select-none">
              {activeItem.order}
            </div>
            <Image src={activeItem.url} fill={true} alt="" className="object-cover" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

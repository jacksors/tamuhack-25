"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PriorityItemProps {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export function PriorityItem({
  id,
  label,
  description,
  icon,
}: PriorityItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? "bg-primary/5 shadow-lg" : "hover:bg-muted/50"}`}
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-1 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="font-medium">{label}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </Card>
  );
}

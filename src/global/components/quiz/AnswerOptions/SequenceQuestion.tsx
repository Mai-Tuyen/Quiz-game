"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SequenceItem {
  id: string;
  text: string;
  correct_order: number;
}

interface SequenceQuestionProps {
  questionData: {
    items: SequenceItem[];
    scoring?: "partial" | "all_or_nothing";
    shuffle_items?: boolean;
  };
  answer: SequenceItem[] | null;
  onAnswerChange: (answer: SequenceItem[]) => void;
}

function SortableItem({ item, index }: { item: SequenceItem; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border-2 border-gray-200 rounded-lg p-4 cursor-grab active:cursor-grabbing ${
        isDragging
          ? "opacity-50 shadow-lg"
          : "hover:border-gray-300 hover:shadow-md"
      } transition-all duration-200`}
      whileHover={isDragging ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div className="text-gray-400 hover:text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>

        {/* Position Number */}
        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </div>

        {/* Item Text */}
        <div className="flex-1 text-gray-900 font-medium">{item.text}</div>

        {/* Grip Lines */}
        <div className="flex flex-col gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-4 h-0.5 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SequenceQuestion({
  questionData,
  answer,
  onAnswerChange,
}: SequenceQuestionProps) {
  const { items, shuffle_items = true } = questionData;
  const [orderedItems, setOrderedItems] = useState<SequenceItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (answer && answer.length > 0) {
      setOrderedItems(answer);
    } else {
      // Initialize with shuffled items if needed
      const initialItems = [...items];
      if (shuffle_items) {
        for (let i = initialItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [initialItems[i], initialItems[j]] = [
            initialItems[j],
            initialItems[i],
          ];
        }
      }
      setOrderedItems(initialItems);
      onAnswerChange(initialItems);
    }
  }, [items, shuffle_items, answer, onAnswerChange]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = orderedItems.findIndex((item) => item.id === active.id);
      const newIndex = orderedItems.findIndex((item) => item.id === over?.id);

      const newOrderedItems = arrayMove(orderedItems, oldIndex, newIndex);
      setOrderedItems(newOrderedItems);
      onAnswerChange(newOrderedItems);
    }
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-amber-50 border border-amber-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
          <div className="text-sm text-amber-800">
            <p className="font-medium">
              Drag and drop to arrange in correct order
            </p>
            <p className="mt-1">
              Click and drag the items to reorder them. The first item should be
              at the top.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sortable List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <motion.div className="space-y-3" layout>
            {orderedItems.map((item, index) => (
              <SortableItem key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* Current Order Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
      >
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Current Order:
        </h4>
        <div className="text-sm text-gray-600">
          {orderedItems.map((item, index) => (
            <span key={item.id}>
              {index + 1}. {item.text}
              {index < orderedItems.length - 1 ? " → " : ""}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

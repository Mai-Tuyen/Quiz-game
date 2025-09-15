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
  DragOverlay,
  Active,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface WordBankItem {
  id: string;
  text: string;
}

interface BlankItem {
  id: string;
  position: number;
  correct_answers: string[];
}

interface DragZone {
  id: string;
  label: string;
  correct_items: string[];
}

interface DragWordQuestionProps {
  questionData: {
    // For fill-in-the-blank type
    sentence_template?: string;
    blanks?: BlankItem[];
    word_bank?: WordBankItem[];
    allow_reuse?: boolean;
    case_sensitive?: boolean;

    // For categorization type
    drag_zones?: DragZone[];
    draggable_items?: WordBankItem[];
    allow_multiple_per_zone?: boolean;
    shuffle_items?: boolean;
  };
  answer: any;
  onAnswerChange: (answer: any) => void;
}

function DraggableWord({
  item,
  isUsed = false,
}: {
  item: WordBankItem;
  isUsed?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: isUsed,
  });

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
      className={`inline-block px-3 py-2 rounded-lg border-2 text-sm font-medium cursor-grab active:cursor-grabbing ${
        isDragging
          ? "opacity-50 shadow-lg"
          : isUsed
          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-300"
      } transition-all duration-200`}
      whileHover={isDragging || isUsed ? undefined : { scale: 1.05 }}
      whileTap={isDragging || isUsed ? undefined : { scale: 0.95 }}
    >
      {item.text}
    </motion.div>
  );
}

function DropZone({
  zone,
  assignedItems,
  onDrop,
}: {
  zone: DragZone;
  assignedItems: WordBankItem[];
  onDrop: (zoneId: string) => void;
}) {
  const { setNodeRef, isOver } = useSortable({
    id: zone.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] p-4 border-2 border-dashed rounded-lg transition-all duration-200 ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
    >
      <h4 className="font-medium text-gray-700 mb-3">{zone.label}</h4>
      <div className="flex flex-wrap gap-2">
        {assignedItems.map((item) => (
          <div
            key={item.id}
            className="px-3 py-1 bg-green-100 border border-green-200 text-green-800 rounded-lg text-sm"
          >
            {item.text}
          </div>
        ))}
        {assignedItems.length === 0 && (
          <div className="text-gray-400 text-sm italic">Drop items here</div>
        )}
      </div>
    </div>
  );
}

export default function DragWordQuestion({
  questionData,
  answer,
  onAnswerChange,
}: DragWordQuestionProps) {
  const {
    sentence_template,
    blanks,
    word_bank,
    allow_reuse = false,
    drag_zones,
    draggable_items,
    allow_multiple_per_zone = false,
    shuffle_items = true,
  } = questionData;

  const [activeId, setActiveId] = useState<Active | null>(null);

  // For fill-in-the-blank type
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [availableWords, setAvailableWords] = useState<WordBankItem[]>([]);

  // For categorization type
  const [zoneAssignments, setZoneAssignments] = useState<
    Record<string, string[]>
  >({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (sentence_template && word_bank) {
      // Fill-in-the-blank setup
      if (answer?.answers) {
        const answerMap: Record<string, string> = {};
        answer.answers.forEach((ans: any) => {
          answerMap[ans.blank_id] = ans.word_text;
        });
        setBlankAnswers(answerMap);
      }

      const shuffledWords = shuffle_items
        ? [...word_bank].sort(() => Math.random() - 0.5)
        : [...word_bank];
      setAvailableWords(shuffledWords);
    } else if (drag_zones && draggable_items) {
      // Categorization setup
      if (answer?.zone_assignments) {
        const assignments: Record<string, string[]> = {};
        drag_zones.forEach((zone) => {
          assignments[zone.id] = [];
        });
        answer.zone_assignments.forEach((assignment: any) => {
          if (!assignments[assignment.zone_id])
            assignments[assignment.zone_id] = [];
          assignments[assignment.zone_id].push(assignment.item_id);
        });
        setZoneAssignments(assignments);
      } else {
        const initialAssignments: Record<string, string[]> = {};
        drag_zones.forEach((zone) => {
          initialAssignments[zone.id] = [];
        });
        setZoneAssignments(initialAssignments);
      }
    }
  }, [
    answer,
    sentence_template,
    word_bank,
    drag_zones,
    draggable_items,
    shuffle_items,
  ]);

  function handleDragStart(event: any) {
    setActiveId(event.active);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (sentence_template && blanks) {
      // Handle fill-in-the-blank
      const blankId = over.id as string;
      const wordItem = word_bank?.find((w) => w.id === active.id);

      if (wordItem && blanks.some((b) => b.id === blankId)) {
        const newBlankAnswers = { ...blankAnswers, [blankId]: wordItem.text };
        setBlankAnswers(newBlankAnswers);

        // Convert to answer format
        const answers = Object.entries(newBlankAnswers).map(
          ([blank_id, word_text]) => ({
            blank_id,
            word_id: word_bank?.find((w) => w.text === word_text)?.id,
            word_text,
          })
        );
        onAnswerChange({ answers });
      }
    } else if (drag_zones) {
      // Handle categorization
      const zoneId = over.id as string;
      const itemId = active.id as string;

      if (drag_zones.some((z) => z.id === zoneId)) {
        const newAssignments = { ...zoneAssignments };

        // Remove item from all zones first
        Object.keys(newAssignments).forEach((zone) => {
          newAssignments[zone] = newAssignments[zone].filter(
            (id) => id !== itemId
          );
        });

        // Add to new zone
        if (!newAssignments[zoneId]) newAssignments[zoneId] = [];
        newAssignments[zoneId].push(itemId);

        setZoneAssignments(newAssignments);

        // Convert to answer format
        const zone_assignments: any[] = [];
        Object.entries(newAssignments).forEach(([zone_id, item_ids]) => {
          item_ids.forEach((item_id) => {
            zone_assignments.push({ item_id, zone_id });
          });
        });
        onAnswerChange({ zone_assignments });
      }
    }
  }

  if (sentence_template && blanks && word_bank) {
    // Render fill-in-the-blank question
    const renderSentenceWithBlanks = () => {
      let parts = sentence_template.split(/(__BLANK\d+__)/);

      return parts.map((part, index) => {
        const blankMatch = part.match(/__BLANK(\d+)__/);
        if (blankMatch) {
          const blankId = `BLANK${blankMatch[1]}`;
          const blank = blanks.find((b) => b.id === blankId);

          if (blank) {
            return (
              <span
                key={index}
                className={`inline-block min-w-[100px] mx-1 px-3 py-1 border-b-2 border-dashed ${
                  blankAnswers[blankId]
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-gray-400 bg-gray-50 text-gray-500"
                } text-center`}
              >
                {blankAnswers[blankId] || "___"}
              </span>
            );
          }
        }
        return <span key={index}>{part}</span>;
      });
    };

    const usedWords = allow_reuse ? [] : Object.values(blankAnswers);

    return (
      <div className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Sentence with blanks */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-lg leading-relaxed">
              {renderSentenceWithBlanks()}
            </div>
          </div>

          {/* Word bank */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Word Bank</h4>
            <div className="flex flex-wrap gap-2">
              <SortableContext
                items={availableWords.map((w) => w.id)}
                strategy={horizontalListSortingStrategy}
              >
                {availableWords.map((word) => (
                  <DraggableWord
                    key={word.id}
                    item={word}
                    isUsed={!allow_reuse && usedWords.includes(word.text)}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg text-sm font-medium text-blue-800">
                {word_bank.find((w) => w.id === activeId.id)?.text}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    );
  }

  if (drag_zones && draggable_items) {
    // Render categorization question
    const unassignedItems = draggable_items.filter(
      (item) => !Object.values(zoneAssignments).flat().includes(item.id)
    );

    return (
      <div className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Drag zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drag_zones.map((zone) => {
              const assignedItems =
                zoneAssignments[zone.id]
                  ?.map(
                    (itemId) =>
                      draggable_items.find((item) => item.id === itemId)!
                  )
                  .filter(Boolean) || [];

              return (
                <DropZone
                  key={zone.id}
                  zone={zone}
                  assignedItems={assignedItems}
                  onDrop={(zoneId) => {}}
                />
              );
            })}
          </div>

          {/* Unassigned items */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Available Items</h4>
            <div className="flex flex-wrap gap-2">
              <SortableContext
                items={unassignedItems.map((item) => item.id)}
                strategy={horizontalListSortingStrategy}
              >
                {unassignedItems.map((item) => (
                  <DraggableWord key={item.id} item={item} />
                ))}
              </SortableContext>
            </div>
            {unassignedItems.length === 0 && (
              <div className="text-gray-400 text-sm italic">
                All items have been categorized
              </div>
            )}
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg text-sm font-medium text-blue-800">
                {draggable_items.find((item) => item.id === activeId.id)?.text}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    );
  }

  return (
    <div className="text-red-500 bg-red-50 p-4 rounded-lg">
      Invalid drag word question configuration
    </div>
  );
}

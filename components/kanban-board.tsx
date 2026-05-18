"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoards";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

interface ColConfig {
  // Tailwind classes for the accent gradient line under the header
  accentFrom: string;
  // Icon container classes
  iconBg: string;
  icon: React.ReactNode;
}

const COLUMN_CONFIG: ColConfig[] = [
  {
    accentFrom: "from-sky-500/40",
    iconBg: "bg-sky-500/10 text-sky-500 dark:bg-sky-500/15 dark:text-sky-400",
    icon: <Calendar className="h-3.5 w-3.5" />,
  },
  {
    accentFrom: "from-violet-500/40",
    iconBg: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  {
    accentFrom: "from-emerald-500/40",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    icon: <Mic className="h-3.5 w-3.5" />,
  },
  {
    accentFrom: "from-amber-500/40",
    iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    icon: <Award className="h-3.5 w-3.5" />,
  },
  {
    accentFrom: "from-rose-500/40",
    iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
];

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: { type: "column", columnId: column._id },
  });

  const sortedJobs =
    column.jobApplications?.slice().sort((a, b) => a.order - b.order) || [];

  return (
    <div
      className={`min-w-[280px] w-[280px] flex-shrink-0 flex flex-col rounded-2xl border transition-all duration-200
        bg-card border-border
        ${isOver ? "ring-2 ring-ring/30 border-ring/40" : ""}
      `}
    >
      {/* Column header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`p-1.5 rounded-lg ${config.iconBg}`}>
              {config.icon}
            </span>
            <span className="text-sm font-medium text-foreground/80">
              {column.name}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums bg-muted px-1.5 py-0.5 rounded-md border border-border">
              {sortedJobs.length}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-6 w-6 text-muted-foreground/50 hover:text-muted-foreground">
             
                <MoreVertical className="h-3.5 w-3.5" />
           
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Accent gradient line */}
        <div
          className={`mt-3 h-px w-full bg-gradient-to-r ${config.accentFrom} to-transparent`}
        />
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        className="flex-1 px-3 pb-3 space-y-2 min-h-[300px]"
      >
        <SortableContext
          items={sortedJobs.map((job) => job._id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedJobs.map((job) => (
  <SortableJobCard
    key={job._id}
              job={{ ...job, columnId: job.columnId || column._id }}
              columns={sortedColumns}
            />
          ))}
        </SortableContext>

        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </div>
    </div>
  );
}

function SortableJobCard({
  job,
  columns,
}: {
  job: JobApplication;
  columns: Column[];
}) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: job._id,
    data: { type: "job", job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { columns, moveJob } = useBoard(board);

  const sortedColumns =
    columns?.slice().sort((a, b) => a.order - b.order) || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  async function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || !board._id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs = (column.jobApplications ?? [])
  .slice()
  .sort((a, b) => a.order - b.order);
      const jobIndex = jobs.findIndex((j) => j._id === activeId);
      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) return;

    const targetColumn = sortedColumns.find((col) => col._id === overId);
    const targetJob = sortedColumns
      .flatMap((col) => col.jobApplications || [])
      .find((job) => job._id === overId);

    let targetColumnId: string;
    let newOrder: number;

    if (targetColumn) {
      targetColumnId = targetColumn._id;
      const jobsInTarget = targetColumn.jobApplications
        .filter((j) => j._id !== activeId)
        .sort((a, b) => a.order - b.order);
      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find((col) =>
  (col.jobApplications ?? []).some((j) => j._id === targetJob._id)
);
      targetColumnId = targetJob.columnId || targetJobColumn?._id || "";
      if (!targetColumnId) return;

      const targetColumnObj = sortedColumns.find(
        (col) => col._id === targetColumnId
      );
      if (!targetColumnObj) return;

      const allJobsInTargetOriginal = (targetColumnObj.jobApplications ?? [])
  .slice()
  .sort((a, b) => a.order - b.order);
      const allJobsInTargetFiltered = allJobsInTargetOriginal.filter(
        (j) => j._id !== activeId
      );

      const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
        (j) => j._id === overId
      );
      const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
        (j) => j._id === overId
      );

      if (targetIndexInFiltered !== -1) {
        if (sourceColumn._id === targetColumnId) {
          newOrder =
            sourceIndex < targetIndexInOriginal
              ? targetIndexInFiltered + 1
              : targetIndexInFiltered;
        } else {
          newOrder = targetIndexInFiltered;
        }
      } else {
        newOrder = allJobsInTargetFiltered.length;
      }
    } else {
      return;
    }

    if (!targetColumnId) return;
    await moveJob(activeId, targetColumnId, newOrder);
  }

  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 items-start">
        {sortedColumns.map((col, key) => {
          const config = COLUMN_CONFIG[key] ?? {
            accentFrom: "from-border",
            iconBg: "bg-muted text-muted-foreground",
            icon: <Calendar className="h-3.5 w-3.5" />,
          };
          return (
            <DroppableColumn
              key={key}
              column={col}
              config={config}
              boardId={board._id}
              sortedColumns={sortedColumns}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="rotate-1 scale-105 opacity-90">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
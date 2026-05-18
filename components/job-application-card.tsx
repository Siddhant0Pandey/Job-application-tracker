"use client";

import { JobApplication, Column } from "@/lib/models/models.types";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  deleteJobApplication,
  updateJobApplication,
} from "@/lib/actions/job-applications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

// Consistent accent colors per company — same in light & dark (opacity adjusts)
const ACCENT_LIGHT = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];
const ACCENT_DARK = [
  "dark:bg-sky-500/15 dark:text-sky-400",
  "dark:bg-violet-500/15 dark:text-violet-400",
  "dark:bg-emerald-500/15 dark:text-emerald-400",
  "dark:bg-amber-500/15 dark:text-amber-400",
  "dark:bg-rose-500/15 dark:text-rose-400",
  "dark:bg-pink-500/15 dark:text-pink-400",
  "dark:bg-cyan-500/15 dark:text-cyan-400",
];

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

  const idx = job.company.charCodeAt(0) % ACCENT_LIGHT.length;
  const accentClass = `${ACCENT_LIGHT[idx]} ${ACCENT_DARK[idx]}`;
  const initials = job.company.slice(0, 2).toUpperCase();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      if (!result.error) setIsEditing(false);
    } catch (err) {
      console.error("Failed to update:", err);
    }
  }

  async function handleDelete() {
    try {
      await deleteJobApplication(job._id);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      await updateJobApplication(job._id, { columnId: newColumnId });
    } catch (err) {
      console.error("Failed to move:", err);
    }
  }

  return (
    <>
      <div
        className="group relative rounded-xl border border-border bg-background hover:bg-muted/30 hover:border-border/80 transition-all duration-150 cursor-grab active:cursor-grabbing p-3.5 shadow-sm"
        {...dragHandleProps}
      >
        <div className="flex items-start justify-between gap-2">
          {/* Company badge + info */}
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-semibold ${accentClass}`}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-tight">
                {job.position}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {job.company}
                {job.location && (
                  <span className="text-muted-foreground/50">
                    {" "}
                    · {job.location}
                  </span>
                )}
              </p>

              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground/60 border border-border">
                      +{job.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {job.salary && (
                <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                  {job.salary}
                </p>
              )}
            </div>
          </div>

          {/* Hover actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {job.jobUrl && (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-6 flex items-center justify-center rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-6 w-6 text-muted-foreground/50 hover:text-muted-foreground" >
               
                  <MoreVertical className="h-3.5 w-3.5" />
                
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer"
                >
                  <Edit2 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  Edit
                </DropdownMenuItem>

                {columns.length > 1 && (
                  <>
                    <DropdownMenuSeparator />
                    {columns
                      .filter((c) => c._id !== job.columnId)
                      .map((column, key) => (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => handleMove(column._id)}
                          className="cursor-pointer text-muted-foreground"
                        >
                          Move to {column.name}
                        </DropdownMenuItem>
                      ))}
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">
              Edit application
            </DialogTitle>
            <DialogDescription className="text-sm">
              Update the details for this role.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 mt-1" onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Company <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Position <span className="text-destructive">*</span>
                </Label>
                <Input
                  required
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Location
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="h-9 text-sm"
                  placeholder="Remote / New York"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Salary
                </Label>
                <Input
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="h-9 text-sm"
                  placeholder="$120k – $160k"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Job URL
              </Label>
              <Input
                type="url"
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
                className="h-9 text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Tags{" "}
                <span className="normal-case text-muted-foreground/50">
                  (comma-separated)
                </span>
              </Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="h-9 text-sm"
                placeholder="React, TypeScript, Remote"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Description
              </Label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="resize-none text-sm"
                placeholder="Brief role description…"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Notes
              </Label>
              <Textarea
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="resize-none text-sm"
                placeholder="Any personal notes…"
              />
            </div>

            <DialogFooter className="gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button type="submit" className="px-5">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
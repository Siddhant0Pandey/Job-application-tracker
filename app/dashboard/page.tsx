import { getSession } from "@/lib/auth/auth";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/kanban-board";
import { Suspense } from "react";
import dbConnect from "@/lib/db";

async function getBoard(userId: string) {
  "use cache";

  await dbConnect();

  const boardDoc = await Board.findOne({
    userId: userId,
    name: "Job Hunt",
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });

  if (!boardDoc) return null;

  return JSON.parse(JSON.stringify(boardDoc));
}

async function DashboardPage() {
  const session = await getSession();
  const board = await getBoard(session?.user.id ?? "");

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sub-header */}
      {/* <div className="border-b border-border bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground tracking-tight">
              My Board
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {session.user.name}&apos;s applications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div> */}

      {/* Board */}
      <div className="container mx-auto px-6 py-8">
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}

export default async function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-7 w-7 rounded-full border-2 border-border border-t-foreground/50 animate-spin" />
            <p className="text-muted-foreground text-sm">Loading your board…</p>
          </div>
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
}
"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutBtn from "./sign-out-btn";
import { useSession } from "@/lib/auth/auth-client";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex mx-auto px-6 h-14 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
        >
          <div className="h-7 w-7 rounded-lg bg-muted border border-border flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-foreground/60" />
          </div>
          Job Tracker
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {session ? (
            <>
              <Link href="/dashboard">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2">
                  Dashboard
                </span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none focus:ring-2 focus:ring-ring/30">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium border border-border">
                      {session.user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="py-0.5">
                        <p className="text-sm font-medium text-foreground">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-normal mt-0.5">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <SignOutBtn />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="h-8 text-sm text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="h-8 text-sm font-medium px-4">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
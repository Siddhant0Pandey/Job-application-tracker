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

export default  function Navbar() {
const {data:session} = useSession()
  return (
    <nav className="border-b border-gray-200">
      <div className="container flex mx-auto px-4 h-16 items-center justify-between">
        <Link
          href="/"
          className="flex gap-2 text-xl items-center text-primary font-semibold"
        >
          <Briefcase />
          Job Tracker
        </Link>
        <div className="flex gap-2 items-center">
          {session ? (
            <>
              {/* <Link href='/dashboard'>
                        <Button variant='ghost' className='text-primary'>Dashboard</Button>
                    </Link> */}
            <DropdownMenu>
    <DropdownMenuTrigger className="rounded-full h-10 w-10 p-0 flex items-center justify-center">
      
        <Avatar>
          <AvatarFallback className="bg-primary text-white">
            {session.user.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
     
    </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>
        <div className="rounded lowercase font-normal font-serif">
            <p className="uppercase">{session.user.name }</p>
            <p>{session.user.email}</p>
        </div>
      </DropdownMenuLabel>
    </DropdownMenuGroup>

<SignOutBtn/>
    </DropdownMenuContent>

  </DropdownMenu>
             
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-primary">
                  Log In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="hover:bg-primary/80">Start for free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar(){
    return <nav className="border-b border-gray-200">
        <div className="container flex mx-auto px-4 h-16 items-center justify-between">
            <Link href='/' className="flex gap-2 text-xl items-center text-primary font-semibold">
            <Briefcase/>
            Job Tracker
            </Link>
            <div className="flex gap-2 items-center">
                <Link href='/sign-in'>
                <Button variant='ghost' className='text-primary'>Log In</Button>
                </Link>
                <Link href='/sign-up'>
                <Button className='hover:bg-primary/80'>Start for free</Button>
                </Link>
            </div>
        </div>
    </nav>
}
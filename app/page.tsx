import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white min-h-screen">
      <main className="flex-1 ">
        <section className="container mx-auto px-4 py-32">
          <div className="text-black text-center">
            <h1 className="text-6xl font-semibold mb-6">A better way to track the job application.</h1>
            <p className="text-muted-foreground mb-10 text-sm">Capture & Manage the job application in one place.</p>
          </div>
          <div className=" flex flex-col gap-2 items-center">
            <Button>Get Started <ArrowRight className="ml-2"/></Button>
            <p className="text-muted-foreground text-sm">Free for all. No Money required.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

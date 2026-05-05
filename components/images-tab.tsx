"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ImagesTab() {
  const [activeTab, setActiveTab] = useState("organise");

  return (
    <section className="border-t border-gray-200 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-center mb-6 font-bold text-3xl text-gray-700">
          All your applications. One dashboard.
        </h1>
        <div className="flex justify-center gap-4 mb-4 max-w-5xl">
          <Button
            onClick={() => setActiveTab("organise")}
            className={`rounded-sm transition-color hover:text-white ${activeTab === "organise" ? "bg-primary text-white" : "bg-accent "}`}
          >
            Organize
          </Button>
          <Button
            onClick={() => setActiveTab("hired")}
            className={`rounded-sm transition-color hover:text-white ${activeTab === "hired" ? "bg-primary text-white" : "bg-accent"}`}
          >
            Hired
          </Button>
          <Button
            onClick={() => setActiveTab("board")}
            className={`rounded-sm transition-color hover:text-white ${activeTab === "board" ? "bg-primary text-white" : "bg-accent"}`}
          >
            Board
          </Button>
        </div>
        <div className="mx-auto border border-gray-200">
          {activeTab === "organise" && (
            <Image
              alt="Organized"
              src="/hero-images/organize.jpg"
              width={1200}
              height={800}
              className="rounded-sm border-accent border"
            />
          )}
          {activeTab === "hired" && (
            <Image
              alt="Hired"
              src="/hero-images/hired.png"
              width={1200}
              height={800}
              className="rounded-sm border-accent border"
            />
          )}
          {activeTab === "board" && (
            <Image
              alt="Board"
              src="/hero-images/boards.jpg"
              width={1200}
              height={800}
              className="rounded-sm border-accent border"
            />
          )}
        </div>
      </div>
    </section>
  );
}

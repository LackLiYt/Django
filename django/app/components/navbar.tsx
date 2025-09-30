"use client"

import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="text-xl font-bold">Django</div>
      <ModeToggle />
    </nav>
  );
}
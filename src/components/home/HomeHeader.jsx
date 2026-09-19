"use client"
import { BriefcaseBusiness, ChevronDown, Sparkles } from "lucide-react"

export default function HomeHeader({ careers, career, onCareerChange }) {
  return (
    <header className="mb-6 flex flex-col gap-5 rounded-2xl border border-border bg-card px-5 py-5 shadow-sm shadow-black/[0.02] md:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <Sparkles className="size-3.5" /> LearnChen Dashboard
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Your career journey</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track learning, prove your skills, and focus on what matters next.</p>
      </div>
      <div className="relative w-full lg:w-auto">
        <BriefcaseBusiness className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary" />
        <select value={career.id} onChange={(e) => onCareerChange(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-10 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 lg:min-w-64">
          {careers.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </header>
  )
}

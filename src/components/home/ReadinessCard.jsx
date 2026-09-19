"use client"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Trophy } from "lucide-react"
export default function ReadinessCard({ readiness }) {
 const score=Math.max(0,Math.min(100,readiness?.score ?? 0)); const data=[{v:score},{v:100-score}]
 return <section className="rounded-2xl border border-border bg-card p-6 shadow-sm shadow-black/[0.02]">
  <div className="flex items-center justify-between"><div><h2 className="font-semibold">Career Readiness</h2><p className="mt-1 text-xs text-muted-foreground">Overall evidence score</p></div><Trophy className="size-5 text-primary" /></div>
  <div className="relative mx-auto mt-3 h-48 max-w-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="v" startAngle={90} endAngle={-270} innerRadius="72%" outerRadius="94%" stroke="none"><Cell fill="var(--chart-1)"/><Cell fill="var(--secondary)"/></Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-semibold tracking-tight">{score}%</span><span className="mt-1 text-xs text-muted-foreground">ready</span></div></div>
  <p className="text-center text-xs leading-5 text-muted-foreground">Built from learning, assessment and interview evidence.</p>
 </section>
}

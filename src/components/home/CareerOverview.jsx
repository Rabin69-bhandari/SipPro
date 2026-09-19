"use client"
import { ArrowRight, Clock3, Target } from "lucide-react"
import { useRouter } from "next/navigation"
const cap=(v)=>v ? v.charAt(0).toUpperCase()+v.slice(1) : "Not specified"
export default function CareerOverview({ career, roadmap }) {
 const router=useRouter()
 return <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm shadow-black/[0.02]">
   <div className="absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />
   <div className="relative">
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Selected career</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">{career.title}</h2></div><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10"><Target className="size-5 text-primary" /></div></div>
    <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">{cap(career.experience)}</span><span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">{cap(career.goal)}</span><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"><Clock3 className="size-3" />{career.hoursPerWeek ?? 0} hrs/week</span></div>
    {career.skills?.length>0 && <div className="mt-5 flex flex-wrap gap-2">{career.skills.slice(0,6).map((s,i)=><span key={`${s}-${i}`} className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground">{s}</span>)}</div>}
    <button onClick={()=>router.push(roadmap ? `/roadmap/${roadmap.id}` : "/roadmap")} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">{roadmap ? "Open roadmap" : "Create roadmap"}<ArrowRight className="size-4" /></button>
   </div>
 </section>
}

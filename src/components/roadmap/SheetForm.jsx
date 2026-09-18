"use client"

import { useState } from "react"
import { ArrowRight, Plus } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialForm = {
  title: "",
  experience: "",
  goal: "",
  skills: "",
  hoursPerWeek: "",
}

export default function SheetForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialForm)
  const [open, setOpen] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const roadmapData = {
      title: formData.title.trim(),
      experience: formData.experience,
      goal: formData.goal,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      hoursPerWeek: Number(formData.hoursPerWeek),
    }

    onSubmit(roadmapData)

    setFormData(initialForm)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            size="icon"
            className="fixed bottom-7 right-7 z-40 size-14 rounded-full shadow-lg"
            aria-label="Create career roadmap"
          />
        }
      >
        <Plus className="size-6" />
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-7 py-6 text-left">
          <SheetTitle className="text-2xl">
            Create Career Roadmap
          </SheetTitle>

          <SheetDescription>
            Tell us where you want to go. We&apos;ll build your personalized
            career path.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 px-7 py-7"
        >
          {/* Career */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Career goal
            </Label>

            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="h-11"
              required
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">
              Current experience
            </Label>

            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="" disabled>
                Select your level
              </option>

              <option value="beginner">
                Beginner
              </option>

              <option value="intermediate">
                Intermediate
              </option>

              <option value="advanced">
                Advanced
              </option>
            </select>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal">
              What are you preparing for?
            </Label>

            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="" disabled>
                Select your goal
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Job">
                Job
              </option>

              <option value="Upskilling">
                Upskilling
              </option>

              <option value="Career Switch">
                Career switch
              </option>
            </select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">
              What skills do you already know?
            </Label>

            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="HTML, CSS, JavaScript, React..."
              className="h-11"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Separate skills using commas. These are claimed skills until
              they&apos;re verified through an assessment.
            </p>
          </div>

          {/* Hours */}
          <div className="space-y-2">
            <Label htmlFor="hoursPerWeek">
              Hours available per week
            </Label>

            <Input
              id="hoursPerWeek"
              name="hoursPerWeek"
              type="number"
              min="1"
              value={formData.hoursPerWeek}
              onChange={handleChange}
              placeholder="10"
              className="h-11"
              required
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full"
          >
            Generate My Roadmap
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DatePicker from "./DatePicker"
import TimePicker from "./TimePicker"

type TaskFormData = {
  title: string
  description: string
  startDate: string
  endDate: string
}

type TaskFormProps = {
  initialData?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => Promise<void>
  isSubmitting?: boolean
  onCancel?: () => void
}

export default function TaskForm({ initialData, onSubmit, isSubmitting = false, onCancel }: TaskFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  function extractDate(iso: string | undefined | null): string {
    if (!iso) return ""
    const d = new Date(iso)
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-CA")
  }

  function extractTime(iso: string | undefined | null): string {
    if (!iso) return ""
    const d = new Date(iso)
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  }

  const [title, setTitle] = useState(initialData?.title ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [startDate, setStartDate] = useState(extractDate(initialData?.startDate))
  const [startTime, setStartTime] = useState(extractTime(initialData?.startDate))
  const [endDate, setEndDate] = useState(extractDate(initialData?.endDate))
  const [endTime, setEndTime] = useState(extractTime(initialData?.endDate))

  function combineDateAndTime(date: string, time: string): string {
    if (!date) return ""
    const d = time ? new Date(`${date}T${time}`) : new Date(`${date}T00:00:00`)
    return d.toISOString()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        startDate: combineDateAndTime(startDate, startTime),
        endDate: combineDateAndTime(endDate, endTime),
      })
    } catch {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePicker value={startDate} onChange={setStartDate} label="Start Date" placeholder="Pick start date" />
        <TimePicker value={startTime} onChange={setStartTime} label="Start Time" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePicker value={endDate} onChange={setEndDate} label="End Date" placeholder="Pick end date" />
        <TimePicker value={endTime} onChange={setEndTime} label="End Time" />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.back())}
          className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import TaskForm from "@/components/TaskForm"

type Task = {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
}

export default function EditTaskPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`/api/tasks/${params.id}`)
        setTask(res.data)
      } catch {
        setError("Task not found.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  async function handleSubmit(data: { title: string; description: string; dueDate: string }) {
    await axios.put(`/api/tasks/${params.id}`, {
      title: data.title,
      description: data.description || undefined,
      completed: task?.completed ?? false,
      dueDate: data.dueDate || undefined,
    })
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-20 rounded bg-gray-100" />
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg font-medium text-gray-700">{error || "Task not found."}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Back to tasks
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to tasks
      </Link>

      <h1 className="mt-4 text-xl font-bold text-gray-900">Edit Task</h1>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <TaskForm
          initialData={{
            title: task.title,
            description: task.description ?? "",
            dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

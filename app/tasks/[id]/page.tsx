"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import StatusBadge from "@/components/StatusBadge"

type Task = {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  async function handleToggle() {
    if (!task) return
    try {
      const res = await axios.patch(`/api/tasks/${task.id}`, { completed: !task.completed })
      setTask(res.data)
    } catch {
      setError("Failed to update task.")
    }
  }

  async function handleDelete() {
    if (!task) return
    setDeleting(true)
    try {
      await axios.delete(`/api/tasks/${task.id}`)
      router.push("/")
      router.refresh()
    } catch {
      setError("Failed to delete task.")
      setDeleting(false)
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
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

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className={`text-xl font-bold ${task.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
                {task.title}
              </h1>
              <StatusBadge completed={task.completed} />
            </div>

            {task.description && (
              <p className="mt-3 text-gray-600 leading-relaxed">{task.description}</p>
            )}

            <div className="mt-6 space-y-2 text-sm text-gray-500">
              {task.dueDate && (
                <p>
                  <span className="font-medium text-gray-700">Due:</span> {formatDate(task.dueDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              task.completed
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {task.completed ? "Mark Active" : "Mark Completed"}
          </button>

          <Link
            href={`/tasks/${task.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

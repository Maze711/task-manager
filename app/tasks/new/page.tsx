"use client"

import { useRouter } from "next/navigation"
import axios from "axios"
import TaskForm from "@/components/TaskForm"
import Link from "next/link"

export default function NewTaskPage() {
  const router = useRouter()

  async function handleSubmit(data: { title: string; description: string; dueDate: string }) {
    await axios.post("/api/tasks", {
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
    })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to tasks
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Create Task</h1>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <TaskForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

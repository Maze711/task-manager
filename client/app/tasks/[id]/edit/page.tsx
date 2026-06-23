"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import TaskForm from "@/components/TaskForm"
import { useTask, useUpdateTask } from "@/lib/services/task.service"

export default function EditTaskPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const { data: task, isLoading, error } = useTask(id)
  const updateTask = useUpdateTask()

  async function handleSubmit(data: { title: string; description: string; dueDate: string }) {
    if (!task) return
    await updateTask.mutateAsync({
      id: task.id,
      data: {
        title: data.title,
        description: data.description || undefined,
        completed: task.completed,
        dueDate: data.dueDate || undefined,
      },
    })
    router.push("/")
  }

  if (isLoading) {
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
        <p className="text-lg font-medium text-gray-700">{error instanceof Error ? error.message : "Task not found."}</p>
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
            dueDate: task.dueDate ?? "",
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateTask.isPending}
        />
      </div>
    </div>
  )
}

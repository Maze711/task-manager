"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import StatusBadge from "@/components/StatusBadge"
import TaskForm from "@/components/TaskForm"
import Modal from "@/components/Modal"
import { useTask, useUpdateTask, useToggleTask, useDeleteTask } from "@/lib/services/task.service"
import { useState } from "react"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const { data: task, isLoading, error } = useTask(id)
  const updateTask = useUpdateTask()
  const toggleTask = useToggleTask()
  const deleteTask = useDeleteTask()

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  async function handleToggle() {
    if (!task) return
    await toggleTask.mutateAsync({ id: task.id, completed: !task.completed })
  }

  async function handleUpdate(data: { title: string; description: string; dueDate: string }) {
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
    setShowEditModal(false)
  }

  async function handleDelete() {
    if (!task) return
    await deleteTask.mutateAsync(task.id)
    router.push("/")
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return null
    const d = new Date(dateStr)
    const date = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    return `${date} at ${time}`
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
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to tasks
      </Link>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1
                className={`text-xl font-bold ${
                  task.completed ? "text-gray-400 line-through" : "text-gray-900"
                }`}
              >
                {task.title}
              </h1>
              <StatusBadge completed={task.completed} />
            </div>

            {task.description && (
              <p className="mt-3 leading-relaxed text-gray-600">{task.description}</p>
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
            disabled={toggleTask.isPending}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              task.completed
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {task.completed ? "Mark Active" : "Mark Completed"}
          </button>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Task">
        <TaskForm
          key={task.id}
          initialData={{
            title: task.title,
            description: task.description ?? "",
            dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
          }}
          onSubmit={handleUpdate}
          isSubmitting={updateTask.isPending}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Task">
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to delete <strong>&ldquo;{task.title}&rdquo;</strong>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {deleteTask.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}

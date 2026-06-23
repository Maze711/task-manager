"use client"

import { useCallback, useState } from "react"
import SearchBar from "@/components/SearchBar"
import FilterBar from "@/components/FilterBar"
import TaskList from "@/components/TaskList"
import TaskForm from "@/components/TaskForm"
import Modal from "@/components/Modal"
import Pagination from "@/components/Pagination"
import { useTasks, useCreateTask, useUpdateTask, useToggleTask, useDeleteTask } from "@/lib/services/task.service"
import type { Task, FilterStatus } from "@/lib/services/task.service"

export default function Home() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<FilterStatus>("all")
  const [page, setPage] = useState(1)

  const [showNewModal, setShowNewModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const { data, isLoading, error } = useTasks(search, status, page)
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const toggleTask = useToggleTask()
  const deleteTask = useDeleteTask()

  function handleSearchChange(val: string) {
    setSearch(val)
    setPage(1)
  }

  function handleStatusChange(val: FilterStatus) {
    setStatus(val)
    setPage(1)
  }

  function handleToggle(id: number, completed: boolean) {
    toggleTask.mutate({ id, completed })
  }

  async function handleCreate(data: { title: string; description: string; dueDate: string }) {
    await createTask.mutateAsync({
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
    })
    setShowNewModal(false)
  }

  async function handleUpdate(data: { title: string; description: string; dueDate: string }) {
    if (!editingTask) return
    await updateTask.mutateAsync({
      id: editingTask.id,
      data: {
        title: data.title,
        description: data.description || undefined,
        completed: editingTask.completed,
        dueDate: data.dueDate || undefined,
      },
    })
    setEditingTask(null)
  }

  async function handleDelete() {
    if (!deletingTask) return
    await deleteTask.mutateAsync(deletingTask.id)
    setDeletingTask(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your tasks efficiently</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </header>

      <div className="mb-6 space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
        <div className="flex-1">
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
        <FilterBar value={status} onChange={handleStatusChange} />
      </div>

      <TaskList
        tasks={data?.tasks ?? []}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
        onToggle={handleToggle}
        onEdit={(task) => setEditingTask(task)}
        onDeleteClick={(task) => setDeletingTask(task)}
      />

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />

      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="Create Task">
        <TaskForm onSubmit={handleCreate} isSubmitting={createTask.isPending} onCancel={() => setShowNewModal(false)} />
      </Modal>

      <Modal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            key={editingTask.id}
            initialData={{
              title: editingTask.title,
              description: editingTask.description ?? "",
              dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 16) : "",
            }}
            onSubmit={handleUpdate}
            isSubmitting={updateTask.isPending}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
      >
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to delete <strong>&ldquo;{deletingTask?.title}&rdquo;</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeletingTask(null)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteTask.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}

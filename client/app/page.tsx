"use client"

import { useState } from "react"
import SearchBar from "@/components/SearchBar"
import FilterBar from "@/components/FilterBar"
import TaskList from "@/components/TaskList"
import TaskForm from "@/components/TaskForm"
import Modal from "@/components/Modal"
import Pagination from "@/components/Pagination"
import DateFilter from "@/components/DateFilter"
import { useTasks, useCreateTask, useUpdateTask, useToggleTask, useDeleteTask } from "@/lib/services/task.service"
import { useLabels } from "@/lib/services/label.service"
import type { Task, FilterStatus } from "@/lib/services/task.service"

export default function Home() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<FilterStatus>("all")
  const [page, setPage] = useState(1)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [timeFrom, setTimeFrom] = useState("")
  const [timeTo, setTimeTo] = useState("")
  const [labelId, setLabelId] = useState<number | undefined>(undefined)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [showNewModal, setShowNewModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const { data, isLoading, error } = useTasks(search, status, page, dateFrom, dateTo, timeFrom, timeTo, labelId)
  const { data: labels } = useLabels()
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

  async function handleCreate(data: { title: string; description: string; dueDate: string; labelIds: number[] }) {
    await createTask.mutateAsync({
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
      labelIds: data.labelIds,
    })
    setShowNewModal(false)
  }

  async function handleUpdate(data: { title: string; description: string; dueDate: string; labelIds: number[] }) {
    if (!editingTask) return
    await updateTask.mutateAsync({
      id: editingTask.id,
      data: {
        title: data.title,
        description: data.description || undefined,
        completed: editingTask.completed,
        dueDate: data.dueDate || undefined,
        labelIds: data.labelIds,
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

      <div className="mb-6 space-y-4">
        <div className="sm:flex sm:items-center sm:gap-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
          <FilterBar value={status} onChange={handleStatusChange} />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              showAdvanced || dateFrom || dateTo || timeFrom || timeTo || labelId
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg className="mr-1 inline-block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-3">
            <DateFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              timeFrom={timeFrom}
              timeTo={timeTo}
              onDateFromChange={(v) => { setDateFrom(v); setPage(1) }}
              onDateToChange={(v) => { setDateTo(v); setPage(1) }}
              onTimeFromChange={(v) => { setTimeFrom(v); setPage(1) }}
              onTimeToChange={(v) => { setTimeTo(v); setPage(1) }}
            />
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Label</p>
              <select
                value={labelId ?? ""}
                onChange={(e) => { setLabelId(e.target.value ? Number(e.target.value) : undefined); setPage(1) }}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All labels</option>
                {labels?.map((label) => (
                  <option key={label.id} value={label.id}>{label.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
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
        <TaskForm
          onSubmit={handleCreate}
          isSubmitting={createTask.isPending}
          onCancel={() => setShowNewModal(false)}
        />
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
              dueDate: editingTask.dueDate ?? "",
              labelIds: editingTask.labels.map((l) => l.id),
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

"use client"

import TaskCard from "./TaskCard"
import EmptyState from "./EmptyState"

type Task = {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
}

type TaskListProps = {
  tasks: Task[]
  loading: boolean
  error: string | null
  onToggle: (id: number, completed: boolean) => void
  onEdit: (task: Task) => void
  onDeleteClick: (task: Task) => void
}

export default function TaskList({ tasks, loading, error, onToggle, onEdit, onDeleteClick }: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">{error}</p>
        <p className="mt-1 text-xs text-red-500">Please try refreshing the page.</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  )
}

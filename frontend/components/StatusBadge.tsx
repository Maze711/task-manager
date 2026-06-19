"use client"

type StatusBadgeProps = {
  completed: boolean
}

export default function StatusBadge({ completed }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        completed
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {completed ? "Completed" : "Incomplete"}
    </span>
  )
}

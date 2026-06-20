"use client"

import type { FilterStatus } from "@/lib/services/task.service"

type FilterBarProps = {
  value: FilterStatus
  onChange: (value: FilterStatus) => void
}

const filters: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

export default function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            value === filter.value
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

"use client"

import { useLabels } from "@/lib/services/label.service"

type LabelPickerProps = {
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export default function LabelPicker({ selectedIds, onChange }: LabelPickerProps) {
  const { data: labels, isLoading } = useLabels()

  function handleToggle(labelId: number) {
    if (selectedIds.includes(labelId)) {
      onChange(selectedIds.filter((id) => id !== labelId))
    } else {
      onChange([...selectedIds, labelId])
    }
  }

  if (isLoading) {
    return <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Labels</label>
      <div className="flex flex-wrap gap-2">
        {labels?.map((label) => {
          const active = selectedIds.includes(label.id)
          return (
            <button
              key={label.id}
              type="button"
              onClick={() => handleToggle(label.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={active ? { backgroundColor: label.color } : undefined}
            >
              {active && (
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {label.name}
            </button>
          )
        })}
        {(!labels || labels.length === 0) && (
          <p className="text-xs text-gray-400">No labels available</p>
        )}
      </div>
    </div>
  )
}

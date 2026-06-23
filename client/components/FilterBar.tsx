"use client"

import DatePicker from "./DatePicker"
import TimePicker from "./TimePicker"
import TitleDropdown from "./TitleDropdown"
import type { FilterStatus } from "@/lib/services/task.service"

type FilterBarProps = {
  title: string
  onTitleChange: (value: string) => void
  status: FilterStatus
  onStatusChange: (value: FilterStatus) => void
  startDate: string
  startDateTime: string
  onStartDateChange: (date: string, time: string) => void
  endDate: string
  endDateTime: string
  onEndDateChange: (date: string, time: string) => void
}

const statusFilters: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

export default function FilterBar({
  title,
  onTitleChange,
  status,
  onStatusChange,
  startDate,
  startDateTime,
  onStartDateChange,
  endDate,
  endDateTime,
  onEndDateChange,
}: FilterBarProps) {
  return (
    <div className="space-y-5">
      <TitleDropdown value={title} onChange={onTitleChange} />

      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onStatusChange(f.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              status === f.value
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</p>
          <p className="text-xs text-gray-400">From</p>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker value={startDate} onChange={(d) => onStartDateChange(d, startDateTime)} placeholder="Date" />
            <TimePicker value={startDateTime} onChange={(t) => onStartDateChange(startDate, t)} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</p>
          <p className="text-xs text-gray-400">To</p>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker value={endDate} onChange={(d) => onEndDateChange(d, endDateTime)} placeholder="Date" />
            <TimePicker value={endDateTime} onChange={(t) => onEndDateChange(endDate, t)} />
          </div>
        </div>
      </div>
    </div>
  )
}

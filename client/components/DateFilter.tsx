"use client"

type DateFilterProps = {
  dateFrom: string
  dateTo: string
  timeFrom: string
  timeTo: string
  onDateFromChange: (val: string) => void
  onDateToChange: (val: string) => void
  onTimeFromChange: (val: string) => void
  onTimeToChange: (val: string) => void
}

export default function DateFilter({
  dateFrom,
  dateTo,
  timeFrom,
  timeTo,
  onDateFromChange,
  onDateToChange,
  onTimeFromChange,
  onTimeToChange,
}: DateFilterProps) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date & Time Range</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-600 mb-1">
            From Date
          </label>
          <input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="dateTo" className="block text-xs font-medium text-gray-600 mb-1">
            To Date
          </label>
          <input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="timeFrom" className="block text-xs font-medium text-gray-600 mb-1">
            From Time
          </label>
          <input
            id="timeFrom"
            type="time"
            value={timeFrom}
            onChange={(e) => onTimeFromChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="timeTo" className="block text-xs font-medium text-gray-600 mb-1">
            To Time
          </label>
          <input
            id="timeTo"
            type="time"
            value={timeTo}
            onChange={(e) => onTimeToChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { useTaskTitles } from "@/lib/services/task.service"

type TitleDropdownProps = {
  value: string
  onChange: (value: string) => void
}

export default function TitleDropdown({ value, onChange }: TitleDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(value)
  const ref = useRef<HTMLDivElement>(null)
  const { data: titles = [] } = useTaskTitles()

  const filtered = titles.filter((t) => t.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSelect(title: string) {
    setSearch(title)
    onChange(title)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search or select title..."
        className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {filtered.map((title) => (
            <li
              key={title}
              onClick={() => handleSelect(title)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
            >
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

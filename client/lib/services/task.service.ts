import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { apiMethods } from "../api"
import { API_URL } from "../constant"
import type { Label } from "./label.service"

export type FilterStatus = "all" | "active" | "inactive"

export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  createdAt: string
  updatedAt: string
  labels: Label[]
}

export interface PaginatedResponse {
  tasks: Task[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateTaskPayload {
  title: string
  description?: string
  dueDate?: string
  labelIds?: number[]
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  completed?: boolean
  dueDate?: string
  labelIds?: number[]
}

export function useTasks(
  search?: string,
  status?: FilterStatus,
  page?: number,
  dateFrom?: string,
  dateTo?: string,
  timeFrom?: string,
  timeTo?: string,
  labelId?: number
) {
  return useQuery<PaginatedResponse>({
    queryKey: ["tasks", search, status, page, dateFrom, dateTo, timeFrom, timeTo, labelId],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (status && status !== "all") params.status = status
      if (page && page > 1) params.page = String(page)
      if (dateFrom) params.dueDateFrom = dateFrom
      if (dateTo) params.dueDateTo = dateTo
      if (timeFrom) params.dueTimeFrom = timeFrom
      if (timeTo) params.dueTimeTo = timeTo
      if (labelId) params.labelId = String(labelId)
      const res = await apiMethods.get<PaginatedResponse>(`${API_URL}/tasks`, { params })
      return res.data
    },
  })
}

export function useTask(id: number) {
  return useQuery<Task>({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await apiMethods.get<Task>(`${API_URL}/tasks/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateTaskPayload) => {
      const res = await apiMethods.post<Task>(`${API_URL}/tasks`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Task created")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create task")
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTaskPayload }) => {
      const res = await apiMethods.put<Task>(`${API_URL}/tasks/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Task updated")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["task"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update task")
    },
  })
}

export function useToggleTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiMethods.patch<Task>(`${API_URL}/tasks/${id}`, { completed })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiMethods.delete(`${API_URL}/tasks/${id}`)
    },
    onSuccess: () => {
      toast.success("Task deleted")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete task")
    },
  })
}

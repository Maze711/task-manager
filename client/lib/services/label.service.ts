import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { apiMethods } from "../api"
import { API_URL } from "../constant"

export interface Label {
  id: number
  name: string
  color: string
}

export function useLabels() {
  return useQuery<Label[]>({
    queryKey: ["labels"],
    queryFn: async () => {
      const res = await apiMethods.get<Label[]>(`${API_URL}/labels`)
      return res.data
    },
  })
}

export function useCreateLabel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; color?: string }) => {
      const res = await apiMethods.post<Label>(`${API_URL}/labels`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Label created")
      queryClient.invalidateQueries({ queryKey: ["labels"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create label")
    },
  })
}

export function useDeleteLabel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiMethods.delete(`${API_URL}/labels/${id}`)
    },
    onSuccess: () => {
      toast.success("Label deleted")
      queryClient.invalidateQueries({ queryKey: ["labels"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete label")
    },
  })
}

import { create } from 'zustand'

export const useStore = create((set) => ({
    items: [],
    setItems: (data: any) => set((state: any) => ({ items: data }))
}))
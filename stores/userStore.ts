// stores/userStore.ts
import { create } from 'zustand'

interface UserState {
  firstname: string
  setFirstname: (name: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  firstname: '',
  setFirstname: (name) => set({ firstname: name }),
}))

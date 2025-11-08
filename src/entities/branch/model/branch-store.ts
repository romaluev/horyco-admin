import { create } from 'zustand'

const STORAGE_KEY = 'horyco_selected_branch_id'

interface IBranchStore {
  selectedBranchId: number | null
  setSelectedBranch: (branchId: number | null) => void
  clearSelectedBranch: () => void
  initializeFromStorage: () => void
}

export const useBranchStore = create<IBranchStore>((set) => ({
  selectedBranchId: null,

  setSelectedBranch: (branchId) => {
    set({ selectedBranchId: branchId })
    if (branchId !== null) {
      localStorage.setItem(STORAGE_KEY, branchId.toString())
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  },

  clearSelectedBranch: () => {
    set({ selectedBranchId: null })
    localStorage.removeItem(STORAGE_KEY)
  },

  initializeFromStorage: () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const branchId = parseInt(stored, 10)
      if (!isNaN(branchId)) {
        set({ selectedBranchId: branchId })
      }
    }
  },
}))

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IBranch, CreateBranchRequest, UpdateBranchRequest } from './types';
import {
  getBranches,
  createBranch as apiCreateBranch,
  updateBranch as apiUpdateBranch,
  deleteBranch as apiDeleteBranch,
  getBranchById
} from './api';
import { toast } from 'sonner';
import { FilteringParams, PaginationParams, SortingParams } from '@/types';

interface BranchState {
  branches: IBranch[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBranches: (
    pagination?: PaginationParams,
    sorting?: SortingParams,
    filtering?: FilteringParams[]
  ) => Promise<IBranch[]>;
  getBranchById: (id: number) => Promise<IBranch | null>;
  createBranch: (data: CreateBranchRequest) => Promise<IBranch | null>;
  updateBranch: (
    id: number,
    data: UpdateBranchRequest
  ) => Promise<IBranch | null>;
  deleteBranch: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set, get) => ({
      branches: [],
      totalItems: 0,
      isLoading: false,
      error: null,

      // Fetch branch
      fetchBranches: async (
        pagination,
        sorting,
        filtering
      ): Promise<IBranch[]> => {
        try {
          set({ isLoading: true, error: null });
          const response = await getBranches(pagination, sorting, filtering);
          set({
            branches: response.items,
            totalItems: response.totalItems,
            isLoading: false
          });
          return response.items;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch branch'
          });
          toast.error('Failed to fetch branch');
          return [];
        }
      },

      // Get branch by ID
      getBranchById: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          const branch = await getBranchById(id);
          set({ isLoading: false });
          return branch;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch branch'
          });
          toast.error('Failed to fetch branch');
          return null;
        }
      },

      // Create branch
      createBranch: async (data: CreateBranchRequest) => {
        try {
          set({ isLoading: true, error: null });
          const newBranch = await apiCreateBranch(data);

          // Update local state with the new branch
          set((state) => ({
            branches: [...state.branches, newBranch],
            totalItems: state.totalItems + 1,
            isLoading: false
          }));

          toast.success('Branch created successfully');
          return newBranch;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create branch'
          });
          toast.error('Failed to create branch');
          return null;
        }
      },

      // Update branch
      updateBranch: async (id: number, data: UpdateBranchRequest) => {
        try {
          set({ isLoading: true, error: null });
          const updatedBranch = await apiUpdateBranch(id, data);

          // Update local state with the updated branch
          set((state) => ({
            branches: state.branches.map((branch) =>
              branch.id === id ? updatedBranch : branch
            ),
            isLoading: false
          }));

          toast.success('Branch updated successfully');
          return updatedBranch;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update branch'
          });
          toast.error('Failed to update branch');
          return null;
        }
      },

      // Delete branch
      deleteBranch: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          await apiDeleteBranch(id);

          // Update local state by removing the deleted branch
          set((state) => ({
            branches: state.branches.filter((branch) => branch.id !== id),
            totalItems: state.totalItems - 1,
            isLoading: false
          }));

          toast.success('Branch deleted successfully');
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to delete branch'
          });
          toast.error('Failed to delete branch');
          return false;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'branch-storage', // name of the item in localStorage
      partialize: (state) => ({
        // Only persist branch and totalItems
        branches: state.branches,
        totalItems: state.totalItems
      })
    }
  )
);

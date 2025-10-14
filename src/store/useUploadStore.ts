import { create } from 'zustand';

interface UploadState {
  uploadProgress: number;
  isUploading: boolean;
  currentUploadId: string | null;
  setUploadProgress: (progress: number | ((prev: number) => number)) => void;
  setIsUploading: (isUploading: boolean) => void;
  setCurrentUploadId: (id: string | null) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploadProgress: 0,
  isUploading: false,
  currentUploadId: null,
  setUploadProgress: (progress) => set((state) => ({ 
    uploadProgress: typeof progress === 'function' ? progress(state.uploadProgress) : progress 
  })),
  setIsUploading: (isUploading) => set({ isUploading }),
  setCurrentUploadId: (id) => set({ currentUploadId: id }),
  reset: () => set({ uploadProgress: 0, isUploading: false, currentUploadId: null }),
}));

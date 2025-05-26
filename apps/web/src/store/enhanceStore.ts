import { create } from 'zustand';
import { EnhanceState, EnhanceParams } from '../types/enhance';

interface EnhanceStore {
  image: File | null;
  params: EnhanceParams;
  enhancing: boolean;
  progress: number;
  error: string | null;
  enhancedImageUrl: string | null;
  setImage: (image: File | null) => void;
  setParams: (params: Partial<EnhanceParams>) => void;
  setEnhancing: (enhancing: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setEnhancedImageUrl: (url: string | null) => void;
  reset: () => void;
}

const defaultParams: EnhanceParams = {
  preset: 'basic',
  detail: 0.5,
  scale: 2
};

export const useEnhanceStore = create<EnhanceStore>((set) => ({
  image: null,
  params: defaultParams,
  enhancing: false,
  progress: 0,
  error: null,
  enhancedImageUrl: null,

  setImage: (image) => set({ image, enhancedImageUrl: null }),
  setParams: (newParams) => set((state) => ({ 
    params: { ...state.params, ...newParams } 
  })),
  setEnhancing: (enhancing) => set({ enhancing }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setEnhancedImageUrl: (enhancedImageUrl) => set({ enhancedImageUrl }),
  reset: () => set({
    params: defaultParams,
    enhancing: false,
    progress: 0,
    error: null,
    enhancedImageUrl: null
  })
})); 
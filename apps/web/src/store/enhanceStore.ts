import { create } from 'zustand';
import { EnhanceState, EnhanceParams } from '../types/enhance';

interface EnhanceStore extends EnhanceState {
  setImage: (image: File | null) => void;
  setParams: (params: Partial<EnhanceParams>) => void;
  setEnhancing: (isEnhancing: boolean) => void;
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
  isEnhancing: false,
  progress: 0,
  error: null,
  enhancedImageUrl: null,

  setImage: (image) => set({ image, enhancedImageUrl: null }),
  setParams: (newParams) => set((state) => ({ 
    params: { ...state.params, ...newParams } 
  })),
  setEnhancing: (isEnhancing) => set({ isEnhancing }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  setEnhancedImageUrl: (enhancedImageUrl) => set({ enhancedImageUrl }),
  reset: () => set({
    params: defaultParams,
    isEnhancing: false,
    progress: 0,
    error: null,
    enhancedImageUrl: null
  })
})); 
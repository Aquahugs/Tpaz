export type PresetType = 'basic' | 'sharp' | 'recovery' | 'superfocus' | 'redefine';

export interface EnhanceParams {
  preset: PresetType;
  detail: number;
  scale: 1 | 2 | 4;
  // Generative model parameters
  creativity?: number; // 1-6 for Redefine
  texture?: number; // 1-5 for Redefine
  prompt?: string; // For Redefine
  autoprompt?: boolean; // For Redefine
  focus_boost?: number; // 0.25-1 for Super Focus V2
  seed?: number; // For Super Focus V2
  sharpen?: number; // 0-1 for all models
  denoise?: number; // 0-1 for all models
}

export interface EnhanceState {
  image: File | null;
  params: EnhanceParams;
  isEnhancing: boolean;
  progress: number;
  error: string | null;
  enhancedImageUrl: string | null;
}

export interface EnhanceResponse {
  processId: string;
  eta: number;
  status?: string;
  imageUrl?: string; // For direct processing
}

export interface StatusResponse {
  state?: 'pending' | 'processing' | 'done' | 'failed';
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  output_url?: string;
  output_width?: number;
  output_height?: number;
  error?: string;
}

export interface PresetConfig {
  key: PresetType;
  label: string;
  description: string;
  model: string;
  category: 'traditional' | 'generative';
  icon: string;
  defaultParams: Partial<EnhanceParams>;
  requiredParams: string[];
  isAsync: boolean;
} 
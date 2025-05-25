export interface EnhanceParams {
  preset: 'basic' | 'sharp';
  detail: number;
  scale: 1 | 2 | 4;
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
}

export interface StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  output_url?: string
  output_width?: number
  output_height?: number
  error?: string
} 
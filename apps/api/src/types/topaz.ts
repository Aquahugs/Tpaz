import { z } from 'zod';

export const EnhanceRequestSchema = z.object({
  preset: z.enum(['basic', 'sharp', 'recovery', 'superfocus', 'redefine']),
  detail: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0).max(1)),
  scale: z.string().transform(val => parseInt(val)).pipe(z.number().refine(val => [1, 2, 4].includes(val), {
    message: "Scale must be 1, 2, or 4"
  })),
  // Generative model specific parameters
  creativity: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(6)).optional(),
  texture: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(5)).optional(),
  prompt: z.string().max(1024).optional(),
  autoprompt: z.string().transform(val => val === 'true').optional(),
  focus_boost: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0.25).max(1)).optional(),
  seed: z.string().transform(val => parseInt(val)).pipe(z.number()).optional(),
  sharpen: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0).max(1)).optional(),
  denoise: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0).max(1)).optional()
});

export type EnhanceRequest = z.infer<typeof EnhanceRequestSchema>;

export interface TopazEnhanceResponse {
  process_id: string;
  source_id: string;
  eta: number;
}

export interface TopazStatusResponse {
  state?: 'pending' | 'processing' | 'done' | 'failed';
  status?: string; // Topaz API uses this field with values like 'Processing', 'Completed', etc.
  progress?: number;
  error?: string;
  output_width?: number;
  output_height?: number;
  output_format?: string;
  credits?: number;
  // Additional fields that Topaz API returns
  process_id?: string;
  source_id?: string;
  filename?: string;
  input_format?: string;
  input_height?: number;
  input_width?: number;
  category?: string;
  model_type?: string;
  model?: string;
  subject_detection?: string;
  face_enhancement?: boolean;
  face_enhancement_creativity?: number;
  face_enhancement_strength?: number;
  crop_to_fill?: boolean;
  options_json?: string;
  sync?: boolean;
  eta?: number;
  creation_time?: number;
  modification_time?: number;
}

export const TOPAZ_MODELS = {
  basic: 'Standard V2',
  sharp: 'High Fidelity V2',
  recovery: 'Recovery V2',
  superfocus: 'Super Focus V2',
  redefine: 'Redefine'
} as const;

export const MODEL_CATEGORIES = {
  traditional: ['basic', 'sharp'],
  generative: ['recovery', 'superfocus', 'redefine']
} as const; 
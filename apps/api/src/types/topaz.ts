import { z } from 'zod';

export const EnhanceRequestSchema = z.object({
  preset: z.enum(['basic', 'sharp']),
  detail: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0).max(1)),
  scale: z.string().transform(val => parseInt(val)).pipe(z.number().refine(val => [1, 2, 4].includes(val), {
    message: "Scale must be 1, 2, or 4"
  }))
});

export type EnhanceRequest = z.infer<typeof EnhanceRequestSchema>;

export interface TopazEnhanceResponse {
  process_id: string;
  source_id: string;
  eta: number;
}

export interface TopazStatusResponse {
  state: 'pending' | 'processing' | 'done' | 'failed';
  progress?: number;
  error?: string;
  output_width?: number;
  output_height?: number;
  output_format?: string;
  credits?: number;
}

export const TOPAZ_MODELS = {
  basic: 'Standard V2',
  sharp: 'High Fidelity V2'
} as const; 
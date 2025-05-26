import { PresetConfig, PresetType } from '../types/enhance';

export const PRESET_CONFIGS: Record<PresetType, PresetConfig> = {
  basic: {
    key: 'basic',
    label: 'Basic',
    description: 'Balanced enhancement for high-quality photos',
    model: 'Standard V2',
    category: 'traditional',
    icon: '🔧',
    defaultParams: {
      detail: 0.5,
      scale: 2
    },
    requiredParams: ['detail'],
    isAsync: false
  },
  sharp: {
    key: 'sharp',
    label: 'Sharp',
    description: 'Enhanced detail & sharpness preservation',
    model: 'High Fidelity V2',
    category: 'traditional',
    icon: '⚡',
    defaultParams: {
      detail: 0.7,
      scale: 2
    },
    requiredParams: ['detail'],
    isAsync: false
  },
  recovery: {
    key: 'recovery',
    label: 'Recovery',
    description: 'Reconstruct detail from tiny images (32-256px)',
    model: 'Recovery V2',
    category: 'generative',
    icon: '🔍',
    defaultParams: {
      detail: 0.4,
      scale: 4
    },
    requiredParams: ['detail'],
    isAsync: true
  },
  superfocus: {
    key: 'superfocus',
    label: 'Super Focus',
    description: 'Refocus severely blurred or out-of-focus images',
    model: 'Super Focus V2',
    category: 'generative',
    icon: '🎯',
    defaultParams: {
      detail: 0.5,
      focus_boost: 0.7,
      scale: 2
    },
    requiredParams: ['detail'],
    isAsync: true
  },
  redefine: {
    key: 'redefine',
    label: 'Redefine',
    description: 'Creative upscaling with AI-generated detail',
    model: 'Redefine',
    category: 'generative',
    icon: '🎨',
    defaultParams: {
      creativity: 3,
      texture: 2,
      autoprompt: true,
      scale: 2,
      sharpen: 0.3,
      denoise: 0.2
    },
    requiredParams: ['creativity', 'texture'],
    isAsync: true
  }
};

export const TRADITIONAL_PRESETS = Object.values(PRESET_CONFIGS).filter(p => p.category === 'traditional');
export const GENERATIVE_PRESETS = Object.values(PRESET_CONFIGS).filter(p => p.category === 'generative'); 
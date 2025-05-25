import React from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'
import { Button } from './ui/Button'
import { Slider } from './ui/Slider'
import { useEnhanceStore } from '../store/enhanceStore'
import { useEnhanceWorkflow } from '../hooks/useEnhanceWorkflow'
import { cn } from '../lib/utils'

export function ControlPanel() {
  const {
    image,
    params,
    isEnhancing,
    progress,
    setParams,
    reset,
  } = useEnhanceStore()

  const { startEnhancement } = useEnhanceWorkflow()

  const handlePresetChange = (preset: 'basic' | 'sharp') => {
    setParams({
      preset,
      // Set default detail value based on preset
      detail: preset === 'sharp' ? 0.7 : 0.5,
    })
  }

  const handleDetailChange = (value: number[]) => {
    setParams({ detail: value[0] })
  }

  const handleScaleChange = (scale: 1 | 2 | 4) => {
    setParams({ scale })
  }

  const canEnhance = image && !isEnhancing

  return (
    <div className="w-80 bg-gray-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Enhance</h2>
        <p className="text-sm text-gray-400">Frame 15467</p>
      </div>

      {/* Preset Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Preset</label>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePresetChange('basic')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              params.preset === 'basic'
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            )}
          >
            Basic
          </button>
          <button
            onClick={() => handlePresetChange('sharp')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              params.preset === 'sharp'
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            )}
          >
            Sharp
          </button>
        </div>
      </div>

      {/* Detail Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Detail</label>
          <span className="text-sm text-gray-400">
            {params.detail.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[params.detail]}
          onValueChange={handleDetailChange}
          max={1}
          min={0}
          step={0.05}
          className="w-full"
        />
      </div>

      {/* Upscale Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-3">Upscale</label>
        <div className="flex items-center space-x-4">
          {[1, 2, 4].map((scale) => (
            <button
              key={scale}
              onClick={() => handleScaleChange(scale as 1 | 2 | 4)}
              className={cn(
                "w-12 h-10 rounded-md text-sm font-medium transition-colors border",
                params.scale === scale
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-transparent text-gray-300 border-gray-600 hover:border-gray-500"
              )}
            >
              {scale}x
            </button>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-4">Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Model</span>
            <span className="text-sm">
              {params.preset === 'basic' ? 'Standard V2' : 'High Fidelity V2'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Sharpen</span>
            <span className="text-sm">{params.detail.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        <Button
          onClick={reset}
          variant="outline"
          className="w-full"
          disabled={isEnhancing}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <Button
          onClick={startEnhancement}
          disabled={!canEnhance}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enhancing... {progress > 0 && `${Math.round(progress)}%`}
            </>
          ) : (
            'Enhance'
          )}
        </Button>
      </div>
    </div>
  )
} 
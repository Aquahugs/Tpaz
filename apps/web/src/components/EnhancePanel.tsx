import { useState } from 'react'
import { Button } from './ui/Button'
import { Slider } from './ui/Slider'
import { useEnhanceStore } from '../store/enhanceStore'
import { useEnhanceWorkflow } from '../hooks/useEnhanceWorkflow'
import { PRESET_CONFIGS } from '../config/presets'
import { PresetType } from '../types/enhance'
import { toast } from 'sonner'

export function EnhancePanel() {
  const { 
    image,
    params, 
    setParams, 
    enhancing, 
    progress, 
    enhancedImageUrl,
    setImage,
    setEnhancedImageUrl 
  } = useEnhanceStore()
  const { startEnhancement } = useEnhanceWorkflow()
  const [downloading, setDownloading] = useState(false)

  const currentPreset = PRESET_CONFIGS[params.preset]

  const handlePresetChange = (preset: PresetType) => {
    const config = PRESET_CONFIGS[preset]
    setParams({
      preset,
      ...config.defaultParams
    })
  }

  const handleDownload = async () => {
    if (!enhancedImageUrl) return
    
    setDownloading(true)
    try {
      const link = document.createElement('a')
      link.href = enhancedImageUrl
      link.download = `enhanced-${params.preset}-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Image downloaded!')
    } catch (error) {
      toast.error('Failed to download image')
    } finally {
      setDownloading(false)
    }
  }

  const handleNewImage = () => {
    setImage(null)
    setEnhancedImageUrl(null)
  }

  const handleReset = () => {
    const config = PRESET_CONFIGS[params.preset]
    setParams({
      preset: params.preset,
      ...config.defaultParams
    })
  }

  const renderPresetGrid = () => {
    const presets = Object.values(PRESET_CONFIGS)
    
    return (
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() => handlePresetChange(preset.key)}
            disabled={enhancing}
            className={`
              p-4 rounded-xl text-left transition-all duration-200 border relative
              ${params.preset === preset.key
                ? 'bg-blue-600/20 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
              }
              ${enhancing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{preset.icon}</span>
              {preset.isAsync && (
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                  ASYNC
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{preset.label}</h4>
              <p className="text-xs text-gray-400 leading-tight">{preset.description}</p>
              <p className="text-xs text-blue-400 font-medium">{preset.model}</p>
            </div>
            {params.preset === preset.key && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    )
  }

  const renderParameterControls = () => {
    const preset = params.preset
    
    return (
      <div className="space-y-6">
        {/* Universal Detail Parameter */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 text-sm">
              {preset === 'recovery' ? 'Detail Reconstruction' : 
               preset === 'superfocus' ? 'Focus Detail' : 'Detail'}
            </span>
            <span className="text-white text-sm font-medium">{params.detail?.toFixed(1) || '0.5'}</span>
          </div>
          <Slider
            value={[params.detail || 0.5]}
            onValueChange={([value]) => setParams({ detail: value })}
            min={0}
            max={1}
            step={0.1}
            disabled={enhancing}
            className="w-full"
          />
        </div>

        {/* Redefine-specific controls */}
        {preset === 'redefine' && (
          <>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm">Creativity</span>
                <span className="text-white text-sm font-medium">{params.creativity || 3}</span>
              </div>
              <Slider
                value={[params.creativity || 3]}
                onValueChange={([value]) => setParams({ creativity: Math.round(value) })}
                min={1}
                max={6}
                step={1}
                disabled={enhancing}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lower = photo-realistic, Higher = more artistic liberties
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm">Texture</span>
                <span className="text-white text-sm font-medium">{params.texture || 2}</span>
              </div>
              <Slider
                value={[params.texture || 2]}
                onValueChange={([value]) => setParams({ texture: Math.round(value) })}
                min={1}
                max={5}
                step={1}
                disabled={enhancing}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm">Prompt Mode</span>
                <button
                  onClick={() => setParams({ autoprompt: !params.autoprompt })}
                  disabled={enhancing}
                  className={`
                    px-3 py-1 rounded-lg text-xs font-medium transition-colors
                    ${params.autoprompt 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  {params.autoprompt ? 'Auto' : 'Manual'}
                </button>
              </div>
              
              {!params.autoprompt && (
                <textarea
                  value={params.prompt || ''}
                  onChange={(e) => setParams({ prompt: e.target.value })}
                  placeholder="Describe the desired look (e.g., 'winter mountain at dawn')"
                  disabled={enhancing}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 resize-none"
                  rows={3}
                  maxLength={1024}
                />
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm">Sharpen</span>
                <span className="text-white text-sm font-medium">{params.sharpen?.toFixed(1) || '0.3'}</span>
              </div>
              <Slider
                value={[params.sharpen || 0.3]}
                onValueChange={([value]) => setParams({ sharpen: value })}
                min={0}
                max={1}
                step={0.1}
                disabled={enhancing}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm">Denoise</span>
                <span className="text-white text-sm font-medium">{params.denoise?.toFixed(1) || '0.2'}</span>
              </div>
              <Slider
                value={[params.denoise || 0.2]}
                onValueChange={([value]) => setParams({ denoise: value })}
                min={0}
                max={1}
                step={0.1}
                disabled={enhancing}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Super Focus-specific controls */}
        {preset === 'superfocus' && (
          <>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm">Focus Boost</span>
                <span className="text-white text-sm font-medium">{params.focus_boost?.toFixed(1) || '0.7'}</span>
              </div>
              <Slider
                value={[params.focus_boost || 0.7]}
                onValueChange={([value]) => setParams({ focus_boost: value })}
                min={0.25}
                max={1}
                step={0.05}
                disabled={enhancing}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher values for very soft images (0.7-0.9)
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm">Seed (Optional)</span>
                <button
                  onClick={() => setParams({ seed: Math.floor(Math.random() * 10000) })}
                  disabled={enhancing}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Random
                </button>
              </div>
              <input
                type="number"
                value={params.seed || ''}
                onChange={(e) => setParams({ seed: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Leave empty for random"
                disabled={enhancing}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
              />
            </div>
          </>
        )}

        {/* Traditional models - additional controls */}
        {(preset === 'basic' || preset === 'sharp') && (
          <>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 text-sm">Denoise</span>
                <span className="text-white text-sm font-medium">{params.denoise?.toFixed(1) || '0.0'}</span>
              </div>
              <Slider
                value={[params.denoise || 0]}
                onValueChange={([value]) => setParams({ denoise: value })}
                min={0}
                max={1}
                step={0.1}
                disabled={enhancing}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Universal Scale Control */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 text-sm">Upscale</span>
            <span className="text-white text-sm font-medium">{params.scale}x</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 4].map((scale) => (
              <button
                key={scale}
                onClick={() => setParams({ scale: scale as 1 | 2 | 4 })}
                disabled={enhancing}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${params.scale === scale
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }
                  ${enhancing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {scale}x
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-96 bg-gray-900/95 backdrop-blur-sm border-l border-gray-800/50 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Enhance</h2>
          <div className={`w-2 h-2 rounded-full ${currentPreset.category === 'generative' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
        </div>
        {image && (
          <div className="mt-3 space-y-1">
            <p className="text-gray-400 text-sm">
              {image.name} ({Math.round(image.size / 1024)}KB)
            </p>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 text-xs font-medium">
                {currentPreset.model}
              </span>
              {currentPreset.isAsync && (
                <span className="text-orange-400 text-xs bg-orange-500/20 px-2 py-0.5 rounded-full">
                  ASYNC
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {!image ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">Upload an image to get started</p>
          </div>
        </div>
      ) : (
        <>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Model Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Enhancement Models</h3>
                </div>
                {renderPresetGrid()}
              </div>

              {/* Parameter Controls */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Parameters</h3>
                  <button
                    onClick={handleReset}
                    disabled={enhancing}
                    className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
                {renderParameterControls()}
              </div>

              {/* Progress */}
              {enhancing && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      Processing with {currentPreset.model}
                      {currentPreset.isAsync && ' (Async)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Action Buttons */}
          <div className="flex-shrink-0 p-6 border-t border-gray-800/50 space-y-3">
            <button
              onClick={startEnhancement}
              disabled={enhancing}
              className={`
                w-full py-4 rounded-xl font-medium text-white transition-all duration-200
                ${enhancing
                  ? 'bg-gray-700 cursor-not-allowed'
                  : currentPreset.category === 'generative'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-600/25'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/25'
                }
              `}
            >
              {enhancing ? 'Enhancing...' : `Enhance with ${currentPreset.label}`}
            </button>
            
            {enhancedImageUrl && (
              <>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full py-3 rounded-xl font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-200 disabled:opacity-50"
                >
                  {downloading ? 'Downloading...' : 'Download Enhanced Image'}
                </button>
                
                <button
                  onClick={handleNewImage}
                  className="w-full py-3 rounded-xl font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Upload New Image
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
} 
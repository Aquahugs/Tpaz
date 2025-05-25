import { useState } from 'react'
import { Button } from './ui/Button'
import { Slider } from './ui/Slider'
import { useEnhanceStore } from '../store/enhanceStore'
import { useEnhanceWorkflow } from '../hooks/useEnhanceWorkflow'
import { toast } from 'sonner'

// Model mapping for display
const PRESET_MODELS = {
  basic: 'Standard V2',
  sharp: 'High Fidelity V2'
} as const

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

  const handleDownload = async () => {
    if (!enhancedImageUrl) return
    
    setDownloading(true)
    try {
      const link = document.createElement('a')
      link.href = enhancedImageUrl
      link.download = `enhanced-image-${Date.now()}.jpg`
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
    setParams({
      preset: 'basic',
      detail: 0.5,
      scale: 2
    })
  }

  return (
    <div className="w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-800/50 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Enhance</h2>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
        {image && (
          <div className="mt-3 space-y-1">
            <p className="text-gray-400 text-sm">
              {image.name} ({Math.round(image.size / 1024)}KB)
            </p>
            <p className="text-blue-400 text-xs font-medium">
              Model: {PRESET_MODELS[params.preset]}
            </p>
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
              {/* Presets */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Presets</h3>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'basic', label: 'Basic', description: 'Balanced enhancement' },
                    { key: 'sharp', label: 'Sharp', description: 'Enhanced detail & sharpness' }
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => setParams({ preset: preset.key as 'basic' | 'sharp' })}
                      disabled={enhancing}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all duration-200 border
                        ${params.preset === preset.key
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                        }
                        ${enhancing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{preset.label}</span>
                        {params.preset === preset.key && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{preset.description}</p>
                      <p className="text-xs text-blue-400 mt-1 font-medium">
                        {PRESET_MODELS[preset.key as keyof typeof PRESET_MODELS]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Settings</h3>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Detail Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-300 text-sm">Detail</span>
                      <span className="text-white text-sm font-medium">{params.detail.toFixed(1)}</span>
                    </div>
                    <div className="relative">
                      <Slider
                        value={[params.detail]}
                        onValueChange={([value]) => setParams({ detail: value })}
                        min={0}
                        max={1}
                        step={0.1}
                        disabled={enhancing}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Upscale */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-300 text-sm">Upscale</span>
                      <span className="text-white text-sm font-medium">{params.scale}x</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 4].map((scale) => (
                        <button
                          key={scale}
                          onClick={() => setParams({ scale })}
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

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  disabled={enhancing}
                  className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
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
                      Processing with {PRESET_MODELS[params.preset]}
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
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/25'
                }
              `}
            >
              {enhancing ? 'Enhancing...' : 'Enhance'}
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
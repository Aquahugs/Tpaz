import { useState } from 'react'

interface ImageDisplayProps {
  src: string
  alt: string
  className?: string
}

export function ImageDisplay({ src, alt, className = '' }: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    console.log('Image loaded successfully:', src)
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', src, e)
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Failed to load image</p>
          <p className="text-xs mt-2 text-gray-500">URL: {src.substring(0, 50)}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-gray-400">
            <div className="animate-spin text-2xl mb-2">⏳</div>
            <p>Loading image...</p>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`max-w-full max-h-full object-contain ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
} 
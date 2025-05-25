import { useState, useRef, useCallback, useEffect } from 'react'

interface ImageComparisonProps {
  originalSrc: string
  enhancedSrc: string
  className?: string
}

export function ImageComparison({ originalSrc, enhancedSrc, className = '' }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50) // Percentage
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    isDragging.current = true
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  // Pan functionality
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    setIsPanning(true)
    setLastPanPoint({ x: e.clientX, y: e.clientY })
  }, [zoom])

  const handlePanMove = useCallback((e: MouseEvent) => {
    if (!isPanning || zoom <= 1) return

    const deltaX = e.clientX - lastPanPoint.x
    const deltaY = e.clientY - lastPanPoint.y

    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))

    setLastPanPoint({ x: e.clientX, y: e.clientY })
  }, [isPanning, lastPanPoint, zoom])

  const handlePanEnd = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Zoom functionality
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(1, Math.min(5, zoom + delta))
    
    if (newZoom === 1) {
      setPan({ x: 0, y: 0 })
    }
    
    setZoom(newZoom)
  }, [zoom])

  const zoomIn = useCallback(() => {
    const newZoom = Math.min(5, zoom + 0.25)
    setZoom(newZoom)
  }, [zoom])

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(1, zoom - 0.25)
    if (newZoom === 1) {
      setPan({ x: 0, y: 0 })
    }
    setZoom(newZoom)
  }, [zoom])

  const resetZoom = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Add global event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('mousemove', handlePanMove)
    document.addEventListener('mouseup', handlePanEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('mousemove', handlePanMove)
      document.removeEventListener('mouseup', handlePanEnd)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd, handlePanMove, handlePanEnd])

  const imageStyle = {
    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    transformOrigin: 'center center',
    transition: isPanning ? 'none' : 'transform 0.1s ease-out'
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-900 rounded-lg select-none ${className}`}
      onWheel={handleWheel}
      style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'col-resize' }}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          disabled={zoom >= 5}
          className="w-10 h-10 bg-black/70 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        
        <button
          onClick={zoomOut}
          disabled={zoom <= 1}
          className="w-10 h-10 bg-black/70 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        
        {zoom > 1 && (
          <button
            onClick={resetZoom}
            className="w-10 h-10 bg-black/70 hover:bg-black/80 text-white rounded-lg flex items-center justify-center transition-colors"
            title="Reset Zoom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Zoom Level Indicator */}
      {zoom > 1 && (
        <div className="absolute top-4 left-20 z-20 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Enhanced Image (Background) */}
      <div className="absolute inset-0">
        <img
          src={enhancedSrc}
          alt="Enhanced"
          className="w-full h-full object-contain"
          draggable={false}
          style={imageStyle}
          onMouseDown={zoom > 1 ? handlePanStart : undefined}
        />
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          Enhanced
        </div>
      </div>

      {/* Original Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalSrc}
          alt="Original"
          className="w-full h-full object-contain"
          draggable={false}
          style={imageStyle}
          onMouseDown={zoom > 1 ? handlePanStart : undefined}
        />
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          Original
        </div>
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-col-resize pointer-events-auto flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex space-x-0.5">
            <div className="w-0.5 h-4 bg-gray-400"></div>
            <div className="w-0.5 h-4 bg-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
        {zoom > 1 ? 'Drag to pan • Scroll to zoom' : 'Drag to compare • Scroll to zoom'}
      </div>
    </div>
  )
} 
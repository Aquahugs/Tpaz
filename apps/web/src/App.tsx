import React from 'react'
import { Toaster } from 'sonner'
import { DropZone } from './components/DropZone'
import { ControlPanel } from './components/ControlPanel'
import { useEnhanceStore } from './store/enhanceStore'
import { ImageUpload } from './components/ImageUpload'
import { EnhancePanel } from './components/EnhancePanel'
import { ImageDisplay } from './components/ImageDisplay'
import { ImageComparison } from './components/ImageComparison'

function App() {
  const { image, enhancedImageUrl } = useEnhanceStore()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="flex h-screen">
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b border-gray-800 p-4 flex-shrink-0">
            <h1 className="text-2xl font-bold">Image Enhancement</h1>
          </header>

          {/* Image display area */}
          <div className="flex-1 p-6 min-h-0">
            {!image ? (
              <div className="h-full flex items-center justify-center">
                <ImageUpload />
              </div>
            ) : !enhancedImageUrl ? (
              // Show original image while processing
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4 text-gray-300 flex-shrink-0">Original</h3>
                <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden min-h-0">
                  <ImageDisplay 
                    src={URL.createObjectURL(image)} 
                    alt="Original image"
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : (
              // Show comparison slider when both images are available
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4 text-gray-300 flex-shrink-0">Before / After Comparison</h3>
                <div className="flex-1 min-h-0">
                  <ImageComparison
                    originalSrc={URL.createObjectURL(image)}
                    enhancedSrc={enhancedImageUrl}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhancement panel */}
        <EnhancePanel />
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default App 
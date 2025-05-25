import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useEnhanceStore } from '../store/enhanceStore'
import { toast } from 'sonner'

export function ImageUpload() {
  const { setImage } = useEnhanceStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, TIFF, or WebP image')
        return
      }

      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 50MB')
        return
      }

      setImage(file)
      toast.success('Image uploaded successfully!')
    }
  }, [setImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.webp']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-400 bg-blue-500/10 scale-105' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
              ${isDragActive ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'}
            `}>
              <svg 
                className="w-10 h-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              {isDragActive ? 'Drop your image here' : 'Upload an image'}
            </h3>
            <p className="text-gray-400 text-lg">
              {isDragActive 
                ? 'Release to upload' 
                : 'Drag and drop an image, or click to browse'
              }
            </p>
          </div>
          
          {/* Supported Formats */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['JPEG', 'PNG', 'TIFF', 'WebP'].map((format) => (
              <span 
                key={format}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700"
              >
                {format}
              </span>
            ))}
          </div>
          
          {/* File Size Info */}
          <p className="text-sm text-gray-500">
            Maximum file size: 50MB
          </p>
        </div>

        {/* Animated Border Effect */}
        {isDragActive && (
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  )
} 
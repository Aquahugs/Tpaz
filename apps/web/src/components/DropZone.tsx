import React, { useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { useEnhanceStore } from '../store/enhanceStore'
import { formatFileSize, createImageFromFile } from '../lib/utils'
import { cn } from '../lib/utils'

export function DropZone() {
  const { image, setImage, setError, enhancedImageUrl } = useEnhanceStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setImage(file)
        setError(null)
      }
    },
    [setImage, setError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (rejection) {
        const error = rejection.errors[0]
        if (error?.code === 'file-too-large') {
          setError('File size exceeds 50MB limit')
        } else if (error?.code === 'file-invalid-type') {
          setError('Invalid file type. Only JPEG, PNG, and TIFF are allowed.')
        } else {
          setError('File upload failed')
        }
      }
    },
  })

  // Draw image to canvas when image changes
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    createImageFromFile(image)
      .then((img) => {
        // Calculate canvas size to fit image while maintaining aspect ratio
        const maxWidth = 800
        const maxHeight = 600
        let { width, height } = img

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
      })
      .catch(() => {
        setError('Failed to load image')
      })
  }, [image, setError])

  // Draw enhanced image when available
  useEffect(() => {
    if (!enhancedImageUrl || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }
    img.src = enhancedImageUrl
  }, [enhancedImageUrl])

  const removeImage = () => {
    setImage(null)
    setError(null)
  }

  return (
    <div className="flex-1 flex flex-col">
      {!image ? (
        <div
          {...getRootProps()}
          className={cn(
            "flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Drop Zone
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
            Image canvas here
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            Drag and drop an image here, or click to select
            <br />
            Supports JPEG, PNG, TIFF up to 50MB
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{image.name}</span>
              <span className="text-xs text-gray-500">
                ({formatFileSize(image.size)})
              </span>
            </div>
            <button
              onClick={removeImage}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
} 
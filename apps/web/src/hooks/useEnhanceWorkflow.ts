import { useCallback } from 'react'
import { toast } from 'sonner'
import { useEnhanceStore } from '../store/enhanceStore'
import { enhanceImage, getEnhanceStatus, downloadEnhancedImage } from '../services/api'

const POLLING_INTERVAL = 3000 // 3 seconds
const MAX_POLLING_TIME = 5 * 60 * 1000 // 5 minutes

export function useEnhanceWorkflow() {
  const {
    image,
    params,
    setEnhancing,
    setProgress,
    setError,
    setEnhancedImageUrl,
  } = useEnhanceStore()

  const startEnhancement = useCallback(async () => {
    if (!image) {
      toast.error('Please select an image first')
      return
    }

    setEnhancing(true)
    setProgress(0)
    setError(null)

    try {
      // Start enhancement
      toast.info('Starting image enhancement...')
      const { processId, eta } = await enhanceImage(image, params)
      
      console.log('Enhancement started with processId:', processId)
      toast.info(`Enhancement started. Estimated time: ${Math.round(eta / 60)} minutes`)

      // Poll for status
      const startTime = Date.now()
      const pollStatus = async (): Promise<void> => {
        try {
          const status = await getEnhanceStatus(processId)
          console.log('Status update:', status)

          if (status.progress) {
            setProgress(status.progress)
          }

          switch (status.state) {
            case 'done':
              toast.info('Enhancement completed! Downloading image...')
              
              try {
                console.log('Starting download for processId:', processId)
                // Download the enhanced image
                const blob = await downloadEnhancedImage(processId)
                console.log('Downloaded blob:', blob.size, 'bytes, type:', blob.type)
                
                const url = URL.createObjectURL(blob)
                console.log('Created blob URL:', url)
                
                setEnhancedImageUrl(url)
                setEnhancing(false)
                
                // Show completion info
                const info = status.output_width && status.output_height 
                  ? `Enhanced to ${status.output_width}x${status.output_height}px`
                  : 'Enhancement completed'
                
                toast.success(info)
              } catch (downloadError) {
                console.error('Download error:', downloadError)
                toast.error('Enhancement completed but download failed. Please try downloading manually.')
                setEnhancing(false)
              }
              return

            case 'failed':
              throw new Error(status.error || 'Enhancement failed')

            case 'pending':
            case 'processing':
              // Check if we've exceeded max polling time
              if (Date.now() - startTime > MAX_POLLING_TIME) {
                throw new Error('Enhancement timed out after 5 minutes')
              }
              // Continue polling
              setTimeout(pollStatus, POLLING_INTERVAL)
              break

            default:
              throw new Error(`Unknown status: ${status.state}`)
          }
        } catch (error) {
          console.error('Polling error:', error)
          setEnhancing(false)
          setError(error instanceof Error ? error.message : 'Polling failed')
          toast.error('Failed to check enhancement status')
        }
      }

      // Start polling with initial delay
      setTimeout(pollStatus, 2000) // Wait 2 seconds before first check

    } catch (error) {
      console.error('Enhancement error:', error)
      setEnhancing(false)
      const errorMessage = error instanceof Error ? error.message : 'Enhancement failed'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }, [image, params, setEnhancing, setProgress, setError, setEnhancedImageUrl])

  return { startEnhancement }
} 
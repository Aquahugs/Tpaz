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
    setEnhancedImageUrl(null)

    try {
      console.log('Starting enhancement with params:', params)
      
      const result = await enhanceImage(image, params)
      console.log('Enhancement started:', result)

      if (result.status === 'completed') {
        // Direct processing (traditional models)
        console.log('Direct processing completed')
        setProgress(100)
        setEnhancing(false)
        
        // Create download URL
        const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/download/${result.processId}`
        setEnhancedImageUrl(downloadUrl)
        toast.success('Enhancement completed!')
        return
      }

      // Async processing (generative models)
      console.log('Starting async polling for processId:', result.processId)
      const startTime = Date.now()

      const pollStatus = async () => {
        try {
          if (Date.now() - startTime > MAX_POLLING_TIME) {
            throw new Error('Enhancement timed out after 5 minutes')
          }

          const status = await getEnhanceStatus(result.processId)
          console.log('Status update:', status)

          // Map Topaz status to our expected format
          const normalizedState = status.status?.toLowerCase() || status.state?.toLowerCase()
          const progress = status.progress || 0

          setProgress(progress)

          if (normalizedState === 'completed' || normalizedState === 'done') {
            console.log('Enhancement completed!')
            setProgress(100)
            setEnhancing(false)
            
            // Create download URL
            const downloadUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/download/${result.processId}`
            setEnhancedImageUrl(downloadUrl)
            toast.success('Enhancement completed!')
            
          } else if (normalizedState === 'failed' || normalizedState === 'error') {
            throw new Error(status.error || 'Enhancement failed')
            
          } else if (normalizedState === 'processing' || normalizedState === 'pending') {
            // Continue polling
            setTimeout(pollStatus, POLLING_INTERVAL)
            
          } else {
            console.log('Unknown status:', normalizedState, 'continuing to poll...')
            setTimeout(pollStatus, POLLING_INTERVAL)
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
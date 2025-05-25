import { EnhanceParams, EnhanceResponse, StatusResponse } from '../types/enhance'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`)
  }
  return response.json()
}

export async function enhanceImage(
  image: File,
  params: EnhanceParams
): Promise<EnhanceResponse> {
  const formData = new FormData()
  formData.append('image', image)
  formData.append('preset', params.preset)
  formData.append('detail', params.detail.toString())
  formData.append('scale', params.scale.toString())

  const response = await fetch(`${API_BASE_URL}/api/enhance`, {
    method: 'POST',
    body: formData,
  })

  return handleResponse<EnhanceResponse>(response)
}

export async function getEnhanceStatus(processId: string): Promise<StatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/status/${processId}`)
  return handleResponse<StatusResponse>(response)
}

export async function downloadEnhancedImage(processId: string): Promise<Blob> {
  console.log('Downloading enhanced image for processId:', processId)
  
  const response = await fetch(`${API_BASE_URL}/api/download/${processId}`)
  
  console.log('Download response status:', response.status)
  console.log('Download response headers:', Object.fromEntries(response.headers.entries()))
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Download failed:', errorText)
    throw new Error(`Download failed: ${response.status} ${errorText}`)
  }

  const blob = await response.blob()
  console.log('Downloaded blob details:', {
    size: blob.size,
    type: blob.type
  })
  
  return blob
} 
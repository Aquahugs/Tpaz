import { EnhanceParams, EnhanceResponse, StatusResponse } from '../types/enhance'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

console.log('API_BASE_URL:', API_BASE_URL) // Debug log

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  console.log('Response status:', response.status, 'URL:', response.url) // Debug log
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    console.error('API Error:', response.status, errorData) // Debug log
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

  // Add generative model parameters
  if (params.creativity !== undefined) {
    formData.append('creativity', params.creativity.toString())
  }
  if (params.texture !== undefined) {
    formData.append('texture', params.texture.toString())
  }
  if (params.prompt) {
    formData.append('prompt', params.prompt)
  }
  if (params.autoprompt !== undefined) {
    formData.append('autoprompt', params.autoprompt.toString())
  }
  if (params.focus_boost !== undefined) {
    formData.append('focus_boost', params.focus_boost.toString())
  }
  if (params.seed !== undefined) {
    formData.append('seed', params.seed.toString())
  }
  if (params.sharpen !== undefined) {
    formData.append('sharpen', params.sharpen.toString())
  }
  if (params.denoise !== undefined) {
    formData.append('denoise', params.denoise.toString())
  }

  const url = `${API_BASE_URL}/api/enhance`
  console.log('Making request to:', url)
  console.log('Parameters:', params)

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  return handleResponse<EnhanceResponse>(response)
}

export async function getEnhanceStatus(processId: string): Promise<StatusResponse> {
  const url = `${API_BASE_URL}/api/status/${processId}`
  console.log('Status check URL:', url) // Debug log
  
  const response = await fetch(url)
  return handleResponse<StatusResponse>(response)
}

export async function downloadEnhancedImage(processId: string): Promise<Blob> {
  console.log('Downloading enhanced image for processId:', processId)
  
  const url = `${API_BASE_URL}/api/download/${processId}`
  console.log('Download URL:', url) // Debug log
  
  const response = await fetch(url)
  
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
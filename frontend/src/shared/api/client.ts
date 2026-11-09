import { mockDiagnosis, mockEquipment } from '../../mocks/handlers'
import type { DiagnosisRequest, DiagnosisResult, Equipment } from '../types/api'

export const usingMock = import.meta.env.VITE_USE_MOCK !== 'false'
const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 25000)
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init, signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'X-Request-ID': crypto.randomUUID(), ...init?.headers },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || `요청 실패 (${response.status})`)
    return data as T
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('응답 시간이 초과되었습니다. 다시 시도해 주세요.')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function listEquipment(): Promise<Equipment[]> {
  if (usingMock) return mockEquipment()
  return (await request<{ items: Equipment[] }>('/equipment')).items
}

export async function diagnose(body: DiagnosisRequest): Promise<DiagnosisResult> {
  if (usingMock) return mockDiagnosis(body)
  return request<DiagnosisResult>('/diagnoses', { method: 'POST', body: JSON.stringify(body) })
}

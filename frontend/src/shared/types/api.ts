// contracts/openapi.json v1의 frontend 소유 타입. 계약 변경 후 이 파일만 갱신합니다.
export interface Sensor {
  key: string; label: string; value: number; unit: string; measured_at: string
}
export interface Equipment {
  id: string; name: string; type: string; location: string; sensors: Sensor[]
}
export interface DiagnosisRequest { equipment_id: string; question: string }
export interface Source { id: string; title: string; section: string; excerpt: string }
export interface DiagnosisResult {
  schema_version: '1.0'
  request_id: string
  equipment_id: string
  mode: 'mock' | 'live'
  status: 'needs_review' | 'insufficient_evidence'
  summary: string
  possible_causes: { label: string; evidence_source_ids: string[] }[]
  checks: string[]
  sources: Source[]
  limitations: string[]
}

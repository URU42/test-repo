import equipment from './equipment.json'
import diagnosis from './diagnosis.json'
import type { DiagnosisRequest, DiagnosisResult, Equipment } from '../shared/types/api'

export async function mockEquipment(): Promise<Equipment[]> {
  return structuredClone(equipment.items)
}

export async function mockDiagnosis(body: DiagnosisRequest): Promise<DiagnosisResult> {
  const selected = equipment.items.find(item => item.id === body.equipment_id)
  if (!selected) throw new Error('설비를 찾을 수 없습니다.')
  if (!body.question.trim() || body.question.length > 1000) throw new Error('질문을 1~1000자로 입력해 주세요.')
  const result = structuredClone(diagnosis) as DiagnosisResult
  result.request_id = crypto.randomUUID()
  result.equipment_id = selected.id
  if (selected.type !== 'pump') {
    result.status = 'insufficient_evidence'
    result.summary = '이 설비 유형에 대한 개발용 문서가 없습니다. 자료를 추가해 주세요.'
    result.possible_causes = []; result.sources = []; result.checks = []
  }
  return result
}

import { describe, expect, it } from 'vitest'
import { mockDiagnosis, mockEquipment } from '../src/mocks/handlers'

describe('독립 개발용 API fixture', () => {
  it('진단 응답이 요청 설비와 원문 근거를 연결한다', async () => {
    const equipment = await mockEquipment()
    const result = await mockDiagnosis({ equipment_id: equipment[0].id, question: '점검' })
    expect(result.mode).toBe('mock')
    expect(result.equipment_id).toBe(equipment[0].id)
    expect(result.possible_causes.flatMap(c => c.evidence_source_ids)).toEqual(result.sources.map(s => s.id))
  })
  it('지원 문서가 없는 설비는 원인과 근거를 지어내지 않는다', async () => {
    const result = await mockDiagnosis({ equipment_id: 'compressor-002', question: '점검' })
    expect(result.status).toBe('insufficient_evidence')
    expect(result.possible_causes).toEqual([])
    expect(result.sources).toEqual([])
  })
  it('없는 설비와 빈 질문을 거절한다', async () => {
    await expect(mockDiagnosis({ equipment_id: 'missing', question: '점검' })).rejects.toThrow()
    await expect(mockDiagnosis({ equipment_id: 'pump-001', question: '   ' })).rejects.toThrow()
  })
})

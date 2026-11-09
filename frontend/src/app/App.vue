<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import EquipmentPanel from '../features/equipment/EquipmentPanel.vue'
import DiagnosisResultView from '../features/diagnosis/DiagnosisResult.vue'
import { diagnose, listEquipment, usingMock } from '../shared/api/client'
import type { DiagnosisResult, Equipment } from '../shared/types/api'

const equipment = ref<Equipment[]>([])
const selectedId = ref('')
const question = ref('현재 알람의 점검 순서를 알려줘')
const loading = ref(false)
const equipmentLoading = ref(true)
const error = ref('')
const result = ref<DiagnosisResult | null>(null)
const selected = computed(() => equipment.value.find(item => item.id === selectedId.value))
const canSubmit = computed(() => !!selected.value && question.value.trim().length > 0 && question.value.length <= 1000 && !loading.value)

watch(selectedId, () => { result.value = null; error.value = '' })
onMounted(async () => {
  try {
    equipment.value = await listEquipment()
    selectedId.value = equipment.value[0]?.id || ''
  } catch (e) { error.value = e instanceof Error ? e.message : '설비 목록을 불러오지 못했습니다.' }
  finally { equipmentLoading.value = false }
})
async function submit() {
  if (!canSubmit.value) return
  loading.value = true; error.value = ''; result.value = null
  try { result.value = await diagnose({ equipment_id: selectedId.value, question: question.value }) }
  catch (e) { error.value = e instanceof Error ? e.message : '요청을 처리하지 못했습니다.' }
  finally { loading.value = false }
}
</script>

<template>
  <main class="shell">
    <header>
      <p class="eyebrow">SKALA · ROTATING EQUIPMENT</p>
      <h1>설비 진단 워크스페이스</h1>
      <p class="muted">설비 선택부터 근거 확인까지 연결하는 팀 개발용 베이스</p>
      <span class="badge">{{ usingMock ? '프론트 단독 모드' : '백엔드 HTTP 연결' }}</span>
    </header>
    <aside class="notice">샘플 설비·고정 센서값을 사용합니다. 실제 진단, RAG 검색, 설비 제어는 아직 구현되지 않았습니다.</aside>
    <div class="workspace">
      <div>
        <label for="equipment-select">설비 선택</label>
        <select id="equipment-select" v-model="selectedId" :disabled="loading || equipmentLoading">
          <option v-if="!equipment.length" value="">{{ equipmentLoading ? '목록을 불러오는 중…' : '등록된 설비 없음' }}</option>
          <option v-for="item in equipment" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
        <EquipmentPanel :equipment="selected" />
      </div>
      <div>
        <form class="panel" @submit.prevent="submit">
          <p class="eyebrow">DIAGNOSIS REQUEST</p><h2>설비 상태 질문</h2>
          <label for="question">질문</label>
          <textarea id="question" v-model="question" :disabled="loading" maxlength="1000" rows="4" required />
          <div class="form-footer"><small class="muted">{{ question.length }}/1000</small><button :disabled="!canSubmit">{{ loading ? '응답을 기다리는 중…' : '진단 요청' }}</button></div>
        </form>
        <p v-if="error" role="alert" class="error">{{ error }}</p>
        <DiagnosisResultView v-if="result" :result="result" />
        <section v-else-if="!loading" class="empty">질문을 보내면 진단 응답과 근거가 여기에 표시됩니다.<br>압축기 2호에서는 근거 부족 응답을 확인할 수 있습니다.</section>
        <p v-if="loading" role="status" class="empty">진단 응답을 기다리고 있습니다.</p>
      </div>
    </div>
  </main>
</template>

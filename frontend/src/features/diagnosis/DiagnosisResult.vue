<script setup lang="ts">
import type { DiagnosisResult } from '../../shared/types/api'
defineProps<{ result: DiagnosisResult }>()
</script>

<template>
  <section class="panel result" aria-labelledby="result-heading" aria-live="polite">
    <div class="result-header">
      <h2 id="result-heading">진단 응답</h2>
      <span class="badge">{{ result.status === 'insufficient_evidence' ? '근거 부족' : '담당자 검토 필요' }}</span>
    </div>
    <p v-if="result.mode === 'mock'" class="notice">MOCK · 실제 AI 추론을 수행하지 않은 개발용 응답</p>
    <p>{{ result.summary }}</p>
    <h3 v-if="result.possible_causes.length">원인 후보</h3>
    <ul><li v-for="(cause, index) in result.possible_causes" :key="index">{{ cause.label }} <small>근거: {{ cause.evidence_source_ids.join(', ') }}</small></li></ul>
    <h3 v-if="result.checks.length">점검 항목</h3>
    <ol><li v-for="check in result.checks" :key="check">{{ check }}</li></ol>
    <h3 v-if="result.sources.length">검색 근거</h3>
    <article v-for="source in result.sources" :key="source.id" class="source">
      <strong>{{ source.title }} · {{ source.section }}</strong>
      <blockquote>{{ source.excerpt }}</blockquote>
      <small>{{ source.id }}</small>
    </article>
    <h3>확인 사항</h3>
    <ul><li v-for="item in result.limitations" :key="item">{{ item }}</li></ul>
    <p class="muted small">요청 ID: {{ result.request_id }}</p>
  </section>
</template>

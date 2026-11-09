<script setup lang="ts">
import type { Equipment } from '../../shared/types/api'
defineProps<{ equipment?: Equipment }>()
</script>

<template>
  <section class="panel" aria-labelledby="equipment-heading">
    <p class="eyebrow">EQUIPMENT SNAPSHOT</p>
    <h2 id="equipment-heading">{{ equipment?.name || '설비를 선택해 주세요' }}</h2>
    <template v-if="equipment">
      <p class="muted">{{ equipment.location }} · {{ equipment.id }}</p>
      <div class="sensors">
        <article v-for="sensor in equipment.sensors" :key="sensor.key" class="sensor">
          <span>{{ sensor.label }}</span>
          <strong>{{ sensor.value }} <small>{{ sensor.unit }}</small></strong>
          <time :datetime="sensor.measured_at">{{ new Date(sensor.measured_at).toLocaleString('ko-KR') }}</time>
        </article>
      </div>
      <p class="muted small">고정된 가상 측정값입니다. 실시간 수집·임계값 판정은 아직 구현되지 않았습니다.</p>
    </template>
  </section>
</template>

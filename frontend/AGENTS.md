# AGENTS.md — Frontend (Vue 3 / TypeScript / Vite)

루트 `AGENTS.md`의 공통 규칙이 먼저 적용됩니다. 이 파일은 `apps/frontend/**`에만 해당하는 지침입니다.
폴더 구조와 실행 명령은 이 폴더의 `README.md`를 참고합니다.

## 기술 스택

- Vue 3 (`<script setup lang="ts">`), TypeScript 5.9, Vite 7, Vitest 5, Node 22.12 이상
- 의존성은 `package.json` + `package-lock.json`으로 고정합니다. 설치는 `npm ci`를 사용합니다.
- 새 라이브러리(UI 킷, 차트, 상태관리)는 팀 합의 후 추가하고 사유를 PR에 적습니다.

## 컴포넌트

- 기능 단위로 `src/features/<domain>/`에 둡니다. 현재 도메인은 `equipment`, `diagnosis`, `report`입니다.
- `src/app/App.vue`는 feature 컴포넌트를 조합만 합니다. 비즈니스 로직과 fetch를 App.vue에 넣지 않습니다.
- 여러 feature가 공유하는 컴포넌트·유틸은 `src/shared/`에 둡니다. feature 간 직접 import는 하지 않고 shared를 거칩니다.
- 컴포넌트 파일명은 PascalCase(`DiagnosisResult.vue`), composable은 `useXxx.ts`입니다.
- props/emits는 타입을 명시합니다. `any`를 사용하지 않습니다.
- `v-html`을 사용하지 않습니다. 서버 응답 텍스트는 Vue의 기본 이스케이프로만 렌더링합니다.
- 공통 스타일은 `src/app/styles.css`, 컴포넌트 전용 스타일은 `<style scoped>`에 둡니다.
- 로딩·오류·빈 상태를 모든 데이터 표시 컴포넌트에서 처리합니다.

## 상태관리

- 기본은 컴포넌트 로컬 상태(`ref`, `computed`)와 composable입니다. 현재 전역 스토어는 없습니다.
- 두 개 이상의 feature가 같은 상태를 써야 할 때만 Pinia 도입을 제안합니다. 도입 시 `src/shared/stores/`에 두고 feature별로 스토어를 나눕니다.
- 서버 응답을 그대로 전역 상태에 저장하지 않습니다. 화면에 필요한 형태로 변환하되 계약 필드명(`snake_case`)은 유지합니다.
- 설비 선택이 바뀌면 이전 진단 결과와 오류를 초기화합니다(현재 App.vue의 동작을 유지).

## API 호출

- 서버 접근은 `src/shared/api/client.ts` 한 곳에서만 합니다. 컴포넌트에서 `fetch`를 직접 호출하지 않습니다.
- 호출 경로는 `/api/v1/**`만 사용합니다. 브라우저가 AI 서버(`/internal/**`)를 직접 호출하지 않습니다.
- 모든 요청에 `X-Request-ID`(UUID)와 `Content-Type: application/json`을 넣습니다.
- 요청 시간 제한은 25초이며 초과 시 사용자에게 재시도 안내 문구를 보여줍니다.
- 오류 응답은 `data.error.message`를 우선 표시하고, 없으면 상태 코드를 포함한 기본 문구를 씁니다.
- `VITE_USE_MOCK !== 'false'`이면 `src/mocks/handlers.ts`의 모의 함수를 사용합니다. 모의 응답은 `mode: 'mock'`을 유지합니다.
- 환경변수는 `VITE_` 접두사만 사용하고 `.env.example`에 설명을 추가합니다.

## 타입과 계약

- 계약 타입은 `src/shared/types/api.ts`에만 둡니다. 이 파일은 `contracts/openapi.json`을 Frontend가 손으로 옮긴 것입니다.
- 계약이 바뀌면 `api.ts`, `src/mocks/*.json`, `handlers.ts`를 함께 갱신하고 루트에서 계약 검사를 실행합니다.
- `status`와 `mode`는 리터럴 유니언으로 유지합니다. 새 값이 생기면 계약 변경 절차를 먼저 거칩니다.

## 검사

```bash
cd apps/frontend
npm test          # Vitest: 모의 응답의 설비 연결, 근거 연결, 판단 보류, 입력 오류
npm run build     # vue-tsc 타입 검사 + Vite 배포 빌드
```

- 새 컴포넌트 로직(입력 검증, 상태 전환)과 mock 함수 변경에는 Vitest 테스트를 추가합니다.
- `npm run build`가 타입 오류로 실패하면 완료가 아닙니다.

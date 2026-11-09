# Frontend 담당 시작점

Vue 3 / TypeScript / Vite. Node 22.12 이상.
소유 범위는 이 폴더 전체와 `.github/workflows/frontend.yml`입니다.

```text
src/
├── app/                  # App.vue 조합·공통 스타일
├── features/equipment/   # 설비 선택·센서 스냅샷
├── features/diagnosis/   # 질문·진단 응답·출처 표시
├── features/report/      # 향후 보고서 화면 위치 (아직 미구현)
├── shared/api/           # 서버 접근은 이 경계로 모음
├── shared/types/         # Frontend 소유 계약 타입
└── mocks/                # 서버 없이 개발하는 모의 데이터·함수
```

## 실행

`cp .env.example .env.local`, `npm ci`, `npm run dev` 순서로 실행합니다.
VITE_USE_MOCK=true면 다른 서버 없이 작동합니다.
VITE_USE_MOCK=false면 Backend에 실제 요청합니다. 환경변수 변경 후 Vite를 재시작하세요.
개발 서버는 /api 경로를 BACKEND_PROXY_URL(기본 localhost:8080)로 프록시합니다.
브라우저가 AI 서버를 직접 호출하지 않습니다.

## 확장

- 설비/센서 차트: features/equipment
- 진단 진행 상태·대화 UI: features/diagnosis
- 보고서: features/report
- 요청 시간 제한·오류 처리: shared/api/client.ts
- API 변경 시 shared/types와 mocks를 함께 갱신하고 계약 검사를 실행합니다.
- 화면에 v-html을 사용하지 않으며 응답 텍스트는 Vue가 이스케이프합니다.

## 검사

`npm test`: 모의 응답의 설비 연결, 근거 연결, 판단 보류, 입력 오류 검사.
`npm run build`: TypeScript/Vue 타입 검사와 배포 빌드.

# EcoPass AI (에코패스 AI)
> **마이크로 로드킬(양서류·파충류·곤충) 예방 및 지자체 생태통로 최적화 시스템**  
> 대화형 생태 분석 AI (Gemini 3.8 Flash) • 2D 물리 시뮬레이터 • 지자체 도로교통과/환경과 제출용 정량 평가 리포트

---

## 🌟 프로젝트 소개

EcoPass AI는 도로변에서 매년 수십만 마리씩 압사당하는 양서류(두꺼비, 맹꽁이, 도롱뇽), 파충류, 곤충류 등 **소형 야생동물의 마이크로 로드킬(Micro-Roadkill)**을 예방하기 위해 제작된 전문 생태 분석 및 지자체 정책 제안 플랫폼입니다.

- **전문 대화형 생태 분석 AI (Gemini 3.8 Flash)**: 자연어 질문에서 기상 및 도로 변수를 자동 추출하여 시뮬레이터 파라미터 JSON 생성
- **실시간 2D 로드킬 물리 시뮬레이터**: 야간 조명, 차량 전조등, 빗길 노면, L자형 유도 펜스 및 하부 소형 생태암거(통로) 안전 횡단 메커니즘 시각화
- **정량적 생존 시뮬레이션 결과 대시보드**: 변인(차선 수, 차량 속도, 강우, 주·야간)에 따른 현실적 가변 생존율 및 생태 편익 분석
- **지자체 제출용 표준 공문 리포트**: 도로교통과 및 환경과 예산 배정·조례 건의용 표준 행정 양식 뷰어 (PDF 인쇄 및 마크다운 복사 지원)
- **전국 로드킬 핫스팟 데이터베이스**: 대구 망월지, 청주 오송 연제저수지, 광주 포충사, 치악산 금대계곡 등 실제 현장 연동

---

## 🚀 GitHub 업로드 및 Vercel 배포 가이드

본 프로젝트는 **Vercel 원클릭 배포**를 완벽하게 지원하도록 `vercel.json` 및 Serverless Function(`/api/analyze.ts`, `/api/health.ts`)이 구성되어 있습니다.

### 1단계: GitHub에 코드 올리기

터미널(Terminal)을 열고 프로젝트 폴더에서 아래 명령어를 순서대로 실행하세요:

```bash
# 1. Git 저장소 초기화 및 브랜치 설정
git init
git branch -M main

# 2. 파일 추가 및 첫 커밋 생성
git add .
git commit -m "feat: EcoPass AI 마이크로 로드킬 분석 및 시뮬레이터 배포 준비"

# 3. 본인의 GitHub 원격 저장소(Repository) 연결 (URL을 본인 저장소 주소로 변경)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ecopass-ai.git

# 4. GitHub에 푸시
git push -u origin main
```

---

### 2단계: Vercel에서 배포하기

1. **[Vercel 대시보드(vercel.com)](https://vercel.com)**에 로그인합니다.
2. 우측 상단의 **`Add New...`** 버튼 클릭 후 **`Project`**를 선택합니다.
3. 방금 GitHub에 푸시한 **`ecopass-ai`** 저장소를 찾아 **`Import`** 버튼을 클릭합니다.
4. **프로젝트 설정 확인**:
   - **Framework Preset**: `Vite` (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `vite build` (자동 감지됨)
   - **Output Directory**: `dist` (자동 감지됨)
5. **환경 변수(Environment Variables) 설정 (선택 사항)**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 본인의 Google AI Studio Gemini API 키 입력  
   *(※ 키를 입력하지 않더라도 내장된 고정밀 생태 수리 엔진으로 자동 폴백되어 모든 기능이 100% 정상 작동합니다.)*
6. 하단의 **`Deploy`** 버튼을 클릭합니다.
7. 약 1분 후 제공되는 무료 도메인(예: `https://ecopass-ai.vercel.app`)을 통해 즉시 접속하실 수 있습니다!

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, HTML5 2D Canvas Physics Engine
- **Build Tool**: Vite 8
- **AI Engine**: Google Gen AI SDK (`@google/genai`), Gemini 3.8 Flash
- **Backend / Deployment**: 
  - **Local/AI Studio**: Express + Vite Middlewares (`server.ts`)
  - **Vercel**: Vercel Serverless Functions (`/api/analyze.ts`, `/api/health.ts`, `vercel.json`)

---

## 📂 프로젝트 구조

```
├── api/                   # Vercel Serverless Functions
│   ├── analyze.ts         # 대화형 AI 분석 API 엔드포인트
│   └── health.ts          # 서버 헬스체크 엔드포인트
├── src/
│   ├── components/        # UI 및 시뮬레이션 컴포넌트
│   │   ├── AIPromptPanel.tsx       # 자연어 프롬프트 및 엄격한 JSON 뷰어
│   │   ├── SimulationCanvas.tsx    # 2D 물리 캔버스 및 하단 결과 분석 대시보드
│   │   ├── GovernmentReportView.tsx# 지자체 제출용 정량 평가서(공문)
│   │   ├── HotspotsView.tsx        # 전국 로드킬 다발구간 데이터베이스
│   │   └── StructureSpecsModal.tsx # L자형 펜스 및 암거 표준 CAD 도면 모달
│   ├── data/
│   │   └── mockHotspots.ts         # 국내 주요 양서류 서식지 데이터
│   ├── types/
│   │   └── ecology.ts              # 생태 및 시뮬레이터 타입 정의
│   ├── utils/
│   │   ├── ecologyEngine.ts        # 핵심 생태학적 수리 모델링 & 파서
│   │   └── ecologyEngine.test.ts   # 단위 테스트 (node:test)
│   ├── App.tsx            # 메인 앱 컴포넌트
│   └── main.tsx           # 클라이언트 엔트리 포인트
├── server.ts              # 로컬 및 개발 서버용 Express 엔트리 포인트
├── vercel.json            # Vercel 배포 라우팅 및 빌드 설정
├── package.json           # 프로젝트 의존성 및 스크립트
└── README.md
```

---

## 🧪 로컬 테스트 및 빌드

```bash
# 패키지 설치
npm install

# 단위 테스트 실행 (Node test runner)
npx tsx --test src/utils/ecologyEngine.test.ts

# 로컬 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 번들 빌드
npm run build
```

---

## 📜 라이선스
Apache-2.0 License

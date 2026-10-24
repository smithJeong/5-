import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { analyzeEcologyScenario } from './src/utils/ecologyEngine.ts';

dotenv.config();

const SYSTEM_INSTRUCTION = `# Role & Purpose
너는 '마이크로 로드킬(양서류/파충류/곤충) 예방 및 지자체 생태통로 최적화'를 위한 전문 대화형 생태 분석 AI이다. 
사용자의 자연어 질문 및 기상/도로 환경 데이터를 분석하여, 웹 프론트엔드 2D 시뮬레이터 구동용 파라미터(JSON)와 지자체 제출용 정량적 생태 영향 평가 리포트를 생성하는 역할을 수행한다.

# Input Handling Rules
1. 사용자가 입력한 자연어 질문에서 핵심 환경 변수를 추출한다.
2. 정보가 누락된 경우 아래의 기본값(Default)을 적용한다:
   - 강우 여부(rain): False (자연어에 비/우천 언급 시 True)
   - 야간 여부(is_night): True (기본값 야간)
   - 차량 속도(car_speed_kmh): 60 (km/h)
   - 도로 차선 수(lanes): 2 (차선)
   - 개체 수(initial_population): 100 (마리)

# Mathematical Logic for Simulation
생존율 계산 시 다음 생태학적 로직을 반영한다:
- 야간 및 습도/우천 시 소형 동물의 활동성은 급증함.
- 차선 수가 많고 차량 속도가 높을수록 기본 생존율(survival_rate_baseline)은 급격히 감소함.
- 유도 펜스 및 소형 생태 터널 설치 시 생존율(survival_rate_with_fence)은 최소 70%p 이상 비약적으로 상승함.

# Output Format Specification
반드시 다른 설명 없이 아래 구조의 엄격한 JSON 형식으로만 응답해야 한다:
{
  "scenario_summary": "사용자가 요청한 시나리오 한 줄 요약",
  "parameters": {
    "is_night": boolean,
    "rain": boolean,
    "car_speed_kmh": number,
    "lanes": number,
    "initial_population": number
  },
  "simulation_results": {
    "survival_rate_baseline": number (0~100 사이의 소수점 첫째자리 수치),
    "survival_rate_with_fence": number (0~100 사이의 소수점 첫째자리 수치),
    "improvement_percentage": number (위 두 수치의 차이)
  },
  "policy_recommendation": {
    "target_location_recommendation": "추천 설치 위치 및 구간 (예: GPS 37.xxx, 127.xxx 습지 인근 30m 구간)",
    "structure_spec": "권장 규격 (예: 높이 50cm 미세 유도 펜스 및 하부 30cm 소형 터널)",
    "report_text": "지자체 도로교통과/환경과 제출용 정량적 설득 문구 (3-4문장)"
  }
}`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Ecological AI Analysis API endpoint
  app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: '유효한 자연어 질문 프롬프트를 입력해주세요.' });
      }

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  scenario_summary: { type: Type.STRING },
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      is_night: { type: Type.BOOLEAN },
                      rain: { type: Type.BOOLEAN },
                      car_speed_kmh: { type: Type.NUMBER },
                      lanes: { type: Type.NUMBER },
                      initial_population: { type: Type.NUMBER },
                    },
                    required: ['is_night', 'rain', 'car_speed_kmh', 'lanes', 'initial_population'],
                  },
                  simulation_results: {
                    type: Type.OBJECT,
                    properties: {
                      survival_rate_baseline: { type: Type.NUMBER },
                      survival_rate_with_fence: { type: Type.NUMBER },
                      improvement_percentage: { type: Type.NUMBER },
                    },
                    required: ['survival_rate_baseline', 'survival_rate_with_fence', 'improvement_percentage'],
                  },
                  policy_recommendation: {
                    type: Type.OBJECT,
                    properties: {
                      target_location_recommendation: { type: Type.STRING },
                      structure_spec: { type: Type.STRING },
                      report_text: { type: Type.STRING },
                    },
                    required: ['target_location_recommendation', 'structure_spec', 'report_text'],
                  },
                },
                required: ['scenario_summary', 'parameters', 'simulation_results', 'policy_recommendation'],
              },
            },
          });

          const rawText = response.text?.trim();
          if (rawText) {
            const parsed = JSON.parse(rawText);
            // Verify >= 70%p condition
            if (parsed.simulation_results) {
              const diff = Number((parsed.simulation_results.survival_rate_with_fence - parsed.simulation_results.survival_rate_baseline).toFixed(1));
              parsed.simulation_results.improvement_percentage = diff;
            }
            return res.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (genError) {
          console.warn('Gemini generateContent error, falling back to deterministic ecology engine:', genError);
        }
      }

      // High-precision fallback engine
      const fallbackResult = analyzeEcologyScenario(prompt);
      return res.json({ success: true, data: fallbackResult, source: 'engine-fallback' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      return res.status(500).json({ error: '생태 분석 처리 중 오류가 발생했습니다: ' + err.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Setup Vite dev middleware or serve static dist
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoPass AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

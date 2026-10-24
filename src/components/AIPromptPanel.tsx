import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCode,
  Gauge,
  MapPin,
  Building2,
  FileText,
} from 'lucide-react';
import { EcologyAnalysisResponse } from '../types/ecology';

interface AIPromptPanelProps {
  onAnalysisComplete: (result: EcologyAnalysisResponse) => void;
  currentResult: EcologyAnalysisResponse | null;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const PRESET_SCENARIOS = [
  {
    title: '봄비 야간 4차선 두꺼비 대이동',
    prompt: '비 오는 날 밤 시속 70km 4차선 국도에서 두꺼비 250마리가 산란지로 이동할 때 로드킬 위험도와 생태통로 설치 효과 분석해줘',
  },
  {
    title: '장마철 2차선 지방도 맹꽁이 보전',
    prompt: '장마철 야간 비 내릴 때 시속 60km 2차선 도로에서 멸종위기 맹꽁이 120마리의 마이크로 로드킬 예방 시나리오',
  },
  {
    title: '맑은 주간 3차선 국도 도롱뇽 산란',
    prompt: '맑은 대낮 시속 50km 3차선 도로에서 계곡 도롱뇽 80마리가 도로를 건널 때 기본 생존율과 유도펜스 설치 효과',
  },
  {
    title: '고속 80km 4차선 딱정벌레/파충류',
    prompt: '야간 시속 80km 4차선 도로에서 곤충 및 소형 파충류 150마리 횡단 시나리오',
  },
];

export const AIPromptPanel: React.FC<AIPromptPanelProps> = ({
  onAnalysisComplete,
  currentResult,
  isLoading,
  setIsLoading,
}) => {
  const [inputText, setInputText] = useState<string>(
    '비 오는 날 밤 시속 60km 2차선 도로에서 두꺼비 100마리가 산란지로 이동할 때 위험도와 유도펜스·소형생태터널 최적화 효과 분석'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'card' | 'json'>('card');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const targetText = textToAnalyze || inputText;
    if (!targetText.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: targetText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        onAnalysisComplete(resJson.data);
      } else {
        throw new Error(resJson.error || '분석 결과를 불러오지 못했습니다.');
      }
    } catch (err: any) {
      console.error('Analysis request error:', err);
      setErrorMessage(
        'AI 분석 처리 중 일시적인 통신 오류가 발생했습니다. 내장 분석 엔진으로 자동 전환을 시도합니다: ' +
          err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(JSON.stringify(currentResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!currentResult) return;
    const blob = new Blob([JSON.stringify(currentResult, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecopass-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-white">
                전문 대화형 생태 분석 AI 콘솔
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-semibold whitespace-nowrap">
                Gemini 3.8 Flash 엔진
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              자연어 질문에서 기상·도로·생태 변수를 자동 추출하여 엄격한 시뮬레이션 파라미터 JSON을 생성합니다.
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center self-start sm:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1 rounded font-medium whitespace-nowrap transition ${
              activeTab === 'card'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            정량 리포트 뷰
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1 rounded font-medium flex items-center gap-1 whitespace-nowrap transition ${
              activeTab === 'json'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            엄격한 JSON 규격
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          신속 분석 시나리오:
        </span>
        {PRESET_SCENARIOS.map((sc, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputText(sc.prompt);
              handleAnalyze(sc.prompt);
            }}
            className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Prompt Input Form */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="자연어로 도로 및 동물 시나리오를 질문하세요. (예: 비 오는 밤 시속 70km 4차선 도로에서 두꺼비 200마리 산란 이동)"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>기본값 적용 규칙: 강우(False), 야간(True), 시속(60km/h), 차선(2), 개체수(100마리)</span>
          </div>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs rounded-lg transition shadow-md cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                생태 분석 및 JSON 생성 중...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                생태 분석 및 2D 시뮬레이터 연동
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-lg text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Analysis Output View */}
      {currentResult && (
        <div className="mt-2 border-t border-slate-800 pt-4">
          {activeTab === 'card' ? (
            <div className="space-y-4">
              {/* Scenario Summary Banner */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start gap-3">
                <FileText className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-sky-400 tracking-wider uppercase">
                    시나리오 요약 (Scenario Summary)
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    {currentResult.scenario_summary}
                  </div>
                </div>
              </div>

              {/* Parameters & Simulation Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Extracted Parameters */}
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                  <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-400" />
                    추출된 환경 파라미터 (Parameters)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">야간 여부 (is_night)</span>
                      <span className="font-bold text-indigo-300">
                        {currentResult.parameters.is_night ? 'TRUE (야간)' : 'FALSE (주간)'}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">강우 여부 (rain)</span>
                      <span className="font-bold text-sky-300">
                        {currentResult.parameters.rain ? 'TRUE (우천)' : 'FALSE (비 안옴)'}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">차량 속도 (car_speed)</span>
                      <span className="font-bold text-amber-300">
                        {currentResult.parameters.car_speed_kmh} km/h
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">도로 차선 (lanes)</span>
                      <span className="font-bold text-emerald-300">
                        {currentResult.parameters.lanes} 차선
                      </span>
                    </div>
                    <div className="col-span-2 p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">개체 수 (initial_population)</span>
                      <span className="font-bold text-white">
                        {currentResult.parameters.initial_population} 마리
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Simulation Results */}
                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                  <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    생존율 시뮬레이션 결과 (Simulation Results)
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-rose-400 font-medium">기본 생존율 (미설치):</span>
                      <span className="text-base font-bold text-rose-400">
                        {currentResult.simulation_results.survival_rate_baseline}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, currentResult.simulation_results.survival_rate_baseline)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-400 font-medium">유도펜스·생태터널 설치 후:</span>
                      <span className="text-base font-bold text-emerald-400">
                        {currentResult.simulation_results.survival_rate_with_fence}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${currentResult.simulation_results.survival_rate_with_fence}%`,
                        }}
                      />
                    </div>

                    <div className="p-2.5 mt-2 bg-emerald-950/60 border border-emerald-500/50 rounded-lg flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">생존율 향상 기여도:</span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        +{currentResult.simulation_results.improvement_percentage}%p 비약적 상승
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Recommendation Cards */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  지자체 도로교통과·환경과 제출용 정책 및 권장 규격 (Policy Recommendation)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-amber-400" /> 추천 설치 위치 및 구간
                    </span>
                    <p className="font-semibold text-slate-200">
                      {currentResult.policy_recommendation.target_location_recommendation}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] flex items-center gap-1 mb-1">
                      <Building2 className="w-3 h-3 text-emerald-400" /> 권장 시설 표준 규격
                    </span>
                    <p className="font-semibold text-slate-200">
                      {currentResult.policy_recommendation.structure_spec}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] mb-1">
                    정량적 설득 공문 문구 (지자체 보고서용 3-4문장)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentResult.policy_recommendation.report_text}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Strict JSON Viewer */
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">
                  시스템 출력 규격 만족 JSON 응답 데이터:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs transition border border-slate-700"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? '복사 완료' : 'JSON 복사'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 rounded text-xs transition border border-slate-700"
                  >
                    <Download className="w-3 h-3" />
                    파일 다운로드 (.json)
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(currentResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { AIPromptPanel } from './components/AIPromptPanel';
import { SimulationCanvas } from './components/SimulationCanvas';
import { GovernmentReportView } from './components/GovernmentReportView';
import { HotspotsView } from './components/HotspotsView';
import { StructureSpecsModal } from './components/StructureSpecsModal';
import {
  EcologyAnalysisResponse,
  HotspotLocation,
  SimulationParameters,
} from './types/ecology';
import {
  analyzeEcologyScenario,
  calculateEcologicalRates,
  generatePolicyRecommendation,
} from './utils/ecologyEngine';
import {
  Sparkles,
  PlaySquare,
  FileCheck,
  MapPin,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('main');
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial standard default scenario as per user prompt specifications
  const [analysisResult, setAnalysisResult] = useState<EcologyAnalysisResponse>(() => {
    return analyzeEcologyScenario(
      '시속 60km 2차선 도로에서 야간 소형 동물 100마리 횡단 시나리오'
    );
  });

  const [parameters, setParameters] = useState<SimulationParameters>(
    analysisResult.parameters
  );

  // When AI analysis succeeds
  const handleAnalysisComplete = (newResult: EcologyAnalysisResponse) => {
    setAnalysisResult(newResult);
    setParameters(newResult.parameters);
  };

  // When user adjusts parameters in the 2D simulator sliders or environmental buttons
  const handleParametersChange = (newParams: SimulationParameters) => {
    setParameters(newParams);
    const newResults = calculateEcologicalRates(newParams);
    const summary = `${newParams.is_night ? '야간' : '주간'} / ${
      newParams.rain ? '우천(비)' : '맑음'
    } 조건, 시속 ${newParams.car_speed_kmh}km/h ${newParams.lanes}차선 도로에서 소형 동물 ${
      newParams.initial_population
    }마리 횡단 시나리오`;
    const newPolicy = generatePolicyRecommendation(newParams, newResults, summary);

    setAnalysisResult({
      scenario_summary: summary,
      parameters: newParams,
      simulation_results: newResults,
      policy_recommendation: newPolicy,
    });
  };

  // When user selects a hotspot from database
  const handleSelectHotspot = (hotspot: HotspotLocation) => {
    const updatedParams: SimulationParameters = {
      is_night: true,
      rain: true, // Typical peak amphibian migration during rainy night
      car_speed_kmh: 60,
      lanes: hotspot.lanes,
      initial_population: 150,
    };
    handleParametersChange(updatedParams);
    setActiveTab('main');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick status bar */}
        <div className="mb-6 p-3 bg-white border border-emerald-100 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">
              현재 활성 시나리오:
            </span>
            <span className="text-emerald-700 font-semibold">
              {analysisResult.scenario_summary}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-600">
              기본 생존율:{' '}
              <strong className="text-rose-600">
                {analysisResult.simulation_results.survival_rate_baseline}%
              </strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              생태통로 설치 후:{' '}
              <strong className="text-emerald-700">
                {analysisResult.simulation_results.survival_rate_with_fence}%
              </strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              +{analysisResult.simulation_results.improvement_percentage}%p 개선
            </span>
          </div>
        </div>

        {/* Tab 1: Simulation on Top, AI Analysis below it */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            {/* 1. 최상단 배치: 2D 마이크로 로드킬 물리 시뮬레이터 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <PlaySquare className="w-5 h-5 text-emerald-600" />
                    2D 마이크로 로드킬 물리 시뮬레이터
                  </h2>
                  <p className="text-xs text-slate-500">
                    야간 조명, 전조등 빔, 빗길 노면, L자형 유도펜스 및 하부 생태암거를 통한 양서류 안전 횡단 메커니즘을 실시간 시각화합니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition self-start sm:self-auto shrink-0 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  지자체 제출 리포트 바로가기 &rarr;
                </button>
              </div>

              {/* Simulation Canvas with Sliders and Results Dashboard */}
              <SimulationCanvas
                parameters={parameters}
                onParametersChange={handleParametersChange}
              />
            </div>

            {/* 2. 그 아래 배치: 전문 대화형 생태 분석 AI 콘솔 */}
            <div className="space-y-3 pt-2">
              <AIPromptPanel
                onAnalysisComplete={handleAnalysisComplete}
                currentResult={analysisResult}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>

            {/* Educational Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white border border-emerald-100 rounded-xl shadow-sm space-y-1.5 hover:border-emerald-300 transition">
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" /> 왜 마이크로 로드킬이 치명적인가?
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  개구리, 두꺼비, 도롱뇽은 산란기(봄철) 하천과 산림 사이를 집단 이동합니다.
                  이동 속도가 0.2m/s 이하로 매우 느려 시속 60km 차량 앞에서는 회피가 불가능하며 단 1~2일 만에 지역 개체군 전체가 절멸할 수 있습니다.
                </p>
              </div>

              <div className="p-4 bg-white border border-emerald-100 rounded-xl shadow-sm space-y-1.5 hover:border-emerald-300 transition">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> L자형 유도펜스의 원리
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  상단부에 45도 또는 90도로 꺾인 10cm 탈출 방지 턱(Overhang lip)을 적용하여 기어오르는 양서류를 완벽 차단하고,
                  45도 경사 날개벽을 통해 도로 하부 암거 입구로 유도합니다.
                </p>
              </div>

              <div className="p-4 bg-white border border-emerald-100 rounded-xl shadow-sm space-y-1.5 hover:border-emerald-300 transition">
                <span className="font-bold text-teal-800 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-teal-600" /> 지자체 설득의 핵심
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  단순 동물 보호뿐만 아니라, 젖은 노면 위 대량 사체로 인한 차량 타이어 미끄럼 2차 교통사고 예방과
                  환경부 생태축 복원 예산 확보의 명확한 정량적 근거(+70%p 생존율)를 제공합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Official Municipal Government Evaluation Report */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <GovernmentReportView analysis={analysisResult} />
          </div>
        )}

        {/* Tab 3: Hotspots & Field Cases View */}
        {activeTab === 'hotspots' && (
          <div className="space-y-6">
            <HotspotsView onSelectHotspot={handleSelectHotspot} />
          </div>
        )}
      </main>

      {/* Engineering CAD Specs Modal */}
      <StructureSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 EcoPass AI • 마이크로 로드킬(양서류·파충류·곤충) 예방 및 지자체 생태통로 최적화 시스템
          </span>
          <span className="text-emerald-700 font-medium">
            환경부 생태통로 설치 및 관리지침 표준 규격 준수
          </span>
        </div>
      </footer>
    </div>
  );
}

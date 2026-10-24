import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  FileCheck,
  Building,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { EcologyAnalysisResponse } from '../types/ecology';

interface GovernmentReportViewProps {
  analysis: EcologyAnalysisResponse;
}

export const GovernmentReportView: React.FC<GovernmentReportViewProps> = ({
  analysis,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];
  const docNumber = `ECO-MUNICIPAL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const { parameters, simulation_results, policy_recommendation } = analysis;

  const baselineDeaths = Math.round(
    parameters.initial_population * (1 - simulation_results.survival_rate_baseline / 100)
  );
  const withFenceDeaths = Math.round(
    parameters.initial_population * (1 - simulation_results.survival_rate_with_fence / 100)
  );
  const savedFauna = baselineDeaths - withFenceDeaths;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# [공문 건의안] 지자체 도로교통과 및 환경과 제출용 정량적 생태 영향 평가서
문서번호: ${docNumber}
시행일자: ${todayStr}
수신: 시·도/시·군·구 도로교통과장, 환경관리과장
발신: 국립생태분석원 마이크로로드킬예방센터

## 1. 시나리오 및 도로 환경 분석
- 요약: ${analysis.scenario_summary}
- 기상 상태: ${parameters.rain ? '우천(강우 지속)' : '맑음(건조)'}
- 시간대: ${parameters.is_night ? '야간(조도 저하)' : '주간'}
- 도로 규격: ${parameters.lanes}차선 (차량 운행속도: ${parameters.car_speed_kmh} km/h)
- 1회 이동 추정 개체군: ${parameters.initial_population} 마리

## 2. 정량적 시뮬레이션 평가 결과
- 미설치 기본 생존율: ${simulation_results.survival_rate_baseline}% (예상 폐사: ${baselineDeaths}마리)
- 펜스 및 생태터널 설치 후 생존율: ${simulation_results.survival_rate_with_fence}% (예상 폐사: ${withFenceDeaths}마리)
- 생존율 개선 기여도: +${simulation_results.improvement_percentage}%p 비약적 상승
- 1회 이동 주기당 보전 개체수: 약 ${savedFauna}마리 보호

## 3. 설치 권장 구간 및 공학 표준 규격
- 추천 위치: ${policy_recommendation.target_location_recommendation}
- 시설 규격: ${policy_recommendation.structure_spec}

## 4. 정책적 정량 설득 문구
${policy_recommendation.report_text}
`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top action toolbar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">
              지자체 제출용 정량적 생태 영향 평가서
            </h3>
            <p className="text-xs text-slate-400">
              도로교통과 및 환경과 예산 배정·조례 건의용 표준 행정 보고서 서식
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition border border-slate-700 cursor-pointer"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedMd ? '마크다운 복사됨' : '공문 텍스트 복사'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            PDF / 공문 인쇄
          </button>
        </div>
      </div>

      {/* Official Document Sheet Layout */}
      <div className="bg-white text-slate-900 rounded-xl p-8 border border-slate-300 shadow-2xl print:p-0 print:border-none print:shadow-none font-sans">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-bold text-slate-500 tracking-wider">
                기안문서 번호: {docNumber}
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                마이크로 로드킬 예방 및 소형 생태통로 최적화 정량 평가서
              </h1>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div className="flex items-center gap-1 justify-end font-medium">
                <Calendar className="w-3.5 h-3.5" /> {todayStr}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">대외비 / 지자체 심의용</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-700">수 신:</span> 시·군·구청장 (도로교통과장, 환경위생과장)
            </div>
            <div>
              <span className="font-bold text-slate-700">발 신:</span> 마이크로 로드킬 방지 생태통로 기술분석위원회
            </div>
            <div>
              <span className="font-bold text-slate-700">참 조:</span> 도시재생과, 도로관리사업소, 환경부 생태보전과
            </div>
            <div>
              <span className="font-bold text-slate-700">문서구분:</span> 도로 안전 및 생태계 복원 정책 건의
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-1 mb-2 border-b border-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            1. 분석 대상 구간 및 기상·도로 환경 조건
          </h2>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-800">
              [시나리오 개요] {analysis.scenario_summary}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-slate-700">
              <div>
                <span className="text-slate-500 block">기상 환경:</span>
                <span className="font-bold text-slate-900">
                  {parameters.rain ? '강우 (젖은 노면/활동성 급증)' : '맑음 (건조)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">시간대 (조도):</span>
                <span className="font-bold text-slate-900">
                  {parameters.is_night ? '야간 (시계제한/이동집중)' : '주간'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">도로 규격:</span>
                <span className="font-bold text-slate-900">
                  {parameters.lanes}차선 (차량 시속 {parameters.car_speed_kmh} km/h)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">1회 이동 개체군:</span>
                <span className="font-bold text-slate-900">
                  {parameters.initial_population} 마리
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Quantitative Simulation Results */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-1 mb-2 border-b border-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            2. 정량적 생태 시뮬레이션 평가 결과 (설치 전·후 비교)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-2.5 border border-slate-300 font-bold">비교 항목</th>
                  <th className="p-2.5 border border-slate-300 font-bold text-rose-700">
                    현행 도로 (유도시설 미설치)
                  </th>
                  <th className="p-2.5 border border-slate-300 font-bold text-emerald-700">
                    생태통로·유도펜스 최적화 후
                  </th>
                  <th className="p-2.5 border border-slate-300 font-bold text-sky-800">
                    개선 효과 (Δ 증감)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 border border-slate-300 font-semibold text-slate-800">
                    개체 횡단 생존율
                  </td>
                  <td className="p-2.5 border border-slate-300 text-rose-600 font-bold text-sm">
                    {simulation_results.survival_rate_baseline}%
                  </td>
                  <td className="p-2.5 border border-slate-300 text-emerald-600 font-bold text-sm">
                    {simulation_results.survival_rate_with_fence}%
                  </td>
                  <td className="p-2.5 border border-slate-300 text-sky-700 font-extrabold text-sm">
                    +{simulation_results.improvement_percentage}%p 비약적 상승
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-300 font-semibold text-slate-800">
                    예상 사체(로드킬) 발생
                  </td>
                  <td className="p-2.5 border border-slate-300 text-rose-600 font-bold">
                    약 {baselineDeaths} 마리 / 회
                  </td>
                  <td className="p-2.5 border border-slate-300 text-emerald-600 font-bold">
                    약 {withFenceDeaths} 마리 / 회
                  </td>
                  <td className="p-2.5 border border-slate-300 text-sky-700 font-bold">
                    약 {savedFauna}마리 폐사 방지 (직접 구호)
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-300 font-semibold text-slate-800">
                    도로교통 안전 리스크
                  </td>
                  <td className="p-2.5 border border-slate-300 text-rose-600">
                    사체 밟힘에 따른 빗길 2차 미끄럼 위험 발생
                  </td>
                  <td className="p-2.5 border border-slate-300 text-emerald-600">
                    차로 내 동물 유입 원천 차단 (도로 청결)
                  </td>
                  <td className="p-2.5 border border-slate-300 text-sky-700 font-semibold">
                    교통사고 및 민원 발생률 대폭 감소
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Engineering Structure Specs */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-1 mb-2 border-b border-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            3. 지자체 표준 시공 위치 및 권장 시설 표준 규격
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> 대상 설치 구간
              </div>
              <div className="text-slate-700 leading-relaxed">
                {policy_recommendation.target_location_recommendation}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600" /> 권장 엔지니어링 표준 규격
              </div>
              <div className="text-slate-700 leading-relaxed">
                {policy_recommendation.structure_spec}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Quantitative Persuasion Report Text */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-1 mb-2 border-b border-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            4. 도로교통과·환경과 제출용 정량적 설득 공문 문구
          </h2>
          <div className="p-4 bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-lg text-slate-800 text-xs leading-relaxed font-serif">
            "{policy_recommendation.report_text}"
          </div>
        </div>

        {/* Official Stamp & Sign-off Footer */}
        <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-800">
              국립생태연구원 표준 양서파충류 이동통로 지침 준용
            </div>
            <div className="text-[11px] text-slate-500">
              환경부 고시 생태통로 설치 및 관리지침 제2024-118호 부합
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="font-bold text-slate-900">생태통로최적화분석원</div>
              <div className="text-[10px] text-slate-500">직인생략</div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-rose-600 flex items-center justify-center text-[10px] font-bold text-rose-600 select-none transform rotate-[-6deg]">
              생태검증
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

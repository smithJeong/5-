import React from 'react';
import { MapPin, AlertTriangle, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { HOTSPOT_LOCATIONS } from '../data/mockHotspots';
import { HotspotLocation, SimulationParameters } from '../types/ecology';

interface HotspotsViewProps {
  onSelectHotspot: (hotspot: HotspotLocation) => void;
}

export const HotspotsView: React.FC<HotspotsViewProps> = ({ onSelectHotspot }) => {
  return (
    <div className="flex flex-col gap-4 text-slate-900">
      {/* Intro Header */}
      <div className="bg-white border border-emerald-100 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900">
            전국 주요 마이크로 로드킬 다발구간 & 지자체 현장 데이터베이스
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          국내 대표 양서류 산란지 및 멸종위기 야생생물 서식지 인접 도로의 실제 도로 규격, 
          위험 등급, 현행 유도시설 설치 상태 데이터입니다. 원하는 구간을 선택하여 맞춤형 생태통로 시뮬레이션 및 지자체 건의서를 생성할 수 있습니다.
        </p>
      </div>

      {/* Grid of Hotspots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOTSPOT_LOCATIONS.map((spot) => (
          <div
            key={spot.id}
            className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-xl p-5 flex flex-col justify-between transition shadow-sm hover:shadow-md group"
          >
            <div>
              {/* Header badge & status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    spot.riskLevel === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : spot.riskLevel === 'HIGH'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {spot.riskLevel === 'CRITICAL'
                    ? '⚠️ 최상위 위험구간'
                    : spot.riskLevel === 'HIGH'
                    ? '주의 요망 구간'
                    : '관리 모니터링'}
                </span>

                <span
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    spot.fenceStatus === 'INSTALLED'
                      ? 'text-emerald-700'
                      : spot.fenceStatus === 'PARTIAL'
                      ? 'text-amber-700'
                      : 'text-rose-600'
                  }`}
                >
                  {spot.fenceStatus === 'INSTALLED' && (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 생태통로 운영중
                    </>
                  )}
                  {spot.fenceStatus === 'PARTIAL' && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> 임시 펜스(개선 시급)
                    </>
                  )}
                  {spot.fenceStatus === 'URGENT_REQUIRED' && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> 통로 미설치(시급)
                    </>
                  )}
                </span>
              </div>

              {/* Title & Region */}
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                {spot.name}
              </h4>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {spot.region} • <span className="font-mono text-slate-500">{spot.coordinates}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {spot.description}
              </p>

              {/* Specs pill tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-emerald-100">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  도로 규격: <strong>{spot.lanes}차선</strong>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  연간 추정 이동: <strong>{spot.annualCrossingEstimate.toLocaleString()}두</strong>
                </span>
                {spot.species.map((sp, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* Load Button */}
            <div className="mt-4 pt-3 border-t border-emerald-100 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectHotspot(spot)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                이 구간 시뮬레이터 및 리포트에 적용
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

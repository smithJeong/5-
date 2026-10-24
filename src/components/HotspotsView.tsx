import React from 'react';
import { MapPin, AlertTriangle, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { HOTSPOT_LOCATIONS } from '../data/mockHotspots';
import { HotspotLocation, SimulationParameters } from '../types/ecology';

interface HotspotsViewProps {
  onSelectHotspot: (hotspot: HotspotLocation) => void;
}

export const HotspotsView: React.FC<HotspotsViewProps> = ({ onSelectHotspot }) => {
  return (
    <div className="flex flex-col gap-4 text-slate-100">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            전국 주요 마이크로 로드킬 다발구간 & 지자체 현장 데이터베이스
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          국내 대표 양서류 산란지 및 멸종위기 야생생물 서식지 인접 도로의 실제 도로 규격, 
          위험 등급, 현행 유도시설 설치 상태 데이터입니다. 원하는 구간을 선택하여 맞춤형 생태통로 시뮬레이션 및 지자체 건의서를 생성할 수 있습니다.
        </p>
      </div>

      {/* Grid of Hotspots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HOTSPOT_LOCATIONS.map((spot) => (
          <div
            key={spot.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition shadow-lg group"
          >
            <div>
              {/* Header badge & status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    spot.riskLevel === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : spot.riskLevel === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
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
                      ? 'text-emerald-400'
                      : spot.fenceStatus === 'PARTIAL'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {spot.fenceStatus === 'INSTALLED' && (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" /> 생태통로 운영중
                    </>
                  )}
                  {spot.fenceStatus === 'PARTIAL' && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> 임시 펜스(개선 시급)
                    </>
                  )}
                  {spot.fenceStatus === 'URGENT_REQUIRED' && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> 통로 미설치(시급)
                    </>
                  )}
                </span>
              </div>

              {/* Title & Region */}
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                {spot.name}
              </h4>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {spot.region} • <span className="font-mono text-slate-400">{spot.coordinates}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {spot.description}
              </p>

              {/* Specs pill tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  도로 규격: <strong>{spot.lanes}차선</strong>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  연간 추정 이동: <strong>{spot.annualCrossingEstimate.toLocaleString()}두</strong>
                </span>
                {spot.species.map((sp, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 font-medium"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* Load Button */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectHotspot(spot)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
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

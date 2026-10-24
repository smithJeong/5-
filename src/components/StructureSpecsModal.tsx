import React from 'react';
import { X, Layers, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface StructureSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StructureSpecsModal: React.FC<StructureSpecsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              양서·파충류 맞춤형 소형 생태통로 및 유도시설 표준 설계 기준
            </h3>
            <p className="text-xs text-slate-400">
              환경부 및 국립생태원 마이크로 로드킬 방지 공학 가이드라인
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Visual SVG Engineering Diagram */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
            <svg
              viewBox="0 0 500 200"
              className="w-full max-h-56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Embankment cross section */}
              <path
                d="M 20 160 L 150 160 L 190 90 L 310 90 L 350 160 L 480 160 L 480 190 L 20 190 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Road Asphalt */}
              <rect x="180" y="85" width="140" height="15" fill="#334155" />
              <line
                x1="250"
                y1="85"
                x2="250"
                y2="100"
                stroke="#facc15"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Subterranean Micro-Culvert Tunnel */}
              <rect
                x="220"
                y="125"
                width="60"
                height="45"
                fill="#0f766e"
                stroke="#2dd4bf"
                strokeWidth="2"
                rx="4"
              />
              {/* Skylight vent on culvert */}
              <line x1="250" y1="100" x2="250" y2="125" stroke="#38bdf8" strokeWidth="3" strokeDasharray="2 2" />
              <text x="250" y="118" fill="#38bdf8" fontSize="9" textAnchor="middle">
                상부 채광·환기창
              </text>

              {/* L-Shaped Drift Fence with Escape Lip */}
              {/* Left fence */}
              <path
                d="M 148 160 L 148 125 L 140 125"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="140" cy="125" r="3" fill="#22c55e" />

              {/* Right fence */}
              <path
                d="M 352 160 L 352 125 L 360 125"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="360" cy="125" r="3" fill="#22c55e" />

              {/* Labels */}
              <text x="145" y="112" fill="#86efac" fontSize="9" fontWeight="bold" textAnchor="end">
                L자형 탈출방지턱 (50cm)
              </text>
              <text x="250" y="152" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                소형 생태암거 (직경 50cm)
              </text>
              <text x="250" y="78" fill="#94a3b8" fontSize="10" textAnchor="middle">
                차도 노면 (아스팔트)
              </text>
              <text x="80" y="180" fill="#a7f3d0" fontSize="9">
                배후 습지/서식지
              </text>
              <text x="420" y="180" fill="#a7f3d0" fontSize="9">
                산란지 하천
              </text>
            </svg>
            <div className="text-[10px] text-slate-500 mt-2">
              표준 횡단면도: 도로 하부 관통형 양서파충류 통로 및 노면 차단 유도펜스
            </div>
          </div>

          {/* Core Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-emerald-400 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 1. 미세 유도 펜스 (Drift Fence)
              </span>
              <ul className="text-slate-300 space-y-1 pl-4 list-disc text-[11px]">
                <li>지상 높이 40~50cm, 지하 매립 깊이 10cm 이상 (두더지/굴파기 방지)</li>
                <li>상단부 10cm 너비의 90도 또는 45도 L자형 오버행 턱 (기어오름 탈출 차단)</li>
                <li>재질: 내구성 높은 스테인리스 스틸 메쉬 (눈금 2mm 이하) 또는 아크릴 패널</li>
                <li>터널 입구부 45도 사각 유도 날개벽 설치로 통로 진입 유도</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-sky-400 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 2. 소형 생태 터널 (Micro-Culvert)
              </span>
              <ul className="text-slate-300 space-y-1 pl-4 list-disc text-[11px]">
                <li>규격: 직경 40~60cm 프리캐스트 콘크리트 박스형 또는 원형관</li>
                <li>자연 토양 바닥재 포설 (콘크리트 건조 방지 및 적정 습도 유지)</li>
                <li>도로 중앙분리대 구간 상부 자연 채광창(격자 그레이팅)으로 조도 확보</li>
                <li>경사도 1:20 이하로 설계하여 침수 및 유속 급증 방지</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

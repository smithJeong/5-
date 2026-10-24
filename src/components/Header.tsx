import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  PlaySquare,
  FileText,
  MapPin,
  Layers,
  Leaf,
} from 'lucide-react';

export type ActiveTab = 'main' | 'report' | 'hotspots';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSpecsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSpecsModal,
}) => {
  return (
    <header className="bg-white/95 border-b border-emerald-100 sticky top-0 z-40 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 sm:h-16 gap-2">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                    EcoPass AI
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 whitespace-nowrap">
                    마이크로 로드킬 방지
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile specs button */}
            <div className="sm:hidden">
              <button
                type="button"
                onClick={onOpenSpecsModal}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <Layers className="w-3 h-3 text-emerald-600" />
                <span>도면 규격</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs with horizontal scroll on mobile */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('main')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === 'main'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-white'
                }`}
              >
                <PlaySquare className="w-3.5 h-3.5 shrink-0" />
                <span>시뮬레이션 & AI 분석</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === 'report'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>지자체 리포트</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hotspots')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === 'hotspots'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>전국 핫스팟</span>
              </button>
            </nav>

            {/* Desktop CAD Specs button */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenSpecsModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-emerald-200 shadow-xs transition cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>표준 공학도면 규격</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

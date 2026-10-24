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

export type ActiveTab = 'analyzer' | 'simulator' | 'report' | 'hotspots';

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
    <header className="bg-slate-950/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:h-16 gap-2">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/30 shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                    EcoPass AI
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-400 whitespace-nowrap">
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
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-700"
              >
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>도면 규격</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs with horizontal scroll on mobile */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('analyzer')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === 'analyzer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>AI 분석</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === 'simulator'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <PlaySquare className="w-3.5 h-3.5 shrink-0" />
                <span>시뮬레이터</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === 'report'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>지자체 리포트</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hotspots')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === 'hotspots'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>표준 공학도면 규격</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

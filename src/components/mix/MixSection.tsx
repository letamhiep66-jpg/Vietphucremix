import React from 'react';
import { useApp } from '../../context/AppContext';
import { EventMixFlow } from './EventMixFlow';
import { CanvasMixFlow } from './CanvasMixFlow';
import { Calendar, Sliders, Sparkles, Award, ArrowRight } from 'lucide-react';
export const MixSection: React.FC = () => {
  const { mixSubflow, setMixSubflow, selectedCostumeForMix, setActiveTab } = useApp();

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-4 sm:py-8 px-2.5 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Subflow Navigation Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9B2226]/10 text-[#9B2226] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Xưởng Sáng Tạo Phối Đồ</span>
          </div>
          <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-[#2C241D]">
            Phối Đồ Việt Phục Remix
          </h1>
        </div>

        {/* Segmented Control Switcher (Tự co giãn vừa khít trên Mobile) */}
        <div className="flex items-center p-1 sm:p-1.5 bg-[#EFE7DC] rounded-2xl border border-[#DFD4C4] shadow-inner w-full sm:w-auto">
          <button
            onClick={() => setMixSubflow('event')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mixSubflow === 'event'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'text-[#5C4D3C] hover:text-[#2C241D]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Theo sự kiện</span>
          </button>

          <button
            onClick={() => setMixSubflow('free')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mixSubflow === 'free'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'text-[#5C4D3C] hover:text-[#2C241D]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Phối tự do (Canvas)</span>
          </button>
        </div>
      </div>

      {/* Quick link banner to Outfit Critique */}
      <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-[#FAF6F0] to-amber-50/90 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#800E13] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#2C241D]">
              Đã có ảnh bộ đồ bạn tự phối hoặc tự thiết kế ngoài đời thực?
            </h4>
            <p className="text-[11px] sm:text-xs text-[#6C584C]">
              Tải ảnh lên Hội Đồng Thẩm Định AI để chấm điểm độ hài hòa, chuẩn mực cổ truyền và gợi ý không gian di sản phù hợp.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('critique')}
          className="self-stretch sm:self-auto px-4 py-2 bg-[#800E13] hover:bg-[#9B2226] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
        >
          <span>Tải ảnh chấm điểm ngay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Banner if pre-selected costume from Explore */}
      {selectedCostumeForMix && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FFF6EE] border border-[#F2D7BF] flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <img
              src={selectedCostumeForMix.frontImage}
              alt={selectedCostumeForMix.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#F2D7BF]"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#BC6C25] tracking-wider block">
                Đã chuyển từ trang Khám phá
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#2C241D]">
                Đang phối đồ với trang phục nền tảng: <span className="text-[#800E13]">{selectedCostumeForMix.name}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Render Subflow */}
      {mixSubflow === 'event' ? <EventMixFlow /> : <CanvasMixFlow />}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { TraditionalCostume } from '../../types';
import { getCostumes } from '../../services/costumeService';
import { CostumeDetailModal } from './CostumeDetailModal';
import { searchGroundedCostumeHistory, GroundingSearchResult } from '../../services/groundingService';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { 
  Search, 
  X, 
  ChevronRight, 
  Sparkles, 
  Globe, 
  Loader2, 
  ExternalLink, 
  HelpCircle, 
  BookOpen, 
  MapPin,
  User,
  Users,
  Shirt
} from 'lucide-react';

export const ExploreSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'unisex'>('all');
  const [costumes, setCostumes] = useState<TraditionalCostume[]>([]);
  const [selectedCostume, setSelectedCostume] = useState<TraditionalCostume | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Per-card photo preview state: { [costumeId]: 'front' | 'top' | 'male' | 'female' }
  const [cardPhotoModes, setCardPhotoModes] = useState<Record<string, string>>({});

  // Google Search Grounding states
  const [showGroundingPanel, setShowGroundingPanel] = useState<boolean>(false);
  const [groundingQuery, setGroundingQuery] = useState<string>('');
  const [groundingResult, setGroundingResult] = useState<GroundingSearchResult | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCurrent = true;
    setIsSearching(true);
    getCostumes(searchQuery, genderFilter).then((data) => {
      if (isCurrent) {
        setCostumes(data);
        setIsSearching(false);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [searchQuery, genderFilter]);

  const quickFilters = [
    { label: 'Tất cả', query: '' },
    { label: 'Áo Dài', query: 'áo dài' },
    { label: 'Áo Tứ Thân', query: 'tứ thân' },
    { label: 'Áo Ngũ Thân', query: 'ngũ thân' },
    { label: 'Áo Tấc', query: 'áo tấc' },
    { label: 'Nhật Bình', query: 'nhật bình' },
    { label: 'Giao Lĩnh', query: 'giao lĩnh' },
    { label: 'Đối Khâm', query: 'đối khâm' },
    { label: 'Áo Bà Ba', query: 'bà ba' },
    { label: 'Áo Viên Lĩnh', query: 'viên lĩnh' },
    { label: 'Áo Yếm', query: 'yếm' }
  ];

  const suggestedQuestions = [
    'Sự khác nhau cơ bản giữa Áo Tứ Thân và Áo Ngũ Thân là gì?',
    'Ý nghĩa triết lý của 5 hạt cúc và năm thân trong áo dài ngũ thân nam?',
    'Điển chế quy định về màu sắc và hoa văn của Áo Nhật Bình triều Nguyễn?',
    'Lịch sử cách tân Áo Dài từ thời chúa Nguyễn Phúc Khoát đến Le Mur và Raglan?'
  ];

  const handleExecuteGrounding = async (queryText?: string) => {
    const q = queryText || groundingQuery;
    if (!q.trim()) return;

    setIsGroundingLoading(true);
    setShowGroundingPanel(true);
    try {
      const res = await searchGroundedCostumeHistory(q);
      setGroundingResult(res);
    } finally {
      setIsGroundingLoading(false);
    }
  };

  const getCardImage = (costume: TraditionalCostume) => {
    const mode = cardPhotoModes[costume.id] || 'front';
    if (mode === 'male' && costume.maleTopImage) return costume.maleTopImage;
    if (mode === 'female' && costume.femaleTopImage) return costume.femaleTopImage;
    if (mode === 'top' && costume.topImage) return costume.topImage;
    return costume.frontImage;
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#1E1713]/5 text-[#4A3E35] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 border border-[#1E1713]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#9B2226]" />
          <span>Kho Tàng Trang Phục Cổ Truyền Việt Nam</span>
        </div>
        <h1 className="font-heritage text-xl sm:text-3xl md:text-4xl font-bold text-[#1E1713] tracking-tight">
          Khám Phá Di Sản Việt Phục
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#6C584C] max-w-xl mx-auto line-clamp-2 sm:line-clamp-none leading-relaxed">
          Phân loại trang phục theo giới tính, khảo sát cận cảnh ảnh áo thượng phục (nam / nữ) cùng bối cảnh lịch sử và điển chế trang phục Việt Nam qua các triều đại.
        </p>
      </div>

      {/* Gender Segmented Switcher & Search Bar */}
      <div className="max-w-3xl mx-auto mb-6 space-y-3 sm:space-y-4">
        {/* Gender Category Segmented Tabs */}
        <div className="flex p-1 bg-[#EFE7DD] rounded-2xl max-w-md mx-auto border border-[#DFD1BD] w-full">
          <button
            onClick={() => setGenderFilter('all')}
            className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              genderFilter === 'all'
                ? 'bg-white text-[#800E13] shadow-xs'
                : 'text-[#5C4D3C] hover:text-[#2C241D]'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setGenderFilter('female')}
            className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              genderFilter === 'female'
                ? 'bg-[#800E13] text-white shadow-xs'
                : 'text-[#5C4D3C] hover:text-[#2C241D]'
            }`}
          >
            <span>Trang Phục Nữ ♀</span>
          </button>
          <button
            onClick={() => setGenderFilter('male')}
            className={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              genderFilter === 'male'
                ? 'bg-[#1D3557] text-white shadow-xs'
                : 'text-[#5C4D3C] hover:text-[#2C241D]'
            }`}
          >
            <span>Trang Phục Nam ♂</span>
          </button>
        </div>

        {/* Search input with live clear & Voice Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#786454]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên trang phục (Áo Dài, Tứ Thân, Ngũ Thân...), triều đại, dịp mặc..."
            className="w-full pl-12 pr-24 py-2.5 sm:py-3.5 bg-white border border-[#DFD5C6] rounded-2xl text-xs sm:text-sm text-[#2C241D] placeholder-[#9C8B7D] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B2226]/30 focus:border-[#9B2226] transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-[#786454] hover:text-[#2C241D] rounded-lg transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <VoiceInputButton
              onTranscript={(text) => setSearchQuery(text)}
              placeholderPrompt="Nói tên áo: Áo dài, áo tấc, nhật bình, áo ngũ thân..."
              size="md"
            />
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-xs text-[#7B6858] mr-1 hidden sm:inline">Phân loại trang phục:</span>
          {quickFilters.map((filter, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(filter.query)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                searchQuery.toLowerCase() === filter.query.toLowerCase()
                  ? 'bg-[#800E13] text-white shadow-xs'
                  : 'bg-[#EFE7DD] text-[#55473D] hover:bg-[#E5DACD]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Google Search Grounding Feature Banner */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="rounded-2xl border border-[#DFD1BD] bg-[#FAF5EE] p-4 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#800E13] text-white flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#2C241D] flex items-center gap-1.5">
                  <span>Khảo Cứu Lịch Sử với Google Search Grounding</span>
                  <span className="text-[10px] bg-[#800E13]/10 text-[#800E13] font-semibold px-2 py-0.5 rounded-full">
                    gemini-3.5-flash
                  </span>
                </h4>
                <p className="text-[11px] sm:text-xs text-[#6C584C]">
                  Xác thực điển chế triều đình, tài liệu học thuật và bảo tàng mới nhất
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGroundingPanel(!showGroundingPanel)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#DFD1BD] hover:border-[#800E13] text-[#800E13] rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{showGroundingPanel ? 'Thu gọn' : 'Tra cứu trực tuyến'}</span>
            </button>
          </div>

          {/* Expandable Grounding Panel */}
          {showGroundingPanel && (
            <div className="mt-4 pt-4 border-t border-[#EAE0D3] space-y-3 animate-in fade-in">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={groundingQuery}
                  onChange={(e) => setGroundingQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteGrounding()}
                  placeholder="Đặt câu hỏi lịch sử (VD: Nguồn gốc áo tứ thân, 5 khuy áo ngũ thân...)"
                  className="flex-1 px-3.5 py-2 bg-white border border-[#DFD1BD] rounded-xl text-xs sm:text-sm text-[#2C241D] placeholder-[#9C8B7D] focus:outline-none focus:ring-2 focus:ring-[#800E13]/20"
                />
                <button
                  onClick={() => handleExecuteGrounding()}
                  disabled={isGroundingLoading || !groundingQuery.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isGroundingLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Tra cứu</span>
                </button>
              </div>

              {/* Sample Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-[#786454] flex items-center gap-1 mr-1">
                  <HelpCircle className="w-3 h-3 text-[#800E13]" />
                  Câu hỏi gợi ý:
                </span>
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setGroundingQuery(q);
                      handleExecuteGrounding(q);
                    }}
                    className="text-[10px] sm:text-[11px] px-2.5 py-1 bg-white hover:bg-[#F3EADB] text-[#55473D] border border-[#DFD1BD] rounded-lg transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {isGroundingLoading && (
                <div className="py-6 text-center space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#800E13] mx-auto" />
                  <p className="text-xs text-[#786454]">
                    Đang tìm kiếm và tổng hợp các nguồn tư liệu lịch sử uy tín từ Google Search...
                  </p>
                </div>
              )}

              {/* Result Container */}
              {groundingResult && !isGroundingLoading && (
                <div className="mt-3 p-4 bg-white rounded-2xl border border-[#DFD1BD] space-y-3 shadow-xs">
                  <div className="text-xs sm:text-sm text-[#3E342B] leading-relaxed whitespace-pre-line">
                    {groundingResult.text}
                  </div>

                  {groundingResult.sources && groundingResult.sources.length > 0 && (
                    <div className="pt-2 border-t border-[#F0E6D8]">
                      <span className="text-[11px] font-bold text-[#800E13] block mb-1.5">
                        Nguồn tư liệu dẫn chứng:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {groundingResult.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#F3EADB] text-[11px] text-[#2C241D] hover:text-[#800E13] border border-[#E3D6C5] rounded-md transition-colors"
                          >
                            <span className="max-w-[200px] truncate">{src.title}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Costume Grid */}
      {isSearching ? (
        <div className="text-center py-16">
          <p className="text-sm text-[#786454]">Đang tra cứu kho lưu trữ...</p>
        </div>
      ) : costumes.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-[#DFD5C6] max-w-lg mx-auto p-8">
          <p className="font-heritage text-lg text-[#2C241D] font-bold">Không tìm thấy trang phục phù hợp</p>
          <p className="text-xs text-[#786454] mt-1">
            Hãy thử đổi bộ lọc giới tính hoặc tìm bằng từ khóa phổ biến như "Áo Dài", "Áo Tứ Thân", "Áo Ngũ Thân".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setGenderFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-[#9B2226] text-white text-xs font-medium rounded-xl hover:bg-[#800E13] transition-colors"
          >
            Xem toàn bộ trang phục
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {costumes.map((costume) => {
            const currentMode = cardPhotoModes[costume.id] || 'front';
            const displayImg = getCardImage(costume);

            const genderBadge = (() => {
              if (costume.gender === 'female') return { text: 'Nữ ♀', color: 'bg-rose-900/80 text-rose-100 border-rose-300/30' };
              if (costume.gender === 'male') return { text: 'Nam ♂', color: 'bg-blue-900/80 text-blue-100 border-blue-300/30' };
              return { text: 'Nam & Nữ ⚥', color: 'bg-emerald-900/80 text-emerald-100 border-emerald-300/30' };
            })();

            return (
              <div
                key={costume.id}
                onClick={() => setSelectedCostume(costume)}
                className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E9DFD1] shadow-xs hover:shadow-xl hover:border-[#D4A373] transition-all duration-300 cursor-pointer"
              >
                {/* Photo Box with Tops Selector */}
                <div className="relative h-72 w-full overflow-hidden bg-stone-900">
                  <img
                    src={displayImg}
                    alt={costume.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-85 group-hover:opacity-95 transition-opacity" />

                  {/* Dynasty & Gender & Region Tags */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 items-center z-10">
                    <span className="text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      {costume.dynasty}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-md border ${genderBadge.color}`}>
                      {genderBadge.text}
                    </span>
                    {costume.region && (
                      <span className="text-[10px] font-medium text-white/95 bg-[#800E13]/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {costume.region}
                      </span>
                    )}
                  </div>

                  {/* Floating Tops Switcher on Card */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-12 left-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/20 z-10"
                  >
                    <button
                      onClick={() => setCardPhotoModes(prev => ({ ...prev, [costume.id]: 'front' }))}
                      className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                        currentMode === 'front'
                          ? 'bg-white text-[#2C241D] shadow-xs'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Toàn cảnh
                    </button>

                    {costume.maleTopImage && (
                      <button
                        onClick={() => setCardPhotoModes(prev => ({ ...prev, [costume.id]: 'male' }))}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          currentMode === 'male'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <User className="w-2.5 h-2.5" />
                        <span>Áo Nam ♂</span>
                      </button>
                    )}

                    {costume.femaleTopImage && (
                      <button
                        onClick={() => setCardPhotoModes(prev => ({ ...prev, [costume.id]: 'female' }))}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          currentMode === 'female'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <User className="w-2.5 h-2.5" />
                        <span>Áo Nữ ♀</span>
                      </button>
                    )}

                    {!costume.maleTopImage && !costume.femaleTopImage && costume.topImage && (
                      <button
                        onClick={() => setCardPhotoModes(prev => ({ ...prev, [costume.id]: 'top' }))}
                        className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          currentMode === 'top'
                            ? 'bg-[#800E13] text-white shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <Shirt className="w-2.5 h-2.5" />
                        <span>Áo Thượng Phục</span>
                      </button>
                    )}
                  </div>

                  {/* Bottom title on image */}
                  <div className="absolute bottom-2.5 left-4 right-4 z-10">
                    <h3 className="font-heritage text-lg sm:text-xl font-bold text-white tracking-wide group-hover:text-[#E9C46A] transition-colors">
                      {costume.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-[#5C4D3C] line-clamp-2 leading-relaxed">
                    {costume.shortDesc}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-[#F0E6D8] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#9B2226] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Xem chi tiết & lịch sử</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    <span className="text-[11px] text-[#8C7A6B]">
                      {costume.era}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Costume Detail Modal */}
      {selectedCostume && (
        <CostumeDetailModal
          costume={selectedCostume}
          onClose={() => setSelectedCostume(null)}
        />
      )}
    </div>
  );
};

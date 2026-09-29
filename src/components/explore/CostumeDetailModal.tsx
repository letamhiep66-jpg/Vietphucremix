import React, { useState } from 'react';
import { TraditionalCostume } from '../../types';
import { useApp } from '../../context/AppContext';
import { searchGroundedCostumeHistory, GroundingSearchResult } from '../../services/groundingService';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  Calendar, 
  ArrowRight, 
  Search, 
  ExternalLink, 
  Globe, 
  Layers, 
  Compass, 
  Loader2,
  Shirt,
  User,
  Users
} from 'lucide-react';

interface CostumeDetailModalProps {
  costume: TraditionalCostume;
  onClose: () => void;
}

export const CostumeDetailModal: React.FC<CostumeDetailModalProps> = ({
  costume,
  onClose
}) => {
  const { selectCostumeForMix } = useApp();
  const [activeTab, setActiveTab] = useState<'features' | 'tops' | 'history' | 'occasions' | 'grounding'>('features');
  const [activePhotoView, setActivePhotoView] = useState<'front' | 'male-top' | 'female-top' | 'top'>('front');
  
  // Google Search Grounding state
  const [groundingResult, setGroundingResult] = useState<GroundingSearchResult | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);

  const handleUseForMix = () => {
    selectCostumeForMix(costume);
    onClose();
  };

  const handleRunGrounding = async () => {
    setIsGroundingLoading(true);
    try {
      const res = await searchGroundedCostumeHistory('', costume.name);
      setGroundingResult(res);
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // Determine which image to show on the left based on activePhotoView
  const currentDisplayImage = (() => {
    if (activePhotoView === 'male-top' && costume.maleTopImage) return costume.maleTopImage;
    if (activePhotoView === 'female-top' && costume.femaleTopImage) return costume.femaleTopImage;
    if (activePhotoView === 'top' && costume.topImage) return costume.topImage;
    return costume.frontImage;
  })();

  const genderBadge = (() => {
    if (costume.gender === 'female') {
      return { text: 'Trang phục Nữ ♀', color: 'bg-rose-900/90 text-rose-100 border-rose-400/30' };
    }
    if (costume.gender === 'male') {
      return { text: 'Trang phục Nam ♂', color: 'bg-slate-900/90 text-blue-100 border-blue-400/30' };
    }
    return { text: 'Trang phục Nam & Nữ ⚥', color: 'bg-amber-900/90 text-amber-100 border-amber-400/30' };
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl max-h-[92vh] bg-[#FFFDF9] rounded-3xl shadow-2xl overflow-hidden border border-[#E7DAC8]">
        {/* Left Side: Real Costume Photo & Tops Switcher */}
        <div className="relative w-full md:w-5/12 bg-stone-900 h-72 md:h-auto overflow-hidden flex flex-col justify-between p-4">
          <img
            src={currentDisplayImage}
            alt={costume.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

          {/* Badges: Triều Đại & Giới Tính & Vùng Miền */}
          <div className="relative z-10 flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-white bg-[#9B2226]/90 px-3 py-1 rounded-full backdrop-blur-xs shadow-xs border border-white/20">
              {costume.dynasty}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md border ${genderBadge.color}`}>
              {genderBadge.text}
            </span>
            {costume.region && (
              <span className="text-[11px] font-medium text-[#2C241D] bg-[#FBF8F3]/90 px-2 py-0.5 rounded-full backdrop-blur-xs border border-[#E7DAC8]">
                {costume.region}
              </span>
            )}
          </div>

          {/* Controls: Switch between Front Photo, Men's Top Photo, Women's Top Photo */}
          <div className="relative z-10 space-y-2 mt-auto">
            {/* Photo View Selector */}
            <div className="flex flex-wrap gap-1 bg-black/50 p-1 rounded-xl backdrop-blur-md border border-white/20">
              <button
                onClick={() => setActivePhotoView('front')}
                className={`flex-1 py-1 px-2 text-[11px] font-medium rounded-lg transition-all ${
                  activePhotoView === 'front'
                    ? 'bg-white text-[#2C241D] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Toàn Cảnh
              </button>

              {costume.maleTopImage && (
                <button
                  onClick={() => setActivePhotoView('male-top')}
                  className={`flex-1 py-1 px-2 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                    activePhotoView === 'male-top'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Áo Nam ♂</span>
                </button>
              )}

              {costume.femaleTopImage && (
                <button
                  onClick={() => setActivePhotoView('female-top')}
                  className={`flex-1 py-1 px-2 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                    activePhotoView === 'female-top'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Áo Nữ ♀</span>
                </button>
              )}

              {!costume.maleTopImage && !costume.femaleTopImage && costume.topImage && (
                <button
                  onClick={() => setActivePhotoView('top')}
                  className={`flex-1 py-1 px-2 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                    activePhotoView === 'top'
                      ? 'bg-[#800E13] text-white shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Shirt className="w-3 h-3" />
                  <span>Áo Thượng Phục</span>
                </button>
              )}
            </div>

            {/* Quick 2D Dress-up Button */}
            <button
              onClick={handleUseForMix}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-white/30 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-[#E9C46A]" />
              <span>Thử phối bộ này trên Ma-nơ-canh 2D</span>
            </button>
          </div>
        </div>

        {/* Right Side: Information Tabs & Accordion */}
        <div className="flex-1 flex flex-col p-5 sm:p-7 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9B2226]">
                  Di sản trang phục dân tộc · {costume.era}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFE7DD] text-[#55473D] font-bold">
                  {costume.gender === 'female' ? 'Nữ giới' : costume.gender === 'male' ? 'Nam giới' : 'Nam & Nữ'}
                </span>
              </div>
              <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-[#2C241D] mt-0.5">
                {costume.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-2 text-sm text-[#5C4D3C] italic leading-relaxed">
            "{costume.shortDesc}"
          </p>

          {/* Tabs Navigation */}
          <div className="flex border-b border-[#E6DCCF] mt-5 gap-2 overflow-x-auto pb-0.5">
            <button
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'features'
                  ? 'border-[#9B2226] text-[#800E13]'
                  : 'border-transparent text-[#6C584C] hover:text-[#2C241D]'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Đặc điểm nhận diện</span>
            </button>

            <button
              onClick={() => setActiveTab('tops')}
              className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'tops'
                  ? 'border-[#9B2226] text-[#800E13]'
                  : 'border-transparent text-[#6C584C] hover:text-[#2C241D]'
              }`}
            >
              <Shirt className="w-4 h-4 text-[#800E13]" />
              <span>Áo Thượng Phục (Nam / Nữ)</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'history'
                  ? 'border-[#9B2226] text-[#800E13]'
                  : 'border-transparent text-[#6C584C] hover:text-[#2C241D]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Bối cảnh lịch sử</span>
            </button>

            <button
              onClick={() => setActiveTab('occasions')}
              className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'occasions'
                  ? 'border-[#9B2226] text-[#800E13]'
                  : 'border-transparent text-[#6C584C] hover:text-[#2C241D]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Dịp phù hợp</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('grounding');
                if (!groundingResult && !isGroundingLoading) {
                  handleRunGrounding();
                }
              }}
              className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'grounding'
                  ? 'border-[#9B2226] text-[#800E13]'
                  : 'border-transparent text-[#6C584C] hover:text-[#2C241D]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#9B2226]" />
              <span>Tra cứu Google Search</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-4 flex-1">
            {activeTab === 'features' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <p className="text-xs text-[#7B6858] mb-2 font-medium">
                    Các chi tiết nhận diện cốt lõi:
                  </p>
                  <div className="grid gap-2">
                    {costume.identificationFeatures.map((feat, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7F2EB] border border-[#E9DFD2]"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#9B2226] text-white text-[11px] font-bold shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-xs sm:text-sm text-[#3E342B] leading-snug">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cấu trúc chi tiết */}
                {costume.structureComponents && costume.structureComponents.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#E5DACD]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#800E13] mb-2">
                      <Layers className="w-4 h-4" />
                      <span>Cấu trúc thành phần trang phục:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {costume.structureComponents.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-[#DFD1BD] rounded-lg text-xs text-[#55473D]"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tác phong & Quy cách */}
                {costume.wearingEtiquette && (
                  <div className="p-3 rounded-xl bg-[#F4F1EA] border border-[#E2D8C9] text-xs text-[#4A3E35]">
                    <span className="font-semibold block mb-0.5 text-[#800E13]">Tác phong & Quy cách mặc:</span>
                    {costume.wearingEtiquette}
                  </div>
                )}

                {costume.culturalNotes && (
                  <div className="p-3 rounded-xl bg-[#FFF6EE] border border-[#F2D7BF] text-xs text-[#804000]">
                    <span className="font-semibold block mb-0.5">Lưu ý văn hóa & Điển lệ:</span>
                    {costume.culturalNotes}
                  </div>
                )}
              </div>
            )}

            {/* TAB: CHI TIẾT ÁO THƯỢNG PHỤC (NAM / NỮ) */}
            {activeTab === 'tops' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3 rounded-2xl bg-[#FAF5EE] border border-[#E5DACD] text-xs text-[#6C584C]">
                  Khảo sát cận cảnh phần áo thượng phục (cổ áo, vạt áo, đường nẹp, khuy cúc và phom dáng tay áo) theo từng giới tính:
                </div>

                {/* Case 1: Costume has both Men's Top and Women's Top */}
                {costume.maleTopImage && costume.femaleTopImage && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Men's Top Card */}
                    <div className="p-3.5 bg-white rounded-2xl border border-[#DFD5C6] shadow-xs space-y-2.5">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-900">
                        <img
                          src={costume.maleTopImage}
                          alt="Áo Thượng Phục Nam"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-blue-900/90 text-white rounded-lg text-[10px] font-bold">
                          Áo Thượng Phục Nam ♂
                        </div>
                      </div>
                      <h4 className="font-bold text-xs text-[#2C241D] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>Đặc Trưng Áo Nam</span>
                      </h4>
                      <p className="text-xs text-[#55473D] leading-relaxed">
                        {costume.maleTopDesc || 'Phom dáng thẳng đĩnh đạc, cổ cao vuông vức, tay áo gọn gàng.'}
                      </p>
                      <button
                        onClick={() => setActivePhotoView('male-top')}
                        className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Xem ảnh áo nam trên khung ảnh lớn
                      </button>
                    </div>

                    {/* Women's Top Card */}
                    <div className="p-3.5 bg-white rounded-2xl border border-[#DFD5C6] shadow-xs space-y-2.5">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-900">
                        <img
                          src={costume.femaleTopImage}
                          alt="Áo Thượng Phục Nữ"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-rose-900/90 text-white rounded-lg text-[10px] font-bold">
                          Áo Thượng Phục Nữ ♀
                        </div>
                      </div>
                      <h4 className="font-bold text-xs text-[#2C241D] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-rose-700" />
                        <span>Đặc Trưng Áo Nữ</span>
                      </h4>
                      <p className="text-xs text-[#55473D] leading-relaxed">
                        {costume.femaleTopDesc || 'Đường nẹp uốn lượn mềm mại, chiết ôm nhẹ, tôn nét đoan trang hiền dịu.'}
                      </p>
                      <button
                        onClick={() => setActivePhotoView('female-top')}
                        className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Xem ảnh áo nữ trên khung ảnh lớn
                      </button>
                    </div>
                  </div>
                )}

                {/* Case 2: Only Men's Top */}
                {costume.maleTopImage && !costume.femaleTopImage && (
                  <div className="p-4 bg-white rounded-2xl border border-[#DFD5C6] shadow-xs space-y-3">
                    <div className="relative h-56 rounded-xl overflow-hidden bg-stone-900">
                      <img
                        src={costume.maleTopImage}
                        alt="Áo Thượng Phục Nam"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-blue-900/90 text-white rounded-lg text-xs font-bold">
                        Áo Thượng Phục Nam Giới ♂
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#3E342B] leading-relaxed">
                      {costume.maleTopDesc}
                    </p>
                  </div>
                )}

                {/* Case 3: Only Women's Top */}
                {!costume.maleTopImage && costume.femaleTopImage && (
                  <div className="p-4 bg-white rounded-2xl border border-[#DFD5C6] shadow-xs space-y-3">
                    <div className="relative h-56 rounded-xl overflow-hidden bg-stone-900">
                      <img
                        src={costume.femaleTopImage}
                        alt="Áo Thượng Phục Nữ"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-rose-900/90 text-white rounded-lg text-xs font-bold">
                        Áo Thượng Phục Nữ Giới ♀
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#3E342B] leading-relaxed">
                      {costume.femaleTopDesc}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EAE0D3] shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="w-4 h-4 text-[#9B2226]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#800E13]">
                      Bối cảnh lịch sử & Dòng chảy thời đại
                    </span>
                  </div>
                  <p className="text-sm text-[#3E342B] leading-relaxed text-justify">
                    {costume.historyStory}
                  </p>
                </div>

                {costume.modernRemixTips && (
                  <div className="p-3.5 rounded-2xl bg-[#F7F2EB] border border-[#E3D6C5]">
                    <span className="text-xs font-bold text-[#800E13] block mb-1">
                      Gợi ý ứng dụng Remix đương đại:
                    </span>
                    <p className="text-xs text-[#55473D] leading-relaxed">
                      {costume.modernRemixTips}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'occasions' && (
              <div className="space-y-3 animate-in fade-in">
                <p className="text-xs text-[#7B6858]">
                  Không gian, sự kiện và nghi lễ lý tưởng để diện trang phục này:
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {costume.suitableOccasions.map((occ, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F2EB] border border-[#E9DFD2]"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#9B2226]" />
                      <span className="text-xs sm:text-sm font-medium text-[#2C241D]">
                        {occ}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'grounding' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4EDE2] border border-[#DFD1BD]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#9B2226]" />
                    <span className="text-xs font-semibold text-[#2C241D]">
                      Dữ liệu xác thực từ Google Search Grounding
                    </span>
                  </div>
                  <button
                    onClick={handleRunGrounding}
                    disabled={isGroundingLoading}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#FAF5EE] text-[#800E13] border border-[#DFD1BD] rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isGroundingLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>{isGroundingLoading ? 'Đang tra cứu...' : 'Cập nhật tra cứu'}</span>
                  </button>
                </div>

                {isGroundingLoading && (
                  <div className="py-8 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#9B2226] mx-auto" />
                    <p className="text-xs text-[#786454]">
                      Đang kết nối Google Search để khảo cứu tư liệu học thuật mới nhất...
                    </p>
                  </div>
                )}

                {groundingResult && !isGroundingLoading && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white border border-[#DFD1BD] text-xs sm:text-sm text-[#3E342B] leading-relaxed whitespace-pre-line shadow-xs">
                      {groundingResult.text}
                    </div>

                    {/* Sources & Citations */}
                    {groundingResult.sources && groundingResult.sources.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#E3D6C5]">
                        <span className="text-xs font-bold text-[#800E13] block mb-2">
                          Nguồn tư liệu & đường dẫn trích dẫn:
                        </span>
                        <div className="space-y-1.5">
                          {groundingResult.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E8DEC8] hover:border-[#9B2226] text-xs text-[#2C241D] hover:text-[#9B2226] transition-colors"
                            >
                              <span className="truncate pr-2">{src.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
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

          {/* CTA Footer: "Dùng bộ này để phối đồ" */}
          <div className="pt-4 border-t border-[#E6DCCF] flex items-center justify-between gap-3">
            <span className="text-xs text-[#7B6858] hidden sm:block">
              Sẵn sàng tạo bản phối Remix hiện đại?
            </span>
            <button
              onClick={handleUseForMix}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 bg-[#800E13] hover:bg-[#9B2226] text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-[#800E13]/20 hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>Dùng bộ này để phối đồ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

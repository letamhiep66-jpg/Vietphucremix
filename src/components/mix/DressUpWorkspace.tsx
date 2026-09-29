import React, { useState } from 'react';
import { 
  TraditionalCostume, 
  ModernGarment, 
  AccessoryItem, 
  ColorItem, 
  UserWardrobeItem,
  EquippedLayers
} from '../../types';
import { 
  Shirt, 
  Sparkles, 
  Layers, 
  Check, 
  Palette, 
  Plus, 
  Search,
  RotateCcw,
  Tag,
  Package,
  ArrowRight
} from 'lucide-react';

export interface DressUpWorkspaceProps {
  traditionalCostumes: TraditionalCostume[];
  modernGarments: ModernGarment[];
  accessoryItems: AccessoryItem[];
  traditionalColors: ColorItem[];
  modernColors: ColorItem[];
  wardrobeItems: UserWardrobeItem[];
  equippedLayers: EquippedLayers;
  selectedTraditional: TraditionalCostume;
  selectedModern: ModernGarment | UserWardrobeItem | null;
  selectedAccessory: AccessoryItem | UserWardrobeItem | null;
  selectedTraditionalColor: ColorItem;
  selectedModernColor: ColorItem;
  onSelectCostume: (costume: TraditionalCostume) => void;
  onSelectModern: (garment: ModernGarment | UserWardrobeItem | null) => void;
  onSelectAccessory: (accessory: AccessoryItem | UserWardrobeItem | null) => void;
  onSelectTraditionalColor: (color: ColorItem) => void;
  onSelectModernColor: (color: ColorItem) => void;
  onOpenWardrobeModal: () => void;
  onToggleLayerEquip?: (item: any, layerType: string) => void;
  onResetOutfit?: () => void;
}

export type WorkspaceTab = 'traditional' | 'modern' | 'shoes' | 'accessory' | 'wardrobe' | 'colors';

export const DressUpWorkspace: React.FC<DressUpWorkspaceProps> = ({
  traditionalCostumes,
  modernGarments,
  accessoryItems,
  traditionalColors,
  modernColors,
  wardrobeItems,
  equippedLayers,
  selectedTraditional,
  selectedModern,
  selectedAccessory,
  selectedTraditionalColor,
  selectedModernColor,
  onSelectCostume,
  onSelectModern,
  onSelectAccessory,
  onSelectTraditionalColor,
  onSelectModernColor,
  onOpenWardrobeModal,
  onToggleLayerEquip,
  onResetOutfit
}) => {
  // 5 Main Tabs + Colors
  // [Cổ Phục Truyền Thống] | [Lớp Hiện Đại] | [Giày Dép] | [Phụ Kiện] | [Tủ Đồ Của Tôi] | [Hòa Sắc]
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('traditional');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Check if an item is currently equipped on the 2D mannequin
  const isItemEquipped = (id: string, category: string): boolean => {
    if (category === 'traditional') {
      return (
        selectedTraditional.id === id || 
        equippedLayers.outerTop?.id === id || 
        equippedLayers.innerTop?.id === id
      );
    }
    if (category === 'modern') {
      return (
        selectedModern?.id === id || 
        equippedLayers.bottom?.id === id || 
        equippedLayers.outerTop?.id === id
      );
    }
    if (category === 'shoes') {
      return Boolean(
        equippedLayers.shoes?.id === id || 
        (selectedModern && 'category' in selectedModern && selectedModern.category === 'shoes' && selectedModern.id === id)
      );
    }
    if (category === 'accessory') {
      return (
        selectedAccessory?.id === id || 
        equippedLayers.accessoryBack?.id === id || 
        equippedLayers.accessoryFront?.id === id
      );
    }
    if (category === 'wardrobe') {
      return (
        equippedLayers.bottom?.id === id ||
        equippedLayers.innerTop?.id === id ||
        equippedLayers.outerTop?.id === id ||
        equippedLayers.shoes?.id === id ||
        equippedLayers.accessoryFront?.id === id ||
        equippedLayers.accessoryBack?.id === id ||
        selectedModern?.id === id ||
        selectedAccessory?.id === id
      );
    }
    return false;
  };

  // Filtered lists
  const filteredTraditionals = traditionalCostumes.filter((c) => {
    if (genderFilter === 'female' && c.gender === 'male') return false;
    if (genderFilter === 'male' && c.gender === 'female') return false;
    if (searchQuery.trim()) {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.dynasty.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const modernClothingItems = modernGarments.filter((m) => m.category === 'jacket' || m.category === 'pants' || m.category === 'skirt');
  const shoesItems = modernGarments.filter((m) => m.category === 'shoes');

  // Handle Traditional item click
  const handleTraditionalClick = (costume: TraditionalCostume) => {
    if (onToggleLayerEquip) {
      const layerType = costume.layerType || (costume.id === 'ao-yem-co-truyen' ? 'inner_top' : 'outer_top');
      onToggleLayerEquip(costume, layerType);
    } else {
      onSelectCostume(costume);
    }
  };

  // Handle Modern garment click (toggle equip / unequip)
  const handleModernClick = (item: ModernGarment | UserWardrobeItem) => {
    if (onToggleLayerEquip) {
      const layerType = 'layerType' in item && item.layerType 
        ? item.layerType 
        : (item.category === 'shoes' ? 'shoes' : ['pants', 'skirt'].includes(item.category) ? 'bottom' : 'outer_top');
      onToggleLayerEquip(item, layerType);
    } else {
      if (selectedModern?.id === item.id) {
        onSelectModern(null);
      } else {
        onSelectModern(item);
      }
    }
  };

  // Handle Accessory click (toggle equip / unequip)
  const handleAccessoryClick = (item: AccessoryItem | UserWardrobeItem) => {
    if (onToggleLayerEquip) {
      const isHat = (item as any).category === 'hat';
      const layerType = 'layerType' in item && item.layerType 
        ? item.layerType 
        : (isHat ? 'accessory_back' : 'accessory_front');
      onToggleLayerEquip(item, layerType);
    } else {
      if (selectedAccessory?.id === item.id) {
        onSelectAccessory(null);
      } else {
        onSelectAccessory(item);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#E9DFD1] shadow-md overflow-hidden">
      {/* Workspace Header */}
      <div className="px-5 pt-4 pb-3 bg-[#FAF6F0] border-b border-[#E9DFD1]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-[#800E13]" />
            <h3 className="font-heritage text-base sm:text-lg font-bold text-[#2C241D]">
              Tủ Đồ Phối Lớp 2D
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {onResetOutfit && (
              <button
                onClick={onResetOutfit}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-stone-100 text-[#786454] border border-[#D5C2AF] rounded-xl text-xs font-medium transition-all"
                title="Xóa hết và mặc lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mặc lại</span>
              </button>
            )}

            <button
              onClick={onOpenWardrobeModal}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#800E13]/10 hover:bg-[#800E13]/20 text-[#800E13] rounded-xl text-xs font-bold transition-all"
              title="Quản lý đồ cá nhân"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm đồ riêng ({wardrobeItems.length})</span>
            </button>
          </div>
        </div>

        {/* 5 Main Tabs with Icons: [Cổ Phục Truyền Thống] | [Lớp Hiện Đại] | [Giày Dép] | [Phụ Kiện] | [Tủ Đồ Của Tôi] */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('traditional')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'traditional'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'bg-white text-[#6C584C] hover:bg-[#F2EAE0] border border-[#DFD1BD]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cổ Phục Truyền Thống</span>
          </button>

          <button
            onClick={() => setActiveTab('modern')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'modern'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'bg-white text-[#6C584C] hover:bg-[#F2EAE0] border border-[#DFD1BD]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Lớp Hiện Đại</span>
          </button>

          <button
            onClick={() => setActiveTab('shoes')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'shoes'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'bg-white text-[#6C584C] hover:bg-[#F2EAE0] border border-[#DFD1BD]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Giày Dép</span>
          </button>

          <button
            onClick={() => setActiveTab('accessory')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'accessory'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'bg-white text-[#6C584C] hover:bg-[#F2EAE0] border border-[#DFD1BD]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phụ Kiện</span>
          </button>

          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'wardrobe'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'bg-white text-[#6C584C] hover:bg-[#F2EAE0] border border-[#DFD1BD]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Tủ Đồ Của Tôi ({wardrobeItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'colors'
                ? 'bg-[#800E13] text-white shadow-sm'
                : 'bg-white text-[#6C584C] hover:bg-[#F2EAE0] border border-[#DFD1BD]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Hòa Sắc</span>
          </button>
        </div>
      </div>

      {/* Sub-Filters / Search bar */}
      {activeTab !== 'colors' && activeTab !== 'wardrobe' && (
        <div className="px-5 py-2.5 bg-[#FAF8F5] border-b border-[#F0E6D8] flex flex-wrap items-center justify-between gap-2 text-xs">
          {activeTab === 'traditional' ? (
            <div className="flex p-0.5 bg-[#E8DDD0] rounded-xl border border-[#D5C2AF] text-[11px] font-medium">
              <button
                onClick={() => setGenderFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  genderFilter === 'all'
                    ? 'bg-white text-[#800E13] font-bold shadow-xs'
                    : 'text-[#6C584C]'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setGenderFilter('female')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  genderFilter === 'female'
                    ? 'bg-[#800E13] text-white font-bold shadow-xs'
                    : 'text-[#6C584C]'
                }`}
              >
                Nữ ♀
              </button>
              <button
                onClick={() => setGenderFilter('male')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  genderFilter === 'male'
                    ? 'bg-[#1D3557] text-white font-bold shadow-xs'
                    : 'text-[#6C584C]'
                }`}
              >
                Nam ♂
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-[#786454]">
              {activeTab === 'modern' && 'Z-20 & Z-40: Phối quần âu, blazer, chân váy đương đại'}
              {activeTab === 'shoes' && 'Z-50: Hài thêu cung đình, chelsea boots, sneaker'}
              {activeTab === 'accessory' && 'Z-60: Khăn đóng, quạt trầm hương, túi gấm, kính râm'}
            </span>
          )}

          <div className="relative min-w-[150px] max-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm nhanh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white border border-[#DFD1BD] rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#800E13]"
            />
          </div>
        </div>
      )}

      {/* Main Item Grid Viewport */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[56vh] lg:max-h-[64vh]">
        {/* ========================================================= */}
        {/* TAB 1: CỔ PHỤC TRUYỀN THỐNG                                */}
        {/* ========================================================= */}
        {activeTab === 'traditional' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {filteredTraditionals.map((costume) => {
                const equipped = isItemEquipped(costume.id, 'traditional');
                const zIndexLabel = costume.id === 'ao-yem-co-truyen' ? 'Z-30 Lớp Trong' : 'Z-40 Cổ Phục';

                return (
                  <div
                    key={costume.id}
                    onClick={() => handleTraditionalClick(costume)}
                    className={`group relative p-2.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                      equipped
                        ? 'border-[#800E13] bg-[#FAF5EE] ring-2 ring-[#800E13] shadow-md -translate-y-0.5'
                        : 'border-[#E9DFD1] hover:border-[#D4A373] bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={costume.frontImage}
                        alt={costume.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs font-mono">
                        {zIndexLabel}
                      </div>

                      {equipped && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#800E13] text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-[#2C241D] line-clamp-1 group-hover:text-[#800E13] transition-colors">
                      {costume.name}
                    </h4>
                    <p className="text-[10px] text-[#8C7A6B] line-clamp-1 mt-0.5">
                      {costume.dynasty} · {costume.gender === 'female' ? 'Nữ ♀' : costume.gender === 'male' ? 'Nam ♂' : 'Song phái ⚥'}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#F0E6D8] flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${equipped ? 'text-[#800E13]' : 'text-stone-400'}`}>
                        {equipped ? '✓ Đang mặc (Gỡ ra)' : '+ Chạm để mặc'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LỚP HIỆN ĐẠI (Áo khoác, Quần âu, Váy xếp ly)        */}
        {/* ========================================================= */}
        {activeTab === 'modern' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {modernClothingItems.map((item) => {
                const equipped = isItemEquipped(item.id, 'modern');
                const zIndexLabel = ['pants', 'skirt'].includes(item.category) ? 'Z-20 Hạ Phục' : 'Z-40 Khoác Ngoài';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleModernClick(item)}
                    className={`group relative p-2.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                      equipped
                        ? 'border-[#800E13] bg-[#FAF5EE] ring-2 ring-[#800E13] shadow-md -translate-y-0.5'
                        : 'border-[#E9DFD1] hover:border-[#D4A373] bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs font-mono">
                        {zIndexLabel}
                      </div>

                      {equipped && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#800E13] text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-[#2C241D] line-clamp-1 group-hover:text-[#800E13] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#8C7A6B] line-clamp-1 mt-0.5">
                      {item.colorName} · {item.styleDesc}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#F0E6D8] flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${equipped ? 'text-[#800E13]' : 'text-stone-400'}`}>
                        {equipped ? '✓ Đang mặc (Gỡ ra)' : '+ Chạm để mặc'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GIÀY DÉP (Hài thêu, guốc mộc, boots, sneaker)       */}
        {/* ========================================================= */}
        {activeTab === 'shoes' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {shoesItems.map((item) => {
                const equipped = isItemEquipped(item.id, 'shoes');

                return (
                  <div
                    key={item.id}
                    onClick={() => handleModernClick(item)}
                    className={`group relative p-2.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                      equipped
                        ? 'border-[#800E13] bg-[#FAF5EE] ring-2 ring-[#800E13] shadow-md -translate-y-0.5'
                        : 'border-[#E9DFD1] hover:border-[#D4A373] bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs font-mono">
                        Z-50 Giày
                      </div>

                      {equipped && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#800E13] text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-[#2C241D] line-clamp-1 group-hover:text-[#800E13] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#8C7A6B] line-clamp-1 mt-0.5">
                      {item.colorName}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#F0E6D8] flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${equipped ? 'text-[#800E13]' : 'text-stone-400'}`}>
                        {equipped ? '✓ Đang đi (Gỡ ra)' : '+ Chạm để đi'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PHỤ KIỆN (Khăn, Túi, Quạt, Kính)                     */}
        {/* ========================================================= */}
        {activeTab === 'accessory' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {accessoryItems.map((item) => {
                const equipped = isItemEquipped(item.id, 'accessory');
                const zIndexLabel = 'Z-60 Phụ Kiện';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAccessoryClick(item)}
                    className={`group relative p-2.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                      equipped
                        ? 'border-[#800E13] bg-[#FAF5EE] ring-2 ring-[#800E13] shadow-md -translate-y-0.5'
                        : 'border-[#E9DFD1] hover:border-[#D4A373] bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs font-mono">
                        {zIndexLabel}
                      </div>

                      {equipped && (
                        <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#800E13] text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-[#2C241D] line-clamp-1 group-hover:text-[#800E13] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#8C7A6B] line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#F0E6D8] flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${equipped ? 'text-[#800E13]' : 'text-stone-400'}`}>
                        {equipped ? '✓ Đang đeo (Gỡ ra)' : '+ Chạm để đeo'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TỦ ĐỒ CỦA TÔI (Đồ tự tải)                           */}
        {/* ========================================================= */}
        {activeTab === 'wardrobe' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#DFD1BD]">
              <div>
                <h4 className="font-heritage text-sm font-bold text-[#2C241D]">
                  Món Đồ Cá Nhân Của Bạn
                </h4>
                <p className="text-[11px] text-[#6C584C]">
                  Tự do đắp lên ma-nơ-canh 2D (Tối đa 5 món/phiên)
                </p>
              </div>
              <button
                onClick={onOpenWardrobeModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tải món mới</span>
              </button>
            </div>

            {wardrobeItems.length === 0 ? (
              <div className="text-center py-10 px-4 bg-stone-50 rounded-2xl border-2 border-dashed border-[#DFD1BD] space-y-3">
                <Package className="w-8 h-8 text-[#8C7A6B] mx-auto opacity-60" />
                <div>
                  <p className="text-xs font-semibold text-[#4A3E35]">
                    Chưa có món đồ cá nhân nào
                  </p>
                  <p className="text-[11px] text-[#8C7A6B] mt-1 max-w-sm mx-auto">
                    Tải lên túi xách, giày, hoặc áo khoác của bạn để thử phối trực tiếp cùng cổ phục Việt.
                  </p>
                </div>
                <button
                  onClick={onOpenWardrobeModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tải ảnh món đồ của bạn ngay</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {wardrobeItems.map((wItem) => {
                  const equipped = isItemEquipped(wItem.id, 'wardrobe');
                  const isShoes = wItem.category === 'shoes';
                  const isAcc = ['bag', 'jewelry', 'other'].includes(wItem.category);

                  const handleClick = () => {
                    if (isAcc) {
                      handleAccessoryClick(wItem);
                    } else {
                      handleModernClick(wItem);
                    }
                  };

                  return (
                    <div
                      key={wItem.id}
                      onClick={handleClick}
                      className={`group relative p-2.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                        equipped
                          ? 'border-[#800E13] bg-[#FAF5EE] ring-2 ring-[#800E13] shadow-md -translate-y-0.5'
                          : 'border-[#DFCFC0] hover:border-[#800E13] bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="relative h-28 rounded-xl overflow-hidden bg-stone-100 mb-2">
                        <img
                          src={wItem.frontImage || ''}
                          alt={wItem.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-[#800E13] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Tủ riêng
                        </span>
                        {equipped && (
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#800E13] text-white flex items-center justify-center shadow-md animate-in zoom-in-50">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <h4 className="font-semibold text-xs text-[#2C241D] truncate">
                        {wItem.name}
                      </h4>
                      <div className="mt-2 pt-2 border-t border-[#F0E6D8] text-[10px] font-semibold text-[#800E13]">
                        {equipped ? '✓ Đang mặc (Gỡ ra)' : '+ Chạm để mặc'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: HÒA SẮC TRUYỀN THỐNG & ĐƯƠNG ĐẠI                    */}
        {/* ========================================================= */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Traditional Color Palette */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-heritage text-sm font-bold text-[#2C241D]">
                  Sắc Mộc Cổ Truyền (Ngũ Hành)
                </span>
                <span className="text-[11px] font-semibold text-[#800E13]">
                  {selectedTraditionalColor.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {traditionalColors.map((color) => {
                  const isSelected = selectedTraditionalColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => onSelectTraditionalColor(color)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#800E13] bg-[#FAF5EE] ring-2 ring-[#800E13]/20 shadow-xs'
                          : 'border-[#E9DFD1] hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-stone-200 shrink-0 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-[#2C241D] block truncate">
                          {color.name}
                        </span>
                        <span className="text-[10px] text-[#8C7A6B] block truncate">
                          {color.meaning}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modern Color Palette */}
            <div className="pt-4 border-t border-[#F0E6D8]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heritage text-sm font-bold text-[#2C241D]">
                  Sắc Độ Tối Giản Đương Đại
                </span>
                <span className="text-[11px] font-semibold text-[#800E13]">
                  {selectedModernColor.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {modernColors.map((color) => {
                  const isSelected = selectedModernColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => onSelectModernColor(color)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#800E13] bg-[#FAF5EE] ring-2 ring-[#800E13]/20 shadow-xs'
                          : 'border-[#E9DFD1] hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-stone-200 shrink-0 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-[#2C241D] block truncate">
                          {color.name}
                        </span>
                        <span className="text-[10px] text-[#8C7A6B] block truncate">
                          {color.meaning}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DressUpWorkspace;

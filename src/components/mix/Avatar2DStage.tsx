import React, { useRef, useState } from 'react';
import { 
  TraditionalCostume, 
  ModernGarment, 
  AccessoryItem, 
  ColorItem, 
  UserWardrobeItem,
  EquippedLayers
} from '../../types';
import { 
  getBaseAvatarSvg, 
  getBackgroundSvg, 
  getGarmentOverlaySvg 
} from '../../utils/svgAvatars';
import { 
  Download, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Check, 
  User, 
  X,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export interface Avatar2DStageProps {
  equippedLayers: EquippedLayers;
  traditionalCostume: TraditionalCostume;
  modernGarment: ModernGarment | UserWardrobeItem | null;
  accessoryItem: AccessoryItem | UserWardrobeItem | null;
  traditionalColor: ColorItem;
  modernColor: ColorItem;
  onGenderChange?: (gender: 'male' | 'female') => void;
  onResetOutfit?: () => void;
  onOpenLookbookExport?: () => void;
  onUnequipLayer?: (layerCategory: 'bottom' | 'inner_top' | 'outer_top' | 'shoes' | 'accessory') => void;
}

export type BackgroundPreset = 'hue' | 'hoian' | 'thanglong' | 'studio';

export const Avatar2DStage: React.FC<Avatar2DStageProps> = ({
  equippedLayers,
  traditionalCostume,
  modernGarment,
  accessoryItem,
  traditionalColor,
  modernColor,
  onGenderChange,
  onResetOutfit,
  onOpenLookbookExport,
  onUnequipLayer
}) => {
  // Background presets: [Cố Đô Huế] | [Phố Cổ Hội An] | [Hoàng Thành Thăng Long] | [Studio Tối Giản]
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundPreset>('hue');
  const [activeHighlightLayer, setActiveHighlightLayer] = useState<string | null>(null);
  const [selectedLayerPopover, setSelectedLayerPopover] = useState<{
    id: string;
    name: string;
    category: 'bottom' | 'inner_top' | 'outer_top' | 'shoes' | 'accessory';
    zIndex: string;
  } | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureToast, setCaptureToast] = useState<string | null>(null);

  const baseGender = equippedLayers.baseGender || 'female';

  // Resolved active item per layer
  const bottomItem = equippedLayers.bottom || (modernGarment && ('category' in modernGarment) && ['pants', 'skirt'].includes(modernGarment.category) ? modernGarment : null);
  const innerItem = equippedLayers.innerTop || (traditionalCostume.id === 'ao-yem-co-truyen' ? traditionalCostume : null);
  const outerItem = equippedLayers.outerTop || (traditionalCostume.id !== 'ao-yem-co-truyen' ? traditionalCostume : (modernGarment && ('category' in modernGarment) && modernGarment.category === 'jacket' ? modernGarment : null));
  const shoesItem = equippedLayers.shoes || (modernGarment && ('category' in modernGarment) && modernGarment.category === 'shoes' ? modernGarment : null);
  const accItem = equippedLayers.accessoryFront || equippedLayers.accessoryBack || accessoryItem || null;

  // Gather all layers in display order with strict Z-indices according to prompt:
  // z-0: Background
  // z-10: Base Avatar (Mannequin)
  // z-20: Bottom (Hạ phục)
  // z-30: Inner top (Thượng phục lớp trong)
  // z-40: Outer top (Thượng phục chính / Cổ phục ngoài)
  // z-50: Shoes (Giày dép)
  // z-60: Foreground accessories (Phụ kiện tiền cảnh)
  const layersList = [
    {
      id: 'bg',
      name: backgroundTheme === 'hue' ? 'Cố Đô Huế' : backgroundTheme === 'hoian' ? 'Phố Cổ Hội An' : backgroundTheme === 'thanglong' ? 'Hoàng Thành Thăng Long' : 'Studio Tối Giản',
      zIndex: 'z-0',
      active: true,
      category: 'background' as const,
      canUnequip: false
    },
    {
      id: 'base-avatar',
      name: `Mannequin (${baseGender === 'female' ? 'Nữ ♀' : 'Nam ♂'})`,
      zIndex: 'z-10',
      active: true,
      category: 'avatar' as const,
      canUnequip: false
    },
    {
      id: 'bottom',
      name: bottomItem?.name || 'Chưa mặc',
      item: bottomItem,
      zIndex: 'z-20',
      active: Boolean(bottomItem),
      category: 'bottom' as const,
      canUnequip: true
    },
    {
      id: 'inner-top',
      name: innerItem?.name || 'Chưa mặc',
      item: innerItem,
      zIndex: 'z-30',
      active: Boolean(innerItem),
      category: 'inner_top' as const,
      canUnequip: true
    },
    {
      id: 'outer-top',
      name: outerItem?.name || 'Chưa mặc',
      item: outerItem,
      zIndex: 'z-40',
      active: Boolean(outerItem),
      category: 'outer_top' as const,
      canUnequip: true
    },
    {
      id: 'shoes',
      name: shoesItem?.name || 'Chưa đi',
      item: shoesItem,
      zIndex: 'z-50',
      active: Boolean(shoesItem),
      category: 'shoes' as const,
      canUnequip: true
    },
    {
      id: 'accessory',
      name: accItem?.name || 'Chưa đeo',
      item: accItem,
      zIndex: 'z-60',
      active: Boolean(accItem),
      category: 'accessory' as const,
      canUnequip: true
    }
  ];

  // Quick Direct Snapshot / Canvas Download (PNG 2D)
  const handleQuickDownload = async () => {
    setIsCapturing(true);
    setCaptureToast('Đang kết xuất hình ảnh 2D Mannequin...');

    try {
      const width = 800;
      const height = 1200;

      const bgSvgData = getBackgroundSvg(backgroundTheme);
      const avatarSvgData = getBaseAvatarSvg(baseGender);

      const activeGarmentSvgs: string[] = [];

      // z-20: Bottom
      if (bottomItem) {
        activeGarmentSvgs.push(getGarmentOverlaySvg(bottomItem.id, modernColor.hex));
      }

      // z-30: Inner top
      if (innerItem) {
        activeGarmentSvgs.push(getGarmentOverlaySvg(innerItem.id, traditionalColor.hex));
      }

      // z-40: Outer top
      if (outerItem) {
        activeGarmentSvgs.push(getGarmentOverlaySvg(outerItem.id, traditionalColor.hex));
      }

      // z-50: Shoes
      if (shoesItem) {
        activeGarmentSvgs.push(getGarmentOverlaySvg(shoesItem.id, modernColor.hex));
      }

      // z-60: Accessory
      if (accItem) {
        activeGarmentSvgs.push(getGarmentOverlaySvg(accItem.id, traditionalColor.hex));
      }

      // Draw onto HTML5 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Cannot init canvas');

      const drawImagePromise = (dataUri: string): Promise<void> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = dataUri;
        });
      };

      // Sequential layer draw according to strict Z-index order
      await drawImagePromise(bgSvgData);
      await drawImagePromise(avatarSvgData);
      for (const svgLayer of activeGarmentSvgs) {
        await drawImagePromise(svgLayer);
      }

      // Watermark & branding
      ctx.fillStyle = '#800E13';
      ctx.font = 'bold 24px "Playfair Display", serif';
      ctx.fillText('NẾP · VIỆT PHỤC REMIX', 40, height - 70);
      ctx.fillStyle = '#4A3E35';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Phối: ${traditionalCostume.name} × ${modernGarment?.name || 'Mặc định'}`, 40, height - 42);

      const link = document.createElement('a');
      link.download = `Nep_Mannequin_Look_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCaptureToast('Đã tải hình ảnh Mannequin 2D thành công!');
      setTimeout(() => setCaptureToast(null), 3500);
    } catch (e) {
      console.error(e);
      setCaptureToast('Không thể tải ảnh tự động, vui lòng thử lại.');
      setTimeout(() => setCaptureToast(null), 3000);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleLayerClick = (layer: typeof layersList[number]) => {
    if (layer.canUnequip && layer.active) {
      setSelectedLayerPopover({
        id: layer.id,
        name: layer.name,
        category: layer.category as 'bottom' | 'inner_top' | 'outer_top' | 'shoes' | 'accessory',
        zIndex: layer.zIndex
      });
    }
  };

  const handleConfirmUnequip = (category: 'bottom' | 'inner_top' | 'outer_top' | 'shoes' | 'accessory') => {
    if (onUnequipLayer) {
      onUnequipLayer(category);
    }
    setSelectedLayerPopover(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF6F0] rounded-3xl border-2 border-[#E3D3C1] shadow-xl overflow-hidden">
      {/* Stage Control Topbar: Base Mannequin toggle & Background Presets */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F4EDE2] border-b border-[#E1D1BE] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#800E13] animate-pulse" />
          <span className="font-heritage text-xs sm:text-sm font-bold text-[#2C241D]">
            Sàn Diễn 2D Mannequin
          </span>
          <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#800E13]/10 text-[#800E13] font-semibold uppercase tracking-wider">
            Dress-up Engine
          </span>
        </div>

        {/* Gender switcher & 4 Background Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Gender toggle */}
          <div className="flex p-0.5 bg-[#E8DDD0] rounded-xl border border-[#D5C2AF] text-[10px] sm:text-[11px] font-medium">
            <button
              onClick={() => onGenderChange?.('female')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                baseGender === 'female'
                  ? 'bg-white text-[#800E13] font-bold shadow-xs'
                  : 'text-[#6C584C] hover:text-[#2C241D]'
              }`}
              title="Chuyển sang Mannequin Nữ"
            >
              <User className="w-3 h-3 text-[#D62828]" />
              <span>Nữ ♀</span>
            </button>
            <button
              onClick={() => onGenderChange?.('male')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                baseGender === 'male'
                  ? 'bg-[#1D3557] text-white font-bold shadow-xs'
                  : 'text-[#6C584C] hover:text-[#2C241D]'
              }`}
              title="Chuyển sang Mannequin Nam"
            >
              <User className="w-3 h-3 text-[#E9C46A]" />
              <span>Nam ♂</span>
            </button>
          </div>

          {/* Background Preset Selector: [Cố Đô Huế] | [Phố Cổ Hội An] | [Hoàng Thành Thăng Long] | [Studio Tối Giản] */}
          <div className="flex p-0.5 bg-[#E8DDD0] rounded-xl border border-[#D5C2AF] text-[10px] sm:text-[11px] overflow-x-auto">
            <button
              onClick={() => setBackgroundTheme('hue')}
              className={`px-2 py-1 rounded-lg font-medium transition-all shrink-0 ${
                backgroundTheme === 'hue'
                  ? 'bg-[#800E13] text-white font-bold shadow-xs'
                  : 'text-[#6C584C] hover:text-[#2C241D]'
              }`}
              title="Bối cảnh Cố Đô Huế"
            >
              Cố Đô Huế
            </button>
            <button
              onClick={() => setBackgroundTheme('hoian')}
              className={`px-2 py-1 rounded-lg font-medium transition-all shrink-0 ${
                backgroundTheme === 'hoian'
                  ? 'bg-[#9C7728] text-white font-bold shadow-xs'
                  : 'text-[#6C584C] hover:text-[#2C241D]'
              }`}
              title="Bối cảnh Phố Cổ Hội An"
            >
              Phố Cổ Hội An
            </button>
            <button
              onClick={() => setBackgroundTheme('thanglong')}
              className={`px-2 py-1 rounded-lg font-medium transition-all shrink-0 ${
                backgroundTheme === 'thanglong'
                  ? 'bg-[#2A443E] text-white font-bold shadow-xs'
                  : 'text-[#6C584C] hover:text-[#2C241D]'
              }`}
              title="Bối cảnh Hoàng Thành Thăng Long"
            >
              Hoàng Thành
            </button>
            <button
              onClick={() => setBackgroundTheme('studio')}
              className={`px-2 py-1 rounded-lg font-medium transition-all shrink-0 ${
                backgroundTheme === 'studio'
                  ? 'bg-white text-[#2C241D] font-bold shadow-xs'
                  : 'text-[#6C584C] hover:text-[#2C241D]'
              }`}
              title="Bối cảnh Studio Tối Giản"
            >
              Studio
            </button>
          </div>
        </div>
      </div>

      {/* Main 2D Stage Canvas: aspect 3:4 rounded container with layered SVG items */}
      <div className="relative flex-1 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        <div 
          ref={stageRef}
          className="relative w-auto h-full max-h-[50vh] sm:max-h-[58vh] lg:max-h-[64vh] xl:max-h-[70vh] aspect-3/4 max-w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#800E13]/30 bg-stone-900 select-none flex items-center justify-center"
        >
          {/* ========================================================= */}
          {/* Z-0: BACKGROUND PRESET LAYER                              */}
          {/* ========================================================= */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={getBackgroundSvg(backgroundTheme)}
              alt="Bối cảnh 2D"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ========================================================= */}
          {/* Z-10: BASE MANNEQUIN AVATAR (Nam / Nữ)                    */}
          {/* ========================================================= */}
          <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-300">
            <img
              src={getBaseAvatarSvg(baseGender)}
              alt={`Mannequin ${baseGender}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* ========================================================= */}
          {/* Z-20: HẠ PHỤC / BOTTOMS (Quần lụa, Chân váy, Culottes)    */}
          {/* ========================================================= */}
          {bottomItem && (
            <div 
              onClick={() => handleLayerClick({
                id: 'bottom',
                name: bottomItem.name,
                item: bottomItem,
                zIndex: 'z-20',
                active: true,
                category: 'bottom',
                canUnequip: true
              })}
              className={`absolute inset-0 z-20 transition-all duration-300 cursor-pointer ${
                activeHighlightLayer === 'bottom' ? 'filter drop-shadow-[0_0_12px_#E9C46A]' : ''
              }`}
              title={`Hạ phục: ${bottomItem.name} (Nhấp để tháo)`}
            >
              <img
                src={getGarmentOverlaySvg(bottomItem.id, modernColor.hex)}
                alt={bottomItem.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* Z-30: THƯỢNG PHỤC LỚP TRONG (Áo Yếm lót, áo cánh trắng)   */}
          {/* ========================================================= */}
          {innerItem && (
            <div 
              onClick={() => handleLayerClick({
                id: 'inner-top',
                name: innerItem.name,
                item: innerItem,
                zIndex: 'z-30',
                active: true,
                category: 'inner_top',
                canUnequip: true
              })}
              className={`absolute inset-0 z-30 transition-all duration-300 cursor-pointer ${
                activeHighlightLayer === 'inner_top' ? 'filter drop-shadow-[0_0_12px_#E9C46A]' : ''
              }`}
              title={`Lớp trong: ${innerItem.name} (Nhấp để tháo)`}
            >
              <img
                src={getGarmentOverlaySvg(innerItem.id, traditionalColor.hex)}
                alt={innerItem.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* Z-40: THƯỢNG PHỤC CHÍNH / CỔ PHỤC NGOÀI (Áo Tấc, Ngũ Thân) */}
          {/* ========================================================= */}
          {outerItem && (
            <div 
              onClick={() => handleLayerClick({
                id: 'outer-top',
                name: outerItem.name,
                item: outerItem,
                zIndex: 'z-40',
                active: true,
                category: 'outer_top',
                canUnequip: true
              })}
              className={`absolute inset-0 z-40 transition-all duration-300 cursor-pointer ${
                activeHighlightLayer === 'outer_top' ? 'filter drop-shadow-[0_0_12px_#E9C46A]' : ''
              }`}
              title={`Thượng phục: ${outerItem.name} (Nhấp để tháo)`}
            >
              <img
                src={getGarmentOverlaySvg(outerItem.id, traditionalColor.hex)}
                alt={outerItem.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* Z-50: GIÀY DÉP (Hài thêu, guốc mộc, boots, sneaker)       */}
          {/* ========================================================= */}
          {shoesItem && (
            <div 
              onClick={() => handleLayerClick({
                id: 'shoes',
                name: shoesItem.name,
                item: shoesItem,
                zIndex: 'z-50',
                active: true,
                category: 'shoes',
                canUnequip: true
              })}
              className={`absolute inset-0 z-50 transition-all duration-300 cursor-pointer ${
                activeHighlightLayer === 'shoes' ? 'filter drop-shadow-[0_0_12px_#E9C46A]' : ''
              }`}
              title={`Giày dép: ${shoesItem.name} (Nhấp để tháo)`}
            >
              <img
                src={getGarmentOverlaySvg(shoesItem.id, modernColor.hex)}
                alt={shoesItem.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* Z-60: PHỤ KIỆN TIỀN CẢNH (Khăn đóng, quạt trầm, túi gấm)  */}
          {/* ========================================================= */}
          {accItem && (
            <div 
              onClick={() => handleLayerClick({
                id: 'accessory',
                name: accItem.name,
                item: accItem,
                zIndex: 'z-60',
                active: true,
                category: 'accessory',
                canUnequip: true
              })}
              className={`absolute inset-0 z-60 transition-all duration-300 cursor-pointer ${
                activeHighlightLayer === 'accessory' ? 'filter drop-shadow-[0_0_12px_#E9C46A]' : ''
              }`}
              title={`Phụ kiện: ${accItem.name} (Nhấp để tháo)`}
            >
              <img
                src={getGarmentOverlaySvg(accItem.id, traditionalColor.hex)}
                alt={accItem.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}

          {/* Floating Outfit Badge in corner */}
          <div className="absolute top-3 left-3 z-70 bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white shadow-lg pointer-events-none max-w-[210px]">
            <span className="text-[9px] uppercase tracking-widest text-[#E9C46A] block font-bold">
              {traditionalCostume.dynasty || 'Di Sản Việt'}
            </span>
            <span className="font-heritage text-xs font-bold truncate block">
              {traditionalCostume.name}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-stone-300">
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block border border-white/60"
                style={{ backgroundColor: traditionalColor.hex }}
              />
              <span className="truncate">{traditionalColor.name}</span>
            </div>
          </div>

          {/* Official Seal Watermark */}
          <div className="absolute top-3 right-3 z-70 border border-[#D62828] bg-[#D62828]/20 backdrop-blur-xs text-[#FFE6A7] px-2 py-0.5 rounded text-[10px] font-heritage font-bold rotate-6 pointer-events-none">
            NẾP CHUẨN
          </div>

          {/* Unequip Popover Modal if an item on mannequin was clicked */}
          {selectedLayerPopover && (
            <div className="absolute inset-x-4 top-16 z-80 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DFD1BD] shadow-2xl animate-in zoom-in-95 text-[#2C241D]">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold bg-[#800E13] text-white px-1.5 py-0.5 rounded">
                    {selectedLayerPopover.zIndex}
                  </span>
                  <span className="font-bold text-xs truncate max-w-[150px]">
                    {selectedLayerPopover.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLayerPopover(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-500">
                  Đang mặc trên người mẫu
                </span>
                <button
                  onClick={() => handleConfirmUnequip(selectedLayerPopover.category)}
                  className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
                >
                  <X className="w-3 h-3" />
                  <span>Tháo ra</span>
                </button>
              </div>
            </div>
          )}

          {/* Capture Toast popup */}
          {captureToast && (
            <div className="absolute inset-x-4 bottom-4 z-90 bg-[#800E13] text-white text-xs px-3.5 py-2 rounded-xl text-center shadow-xl animate-in fade-in flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
              <span>{captureToast}</span>
            </div>
          )}
        </div>
      </div>

      {/* Layer Stack HUD & Quick Actions Footer */}
      <div className="px-4 py-3 bg-[#F4EDE2] border-t border-[#E1D1BE] space-y-2.5">
        {/* Layer Chips: Click to inspect or unequip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
          <span className="text-[#786454] font-semibold shrink-0 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3 text-[#800E13]" />
            Lớp:
          </span>
          {layersList.map((layer) => {
            if (!layer.active && layer.category !== 'avatar') return null;
            return (
              <div
                key={layer.id}
                onMouseEnter={() => setActiveHighlightLayer(layer.id)}
                onMouseLeave={() => setActiveHighlightLayer(null)}
                className={`shrink-0 px-2 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                  activeHighlightLayer === layer.id
                    ? 'bg-[#800E13] text-white border-[#800E13] shadow-xs'
                    : 'bg-white text-[#4A3E35] border-[#D9C9B4] hover:border-[#800E13]'
                }`}
                title={`Đang mặc: ${layer.name} (${layer.zIndex})`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E9C46A]" />
                <span className="max-w-[100px] truncate">{layer.name}</span>
                <span className="text-[8px] opacity-70 font-mono">({layer.zIndex})</span>
                {layer.canUnequip && (
                  <button
                    onClick={() => handleConfirmUnequip(layer.category as any)}
                    className="p-0.5 hover:bg-black/15 rounded text-rose-500 hover:text-rose-700"
                    title="Tháo món này"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Tải xuống 2D PNG / Xuất Lookbook / Đặt lại */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={onResetOutfit}
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-stone-100 text-[#786454] border border-[#D5C2AF] rounded-xl text-xs font-medium transition-colors"
            title="Gỡ toàn bộ và mặc lại từ đầu"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Mặc lại</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickDownload}
              disabled={isCapturing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF5EE] text-[#800E13] border-2 border-[#800E13] rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              title="Chụp và tải ảnh Mannequin 2D ngay lập tức"
            >
              <Download className="w-3.5 h-3.5 text-[#800E13]" />
              <span>{isCapturing ? 'Đang chụp...' : 'Tải Ảnh 2D'}</span>
            </button>

            <button
              onClick={onOpenLookbookExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-[#800E13]/30"
              title="Xuất phiếu Lookbook di sản đầy đủ triện son và thông số hòa sắc"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
              <span>Xuất Lookbook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Avatar2DStage;

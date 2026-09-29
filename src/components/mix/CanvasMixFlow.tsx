import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TRADITIONAL_COSTUMES, 
  MODERN_GARMENTS, 
  ACCESSORY_ITEMS, 
  TRADITIONAL_COLORS, 
  MODERN_COLORS 
} from '../../services/costumeService';
import { evaluateOutfitMix } from '../../utils/culturalRuleChecker';
import { Avatar2DStage } from './Avatar2DStage';
import { DressUpWorkspace } from './DressUpWorkspace';
import { CameraFlowModal } from './CameraFlowModal';
import { VirtualFittingResultModal } from './VirtualFittingResultModal';
import { WardrobeManagerModal } from './WardrobeManagerModal';
import { LookbookExportModal } from './LookbookExportModal';
import { 
  Columns2, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Shirt, 
  Plus, 
  X, 
  FileText,
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';
import { 
  TraditionalCostume, 
  ModernGarment, 
  AccessoryItem, 
  ColorItem, 
  UserWardrobeItem,
  EquippedLayers,
  LayerType
} from '../../types';

export const CanvasMixFlow: React.FC = () => {
  const { 
    canvasState, 
    updateCanvasLayer, 
    setCanvasState,
    wardrobeItems, 
    comparisonSlotA, 
    comparisonSlotB, 
    saveToComparison, 
    clearComparison, 
    isComparing, 
    setIsComparing,
    userProfile 
  } = useApp();

  const [showWardrobeModal, setShowWardrobeModal] = useState<boolean>(false);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [showLookbookDirect, setShowLookbookDirect] = useState<boolean>(false);
  const [fittingResult, setFittingResult] = useState<{ userPhoto: string } | null>(null);

  // Mobile View Switcher: 'both' | 'stage' | 'wardrobe'
  const [mobileActiveView, setMobileActiveView] = useState<'both' | 'stage' | 'wardrobe'>('both');

  // Equipped layers structure with base mannequin gender and layered items
  const [baseGender, setBaseGender] = useState<'male' | 'female'>(
    canvasState.traditional.gender === 'male' ? 'male' : 'female'
  );

  // Initialize or maintain equipped layers
  const equippedLayers: EquippedLayers = useMemo(() => {
    // If canvasState already has equippedLayers, return it, otherwise derive from current state
    const bottom = canvasState.modern && 'category' in canvasState.modern && ['pants', 'skirt'].includes(canvasState.modern.category)
      ? canvasState.modern
      : (canvasState.equippedLayers?.bottom || MODERN_GARMENTS[1]); // Culottes default

    const innerTop = canvasState.traditional.id === 'ao-yem-co-truyen'
      ? canvasState.traditional
      : (canvasState.equippedLayers?.innerTop || null);

    const outerTop = canvasState.traditional.id !== 'ao-yem-co-truyen'
      ? canvasState.traditional
      : (canvasState.modern && 'category' in canvasState.modern && canvasState.modern.category === 'jacket' ? canvasState.modern : canvasState.equippedLayers?.outerTop || TRADITIONAL_COSTUMES[0]);

    const accessoryBack = canvasState.accessory && canvasState.accessory.category === 'hat'
      ? canvasState.accessory
      : (canvasState.equippedLayers?.accessoryBack || ACCESSORY_ITEMS[0]);

    const shoes = canvasState.modern && 'category' in canvasState.modern && canvasState.modern.category === 'shoes'
      ? canvasState.modern
      : (canvasState.equippedLayers?.shoes || MODERN_GARMENTS[3]); // Chelsea boots default

    const accessoryFront = canvasState.accessory && canvasState.accessory.category !== 'hat'
      ? canvasState.accessory
      : (canvasState.equippedLayers?.accessoryFront || ACCESSORY_ITEMS[1]); // Brocade bag default

    return {
      baseGender,
      bottom,
      innerTop,
      outerTop,
      accessoryBack,
      shoes,
      accessoryFront,
      extraLayers: canvasState.equippedLayers?.extraLayers || []
    };
  }, [canvasState, baseGender]);

  // Dynamic Cultural Evaluation & Harmony Score in Real-Time
  const culturalCheck = useMemo(() => {
    return evaluateOutfitMix(
      canvasState.traditional,
      canvasState.modern,
      canvasState.accessory,
      canvasState.traditionalColor,
      canvasState.modernColor
    );
  }, [canvasState]);

  // Color harmony score
  const harmonyScore = useMemo(() => {
    let score = 91;
    if (canvasState.traditionalColor.element === 'Hỏa' && canvasState.modernColor.name.includes('Kem')) {
      score += 5;
    } else if (canvasState.traditionalColor.hex === '#9B2226' && canvasState.modernColor.hex === '#1D3557') {
      score += 5;
    }
    return Math.min(99, score);
  }, [canvasState.traditionalColor, canvasState.modernColor]);

  // Multi-layer toggle item equipping (supports stacking multiple garments)
  const handleToggleLayerEquip = (item: any, layerType: string) => {
    // 1. Bottom
    if (layerType === 'bottom') {
      const isAlreadyEquipped = equippedLayers.bottom?.id === item.id;
      const newBottom = isAlreadyEquipped ? null : item;
      setCanvasState((prev) => ({
        ...prev,
        modern: newBottom,
        equippedLayers: {
          ...equippedLayers,
          bottom: newBottom
        }
      }));
      return;
    }

    // 2. Inner Top (Áo Yếm)
    if (layerType === 'inner_top' || item.id === 'ao-yem-co-truyen') {
      const isAlreadyEquipped = equippedLayers.innerTop?.id === item.id;
      const newInner = isAlreadyEquipped ? null : item;
      setCanvasState((prev) => ({
        ...prev,
        equippedLayers: {
          ...equippedLayers,
          innerTop: newInner
        }
      }));
      return;
    }

    // 3. Outer Top (Traditional robes or Modern jackets)
    if (layerType === 'outer_top' || item.category === 'jacket') {
      if (item.category === 'jacket') {
        const isAlreadyEquipped = equippedLayers.outerTop?.id === item.id;
        const newOuter = isAlreadyEquipped ? canvasState.traditional : item;
        setCanvasState((prev) => ({
          ...prev,
          modern: newOuter,
          equippedLayers: {
            ...equippedLayers,
            outerTop: newOuter
          }
        }));
      } else {
        // Traditional costume
        const isAlreadyEquipped = canvasState.traditional.id === item.id;
        if (!isAlreadyEquipped) {
          updateCanvasLayer('traditional', item);
          if (item.gender === 'male') setBaseGender('male');
          if (item.gender === 'female') setBaseGender('female');
        }
      }
      return;
    }

    // 4. Shoes
    if (layerType === 'shoes' || item.category === 'shoes') {
      const isAlreadyEquipped = equippedLayers.shoes?.id === item.id;
      const newShoes = isAlreadyEquipped ? null : item;
      setCanvasState((prev) => ({
        ...prev,
        equippedLayers: {
          ...equippedLayers,
          shoes: newShoes
        }
      }));
      return;
    }

    // 5. Accessory Back (Hat / Turban)
    if (layerType === 'accessory_back' || item.category === 'hat') {
      const isAlreadyEquipped = equippedLayers.accessoryBack?.id === item.id;
      const newAcc = isAlreadyEquipped ? null : item;
      setCanvasState((prev) => ({
        ...prev,
        accessory: newAcc,
        equippedLayers: {
          ...equippedLayers,
          accessoryBack: newAcc
        }
      }));
      return;
    }

    // 6. Accessory Front (Bag / Fan / Glasses)
    if (layerType === 'accessory_front' || item.category !== 'hat') {
      const isAlreadyEquipped = equippedLayers.accessoryFront?.id === item.id;
      const newAcc = isAlreadyEquipped ? null : item;
      setCanvasState((prev) => ({
        ...prev,
        accessory: newAcc,
        equippedLayers: {
          ...equippedLayers,
          accessoryFront: newAcc
        }
      }));
      return;
    }
  };

  // Reset to full default stylish coordinate
  const handleResetOutfit = () => {
    setCanvasState({
      traditional: TRADITIONAL_COSTUMES[0],
      modern: MODERN_GARMENTS[1],
      accessory: ACCESSORY_ITEMS[1],
      traditionalColor: TRADITIONAL_COLORS[0],
      modernColor: MODERN_COLORS[0],
      equippedLayers: {
        baseGender: 'female',
        bottom: MODERN_GARMENTS[1],
        innerTop: TRADITIONAL_COSTUMES[6], // Áo Yếm lót trong
        outerTop: TRADITIONAL_COSTUMES[0], // Áo Dài truyền thống
        accessoryBack: ACCESSORY_ITEMS[0], // Khăn đóng
        shoes: MODERN_GARMENTS[3], // Chelsea boots
        accessoryFront: ACCESSORY_ITEMS[1] // Túi gấm
      }
    });
    setBaseGender('female');
  };

  const handleUnequipLayer = (category: 'bottom' | 'inner_top' | 'outer_top' | 'shoes' | 'accessory') => {
    if (category === 'bottom') {
      setCanvasState((prev) => ({
        ...prev,
        modern: prev.modern && 'category' in prev.modern && ['pants', 'skirt'].includes(prev.modern.category) ? null : prev.modern,
        equippedLayers: { ...equippedLayers, bottom: null }
      }));
    } else if (category === 'inner_top') {
      setCanvasState((prev) => ({
        ...prev,
        equippedLayers: { ...equippedLayers, innerTop: null }
      }));
    } else if (category === 'outer_top') {
      setCanvasState((prev) => ({
        ...prev,
        equippedLayers: { ...equippedLayers, outerTop: null }
      }));
    } else if (category === 'shoes') {
      setCanvasState((prev) => ({
        ...prev,
        modern: prev.modern && 'category' in prev.modern && prev.modern.category === 'shoes' ? null : prev.modern,
        equippedLayers: { ...equippedLayers, shoes: null }
      }));
    } else if (category === 'accessory') {
      setCanvasState((prev) => ({
        ...prev,
        accessory: null,
        equippedLayers: { ...equippedLayers, accessoryFront: null, accessoryBack: null }
      }));
    }
  };

  const handleCameraComplete = (userPhotoUrl: string) => {
    setFittingResult({ userPhoto: userPhotoUrl });
    setShowCameraModal(false);
  };

  const renderStatusBadge = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Hợp lý</span>
          </span>
        );
      case 'yellow':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cần lưu ý</span>
          </span>
        );
      case 'red':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Chưa phù hợp</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-[#E9DFD1] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#9B2226] tracking-widest">
              Xưởng May Đo Remix · Phong Cách 2D Mannequin
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#800E13] text-white text-[10px] font-bold">
              Z-Index Dress-Up
            </span>
          </div>
          <h2 className="font-heritage text-xl sm:text-2xl font-bold text-[#2C241D]">
            Phòng Thử Đồ & Phối Lớp Thời Trang Việt
          </h2>
        </div>

        {/* Action Buttons on Canvas */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tủ đồ của tôi */}
          <button
            onClick={() => setShowWardrobeModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF5EE] hover:bg-[#F0E6D8] text-[#800E13] border border-[#DFCFC0] rounded-xl text-xs font-medium transition-colors"
          >
            <Shirt className="w-3.5 h-3.5 text-[#9B2226]" />
            <span>Tủ đồ riêng ({wardrobeItems.length})</span>
          </button>

          {/* So sánh */}
          <button
            onClick={saveToComparison}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#4A3E35] rounded-xl text-xs font-medium transition-colors"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>{isComparing ? 'Lưu tiếp bản so sánh' : 'So sánh'}</span>
          </button>


          {/* Xuất Lookbook */}
          <button
            onClick={() => setShowLookbookDirect(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF5EE] hover:bg-[#EFE5D5] text-[#800E13] border border-[#DFCFC0] rounded-xl text-xs font-medium transition-colors"
            title="Xuất phiếu Lookbook trực tiếp từ Canvas"
          >
            <FileText className="w-3.5 h-3.5 text-[#9B2226]" />
            <span>Xuất Lookbook</span>
          </button>

          {/* Thử lên người */}
          <button
            onClick={() => setShowCameraModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#800E13] hover:bg-[#9B2226] text-white rounded-xl text-xs font-medium transition-all shadow-sm shadow-[#800E13]/20"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Thử lên người</span>
          </button>
        </div>
      </div>

      {/* Comparison Drawer / Side-by-Side View if triggered */}
      {isComparing && (
        <div className="p-5 bg-[#FAF6F0] rounded-3xl border border-[#DFD1BD] space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Columns2 className="w-4 h-4 text-[#9B2226]" />
              <h3 className="font-heritage text-base font-bold text-[#2C241D]">
                Chế Độ So Sánh Song Song (A vs B)
              </h3>
            </div>
            <button
              onClick={clearComparison}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
              title="Đóng so sánh"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slot A: Saved Previous Outfit */}
            <div className="bg-white p-4 rounded-2xl border border-[#E9DFD1] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#9B2226] bg-[#9B2226]/10 px-2 py-0.5 rounded">
                Bản Phối A (Đã Lưu)
              </span>
              {comparisonSlotA && (
                <div className="mt-3 flex gap-3 items-center">
                  <img
                    src={comparisonSlotA.traditional.frontImage}
                    alt={comparisonSlotA.traditional.name}
                    className="w-20 h-28 object-cover rounded-xl border border-stone-200"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-heritage font-bold text-sm text-[#2C241D]">
                      {comparisonSlotA.traditional.name}
                    </p>
                    <p className="text-[#6C584C]">
                      Lớp hiện đại: {comparisonSlotA.modern?.name || 'Mặc định'}
                    </p>
                    <p className="text-[#6C584C]">
                      Sắc màu: {comparisonSlotA.traditionalColor.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Slot B: Current Active Outfit */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#800E13] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-white bg-[#800E13] px-2 py-0.5 rounded">
                Bản Phối B (Đang Chỉnh Sửa)
              </span>
              <div className="mt-3 flex gap-3 items-center">
                <img
                  src={canvasState.traditional.frontImage}
                  alt={canvasState.traditional.name}
                  className="w-20 h-28 object-cover rounded-xl border border-stone-200"
                />
                <div className="text-xs space-y-1">
                  <p className="font-heritage font-bold text-sm text-[#2C241D]">
                    {canvasState.traditional.name}
                  </p>
                  <p className="text-[#6C584C]">
                    Lớp hiện đại: {canvasState.modern?.name || 'Mặc định'}
                  </p>
                  <p className="text-[#6C584C]">
                    Sắc màu: {canvasState.traditionalColor.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Device Quick View Switcher (Only visible on screens < 1024px) */}
      <div className="lg:hidden flex items-center justify-center p-1 bg-[#EBE0D0] rounded-2xl border border-[#DFD1BD] shadow-xs">
        <button
          onClick={() => setMobileActiveView('both')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            mobileActiveView === 'both'
              ? 'bg-[#800E13] text-white shadow-xs'
              : 'text-[#6C584C] hover:text-[#2C241D]'
          }`}
        >
          Song Song (Cuộn)
        </button>
        <button
          onClick={() => setMobileActiveView('stage')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            mobileActiveView === 'stage'
              ? 'bg-[#800E13] text-white shadow-xs'
              : 'text-[#6C584C] hover:text-[#2C241D]'
          }`}
        >
          👗 Người Mẫu 2D
        </button>
        <button
          onClick={() => setMobileActiveView('wardrobe')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            mobileActiveView === 'wardrobe'
              ? 'bg-[#800E13] text-white shadow-xs'
              : 'text-[#6C584C] hover:text-[#2C241D]'
          }`}
        >
          🗄️ Tủ Đồ Phối
        </button>
      </div>

      {/* Main 2-Column Game Interface: Left = 2D Avatar Stage (5 Cols); Right = DressUp Workspace (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: 2D Avatar Stage & Indicator Board (5 Cols, Sticky on Desktop/Laptop) */}
        <div className={`lg:col-span-5 space-y-4 sm:space-y-5 lg:sticky lg:top-24 ${
          mobileActiveView === 'wardrobe' ? 'hidden lg:block' : 'block'
        }`}>
          <Avatar2DStage
            equippedLayers={equippedLayers}
            traditionalCostume={canvasState.traditional}
            modernGarment={canvasState.modern}
            accessoryItem={canvasState.accessory}
            traditionalColor={canvasState.traditionalColor}
            modernColor={canvasState.modernColor}
            onGenderChange={(gender) => setBaseGender(gender)}
            onResetOutfit={handleResetOutfit}
            onOpenLookbookExport={() => setShowLookbookDirect(true)}
            onUnequipLayer={handleUnequipLayer}
          />

          {/* Real-Time Indicator Board (Score + Traffic Light Cultural Rules) */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E9DFD1] shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                  Đánh Giá Tương Thích
                </span>
                <span className="font-heritage text-base sm:text-lg font-bold text-[#2C241D]">
                  Chỉ Số Hòa Hợp Remix
                </span>
              </div>
              <div className="text-right">
                <span className="font-heritage text-2xl font-bold text-[#800E13]">
                  {harmonyScore}
                </span>
                <span className="text-xs text-[#8C7A6B]">/100</span>
              </div>
            </div>

            {/* Traffic Light Cultural Evaluation */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#4A3E35]">Dáng áo cổ truyền:</span>
                {renderStatusBadge(culturalCheck.silhouette.status)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#4A3E35]">Phụ kiện đương đại:</span>
                {renderStatusBadge(culturalCheck.accessories.status)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#4A3E35]">Họa sắc & phép ứng đối:</span>
                {renderStatusBadge(culturalCheck.occasionColor.status)}
              </div>
            </div>

            <p className="text-[11px] text-[#6C584C] leading-relaxed pt-2 border-t border-[#F0E6D8]">
              {culturalCheck.summary}
            </p>
          </div>
        </div>

        {/* Right Column: DressUp Workspace Wardrobe & Layer Controls (7 Cols) */}
        <div className={`lg:col-span-7 ${
          mobileActiveView === 'stage' ? 'hidden lg:block' : 'block'
        }`}>
          <DressUpWorkspace
            traditionalCostumes={TRADITIONAL_COSTUMES}
            modernGarments={MODERN_GARMENTS}
            accessoryItems={ACCESSORY_ITEMS}
            traditionalColors={TRADITIONAL_COLORS}
            modernColors={MODERN_COLORS}
            wardrobeItems={wardrobeItems}
            equippedLayers={equippedLayers}
            selectedTraditional={canvasState.traditional}
            selectedModern={canvasState.modern}
            selectedAccessory={canvasState.accessory}
            selectedTraditionalColor={canvasState.traditionalColor}
            selectedModernColor={canvasState.modernColor}
            onSelectCostume={(costume) => {
              updateCanvasLayer('traditional', costume);
              if (costume.gender === 'male') setBaseGender('male');
              if (costume.gender === 'female') setBaseGender('female');
            }}
            onSelectModern={(garment) => updateCanvasLayer('modern', garment)}
            onSelectAccessory={(accessory) => updateCanvasLayer('accessory', accessory)}
            onSelectTraditionalColor={(color) => updateCanvasLayer('traditionalColor', color)}
            onSelectModernColor={(color) => updateCanvasLayer('modernColor', color)}
            onOpenWardrobeModal={() => setShowWardrobeModal(true)}
            onToggleLayerEquip={handleToggleLayerEquip}
            onResetOutfit={handleResetOutfit}
          />
        </div>
      </div>

      {/* Wardrobe Manager Modal */}
      {showWardrobeModal && (
        <WardrobeManagerModal onClose={() => setShowWardrobeModal(false)} />
      )}

      {/* Camera Flow Modal */}
      {showCameraModal && (
        <CameraFlowModal
          onComplete={handleCameraComplete}
          onClose={() => setShowCameraModal(false)}
        />
      )}

      {/* Direct Lookbook Export Modal from Canvas */}
      {showLookbookDirect && (
        <LookbookExportModal
          outfit={canvasState}
          userPhotoUrl={canvasState.traditional.frontImage}
          userProfile={userProfile}
          onClose={() => setShowLookbookDirect(false)}
        />
      )}

      {/* Virtual Fitting Result Modal */}
      {fittingResult && (
        <VirtualFittingResultModal
          outfit={canvasState}
          userPhotoUrl={fittingResult.userPhoto}
          onClose={() => setFittingResult(null)}
        />
      )}
    </div>
  );
};
export default CanvasMixFlow;

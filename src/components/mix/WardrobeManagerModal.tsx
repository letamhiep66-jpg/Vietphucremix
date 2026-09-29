import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserWardrobeItem } from '../../types';
import { X, Plus, Trash2, Upload, Check, AlertCircle } from 'lucide-react';

interface WardrobeManagerModalProps {
  onClose: () => void;
}

type WardrobeCategory = 'bag' | 'pants' | 'jacket' | 'shoes' | 'jewelry' | 'other';

const CATEGORY_LABELS: Record<WardrobeCategory, string> = {
  bag: 'Túi xách',
  pants: 'Quần / Chân váy',
  jacket: 'Áo khoác / Blazer',
  shoes: 'Giày / Boots',
  jewelry: 'Trang sức / Phụ kiện',
  other: 'Khác'
};

export const WardrobeManagerModal: React.FC<WardrobeManagerModalProps> = ({ onClose }) => {
  const { wardrobeItems, addWardrobeItem, removeWardrobeItem } = useApp();

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>('');
  const [category, setCategory] = useState<WardrobeCategory>('jacket');
  
  // Independent 3 upload slots
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chỉ tải tệp hình ảnh (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setter(uploadEvent.target?.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItem = () => {
    if (!itemName.trim()) {
      setErrorMsg('Vui lòng nhập tên món đồ của bạn.');
      return;
    }
    if (!frontImage) {
      setErrorMsg('Vui lòng tải lên ít nhất ảnh mặt trước của món đồ.');
      return;
    }

    const res = addWardrobeItem({
      name: itemName.trim(),
      category,
      frontImage: frontImage || undefined,
      backImage: backImage || undefined,
      sideImage: sideImage || undefined
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Không thể thêm món đồ.');
      return;
    }

    // Reset form
    setItemName('');
    setCategory('jacket');
    setFrontImage(null);
    setBackImage(null);
    setSideImage(null);
    setIsAddingNew(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl overflow-hidden border border-[#E9DFD1] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9DFD1] bg-[#F5EDE1]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B2226]">
              Bộ Sưu Tập Riêng Của Bạn
            </span>
            <h3 className="font-heritage text-xl font-bold text-[#2C241D]">
              Tủ Đồ Của Tôi ({wardrobeItems.length}/5 món)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form to add item */}
          {isAddingNew ? (
            <div className="p-5 rounded-2xl bg-[#F8F3EC] border border-[#DFCFC0] space-y-4 mb-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-heritage font-bold text-sm text-[#2C241D]">
                  Thêm Món Đồ Mới
                </h4>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Hủy
                </button>
              </div>

              {/* Name & Category */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                    Tên món đồ
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="VD: Blazer da oversize, Túi gấm..."
                    className="w-full px-3 py-2 bg-white border border-[#D8C7B3] rounded-xl text-xs focus:ring-1 focus:ring-[#9B2226] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                    Loại trang phục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WardrobeCategory)}
                    className="w-full px-3 py-2 bg-white border border-[#D8C7B3] rounded-xl text-xs focus:ring-1 focus:ring-[#9B2226] focus:outline-none"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => (
                      <option key={catKey} value={catKey}>
                        {catLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3 INDEPENDENT UPLOAD SLOTS: Front, Back, Side */}
              <div>
                <label className="block text-xs font-semibold text-[#4A3E35] mb-2">
                  Tải ảnh món đồ (tải độc lập từng ô không chặn nhau):
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* Slot 1: Mặt Trước */}
                  <div
                    onClick={() => frontInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all aspect-3/4 ${
                      frontImage
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-[#CBB9A1] bg-white hover:bg-stone-50'
                    }`}
                  >
                    {frontImage ? (
                      <>
                        <img
                          src={frontImage}
                          alt="Mặt trước"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-1.5 right-1.5 p-1 bg-emerald-600 text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#8C7A6B] mb-1" />
                        <span className="text-[11px] font-bold text-[#4A3E35]">Mặt trước</span>
                        <span className="text-[9px] text-[#9C8B7D]">(Bắt buộc)</span>
                      </>
                    )}
                    <span className="mt-1 text-[10px] font-semibold text-[#6C584C]">
                      {frontImage ? 'Đã tải' : 'Chưa tải'}
                    </span>
                    <input
                      ref={frontInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setFrontImage)}
                    />
                  </div>

                  {/* Slot 2: Mặt Sau */}
                  <div
                    onClick={() => backInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all aspect-3/4 ${
                      backImage
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-[#CBB9A1] bg-white hover:bg-stone-50'
                    }`}
                  >
                    {backImage ? (
                      <>
                        <img
                          src={backImage}
                          alt="Mặt sau"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-1.5 right-1.5 p-1 bg-emerald-600 text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#8C7A6B] mb-1" />
                        <span className="text-[11px] font-bold text-[#4A3E35]">Mặt sau</span>
                        <span className="text-[9px] text-[#9C8B7D]">(Tùy chọn)</span>
                      </>
                    )}
                    <span className="mt-1 text-[10px] font-semibold text-[#6C584C]">
                      {backImage ? 'Đã tải' : 'Chưa tải'}
                    </span>
                    <input
                      ref={backInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setBackImage)}
                    />
                  </div>

                  {/* Slot 3: Mặt Bên */}
                  <div
                    onClick={() => sideInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all aspect-3/4 ${
                      sideImage
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-[#CBB9A1] bg-white hover:bg-stone-50'
                    }`}
                  >
                    {sideImage ? (
                      <>
                        <img
                          src={sideImage}
                          alt="Mặt bên"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-1.5 right-1.5 p-1 bg-emerald-600 text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-[#8C7A6B] mb-1" />
                        <span className="text-[11px] font-bold text-[#4A3E35]">Mặt bên</span>
                        <span className="text-[9px] text-[#9C8B7D]">(Tùy chọn)</span>
                      </>
                    )}
                    <span className="mt-1 text-[10px] font-semibold text-[#6C584C]">
                      {sideImage ? 'Đã tải' : 'Chưa tải'}
                    </span>
                    <input
                      ref={sideInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setSideImage)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveItem}
                  className="px-5 py-2 bg-[#800E13] hover:bg-[#9B2226] text-white text-xs font-medium rounded-xl transition-all shadow-sm"
                >
                  Lưu vào tủ đồ
                </button>
              </div>
            </div>
          ) : (
            wardrobeItems.length < 5 && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full mb-6 py-3 px-4 rounded-2xl border-2 border-dashed border-[#CBB9A1] hover:border-[#9B2226] hover:bg-[#FAF5EE] text-[#800E13] font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm đồ của bạn (Tối đa 5 món/phiên)</span>
              </button>
            )
          )}

          {/* List of currently uploaded items */}
          <div className="space-y-3">
            {wardrobeItems.length === 0 ? (
              <div className="text-center py-8 text-[#786454]">
                <p className="text-xs">Chưa có món đồ cá nhân nào được thêm.</p>
                <p className="text-[11px] text-[#9C8B7D] mt-1">
                  Hãy bấm nút "Thêm đồ của bạn" để phối túi xách, áo khoác hay giày của riêng bạn với cổ phục Việt.
                </p>
              </div>
            ) : (
              wardrobeItems.map((item) => {
                const has3D = !!(item.frontImage && item.backImage);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-white border border-[#E9DFD1] rounded-2xl shadow-xs hover:border-[#D4A373] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        {item.frontImage ? (
                          <img
                            src={item.frontImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                            No pic
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8C7A6B]">
                          {CATEGORY_LABELS[item.category]}
                        </span>
                        <h4 className="font-semibold text-xs sm:text-sm text-[#2C241D]">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-emerald-700 font-medium">
                            ✓ Khả dụng trên Ma-nơ-canh 2D
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => removeWardrobeItem(item.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Xóa món đồ này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F8F3EC] border-t border-[#E9DFD1] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#800E13] hover:bg-[#9B2226] text-white text-xs font-medium rounded-xl transition-colors"
          >
            Đóng tủ đồ
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeBodyProfile } from '../../utils/bodyProfile';
import { VietnamMapWithIslands } from '../common/VietnamMapWithIslands';
import { 
  User, 
  Ruler, 
  Scale, 
  Calendar, 
  Upload, 
  Check, 
  Sparkles, 
  AlertCircle, 
  WifiOff, 
  Clock, 
  ShieldAlert,
  LogIn,
  LogOut,
  CheckCircle2
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
];

export const SettingsSection: React.FC = () => {
  const { userProfile, updateUserProfile, simulateError, currentUser, openAuthModal, logout } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [height, setHeight] = useState(userProfile.height);
  const [weight, setWeight] = useState(userProfile.weight);
  const [gender, setGender] = useState(userProfile.gender);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic body profile analysis
  const bodyAnalysis = analyzeBodyProfile({
    name,
    age,
    height,
    weight,
    gender,
    avatar
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setAvatar(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      gender,
      avatar
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B2226] bg-[#9B2226]/10 px-3 py-1 rounded-full border border-[#9B2226]/20">
          Hồ Sơ Nhân Trắc Học
        </span>
        <h1 className="font-heritage text-3xl sm:text-4xl font-bold text-[#2C241D] mt-2">
          Cài Đặt Vóc Dáng & Cá Nhân Hóa
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6C584C]">
          Thông tin chiều cao, cân nặng và dáng người giúp Nếp tự động căn chỉnh phom áo và may đo gợi ý chính xác nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form Column (7 Cols) */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DFD1] shadow-xs">
          {/* Account Sync Status Card */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FAF6F0] border border-[#DFD4C4]">
            {currentUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#800E13] text-white flex items-center justify-center font-bold text-sm">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'N'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#2C241D]">
                        {userProfile.name || currentUser.displayName || 'Khách Quý Nếp'}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Đã xác thực
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7B6858]">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#2C241D] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#9B2226]" />
                    <span>Đồng Bộ Hồ Sơ Lên Đám Mây</span>
                  </h4>
                  <p className="text-[11px] text-[#6C584C] mt-0.5">
                    Đăng nhập để lưu giữ số đo nhân trắc học và Lookbook cá nhân vĩnh viễn.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="self-start sm:self-center px-4 py-2 bg-gradient-to-r from-[#9B2226] to-[#800E13] hover:from-[#BA2D32] hover:to-[#9B2226] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập ngay</span>
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {savedSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã lưu thông tin vóc dáng và cập nhật gợi ý phối đồ!</span>
              </div>
            )}

            {/* Avatar Section */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3E35] mb-2">
                Ảnh đại diện (Avatar)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-100 border-2 border-[#9B2226]/40 shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 py-1.5 px-3 bg-[#FAF5EE] hover:bg-[#F3E9DA] border border-[#DFCFC0] text-[#800E13] rounded-xl text-xs font-medium transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh lên</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`w-6 h-6 rounded-full overflow-hidden border transition-all ${
                          avatar === url ? 'ring-2 ring-[#9B2226] scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  required
                  className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl text-sm text-[#2C241D] focus:ring-1 focus:ring-[#9B2226] focus:outline-none"
                />
              </div>
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                  Giới tính
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'unisex')}
                  className="w-full px-3 py-2.5 bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl text-sm text-[#2C241D] focus:ring-1 focus:ring-[#9B2226] focus:outline-none"
                >
                  <option value="female">Nữ</option>
                  <option value="male">Nam</option>
                  <option value="unisex">Khác / Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                  Tuổi ({age})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={12}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl text-sm text-[#2C241D] focus:ring-1 focus:ring-[#9B2226] focus:outline-none"
                  />
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                  Chiều cao (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={120}
                    max={220}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl text-sm text-[#2C241D] focus:ring-1 focus:ring-[#9B2226] focus:outline-none"
                  />
                  <Ruler className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                  Cân nặng (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={30}
                    max={150}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6F0] border border-[#DFD4C4] rounded-xl text-sm text-[#2C241D] focus:ring-1 focus:ring-[#9B2226] focus:outline-none"
                  />
                  <Scale className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-[#800E13] hover:bg-[#9B2226] text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-[#800E13]/20"
              >
                Lưu Thay Đổi & Cập Nhật Gợi Ý
              </button>
            </div>
          </form>
        </div>

        {/* Body Analysis & Sovereignty Column (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Body Silhouette Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E9DFD1] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider block">
                  Chỉ Số Nhân Trắc Học
                </span>
                <h3 className="font-heritage text-lg font-bold text-[#2C241D]">
                  Phân Tích Dáng Người
                </h3>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-[#800E13] text-white font-bold text-xs rounded-lg">
                  Size {bodyAnalysis.recommendedSize}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#4A3E35]">
                <span>Chỉ số BMI:</span>
                <span className="font-bold text-[#2C241D]">{bodyAnalysis.bmi} ({bodyAnalysis.bmiCategory})</span>
              </div>
              <div className="flex justify-between text-[#4A3E35]">
                <span>Vóc dáng:</span>
                <span className="font-medium text-[#2C241D]">{bodyAnalysis.silhouetteDescription}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#EFE5D6] text-xs space-y-1">
              <span className="font-bold text-[#800E13] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Trang phục tôn dáng khuyên dùng:</span>
              </span>
              <p className="text-[#5C4D3C] leading-relaxed">
                {bodyAnalysis.costumeRecommendations.join(' · ')}
              </p>
              <p className="text-[11px] text-[#7B6858] pt-1">
                {bodyAnalysis.tailoringNotes}
              </p>
            </div>
          </div>

          {/* Test Friendly Error Simulator (Section 2 Requirement) */}
          <div className="bg-white p-6 rounded-3xl border border-[#E9DFD1] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#9B2226]">
              <AlertCircle className="w-4 h-4" />
              <h3 className="font-heritage text-sm font-bold text-[#2C241D]">
                Mô Phỏng Trạng Thái Lỗi Hệ Thống
              </h3>
            </div>
            <p className="text-[11px] text-[#6C584C]">
              Kiểm tra giao diện thông báo lỗi thân thiện được thiết kế riêng:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => simulateError('quota')}
                className="p-2 bg-[#FAF5EE] hover:bg-[#F3E9DA] border border-[#DFCFC0] rounded-xl text-[10px] font-semibold text-[#800E13] flex flex-col items-center gap-1 text-center"
              >
                <Clock className="w-4 h-4" />
                <span>Lỗi Quota</span>
              </button>

              <button
                type="button"
                onClick={() => simulateError('network')}
                className="p-2 bg-[#FAF5EE] hover:bg-[#F3E9DA] border border-[#DFCFC0] rounded-xl text-[10px] font-semibold text-[#800E13] flex flex-col items-center gap-1 text-center"
              >
                <WifiOff className="w-4 h-4" />
                <span>Lỗi Mất Mạng</span>
              </button>

              <button
                type="button"
                onClick={() => simulateError('limit')}
                className="p-2 bg-[#FAF5EE] hover:bg-[#F3E9DA] border border-[#DFCFC0] rounded-xl text-[10px] font-semibold text-[#800E13] flex flex-col items-center gap-1 text-center"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Lỗi Giới Hạn</span>
              </button>
            </div>
          </div>

          {/* Vietnam Sovereignty Map Card */}
          <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-[#DFD1BD] flex flex-col items-center text-center">
            <VietnamMapWithIslands className="w-36 h-48" showLabels={true} />
            <p className="text-[10px] text-[#786454] mt-2">
              Dự án Nếp cam kết tôn trọng và bảo vệ toàn vẹn chủ quyền lãnh thổ quốc gia Việt Nam trên không gian số.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

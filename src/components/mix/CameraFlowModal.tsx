import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, Timer, Sparkles, UserCheck, ShieldCheck, Upload } from 'lucide-react';

interface CameraFlowModalProps {
  onComplete: (userPhotoUrl: string) => void;
  onClose: () => void;
}

const SAMPLE_MODELS = [
  {
    id: 'sample-f1',
    label: 'Mẫu nữ thanh lịch',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-m1',
    label: 'Mẫu nam đĩnh đạc',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-f2',
    label: 'Mẫu nữ truyền thống',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  }
];

const CAMERA_PERMISSION_KEY = 'nep_camera_permission_agreed';

export const CameraFlowModal: React.FC<CameraFlowModalProps> = ({ onComplete, onClose }) => {
  // Check if user already consented to camera prompt in this session/browser
  const [hasUserRequestedCamera, setHasUserRequestedCamera] = useState<boolean>(() => {
    return localStorage.getItem(CAMERA_PERMISSION_KEY) === 'true';
  });

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [countdownEnabled, setCountdownEnabled] = useState<boolean>(true);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize webcam stream ONLY when user explicitly clicks "Bật Camera"
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (!hasUserRequestedCamera) {
      return;
    }

    async function startCamera() {
      setIsLoadingCamera(true);
      setCameraError(null);
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
          audio: false
        });
        currentStream = s;
        setStream(s);
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.warn('Cannot access camera:', err);
        setCameraError('Không thể mở camera (chưa cấp quyền hoặc thiết bị không hỗ trợ). Bạn có thể dùng ảnh mẫu hoặc tải ảnh bên dưới.');
      } finally {
        setIsLoadingCamera(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [hasUserRequestedCamera]);

  // Update video element when stream is ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCameraActive]);

  const handleStartCameraConsent = () => {
    localStorage.setItem(CAMERA_PERMISSION_KEY, 'true');
    setHasUserRequestedCamera(true);
  };

  // Handle Capture button click with optional 5-second countdown
  const triggerCapture = () => {
    if (!countdownEnabled) {
      takeSnapshot();
      return;
    }

    setCountdownValue(5);
    const interval = setInterval(() => {
      setCountdownValue((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          takeSnapshot();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 800;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror horizontally for selfie
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setCountdownValue(null);
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onComplete(capturedPhoto);
    }
  };

  const handleUseSample = (url: string) => {
    onComplete(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onComplete(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-lg bg-[#181615] rounded-3xl shadow-2xl overflow-hidden border border-stone-800 text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800 bg-stone-900/60">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#E9C46A]" />
            <h3 className="font-heritage text-base font-bold text-stone-100">
              {capturedPhoto ? 'Xem Lại Ảnh Chụp' : 'Thử Lên Người (Camera & Ảnh Mẫu)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Canvas / Video or Permission Explanation Screen */}
        <div className="relative h-[380px] sm:h-[420px] bg-black flex items-center justify-center overflow-hidden">
          {!hasUserRequestedCamera ? (
            /* Gentle Pre-Permission Explanation Screen - NO prompt shown until user clicks */
            <div className="p-6 text-center max-w-sm mx-auto flex flex-col items-center justify-center animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B2226] to-[#800E13] flex items-center justify-center text-white shadow-xl shadow-[#9B2226]/30 mb-4">
                <Camera className="w-8 h-8" />
              </div>

              <h4 className="font-heritage text-lg font-bold text-white mb-2">
                Trải Nghiệm Thử Đồ Bằng Camera
              </h4>

              <p className="text-xs text-stone-300 leading-relaxed mb-4">
                Nếp cần sự đồng ý của bạn để mở camera chụp ảnh khuôn mặt và dáng đứng, giúp ướm thử trang phục Việt Phục trực tuyến.
              </p>

              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-left text-[11px] text-stone-300 mb-5">
                <ShieldCheck className="w-4 h-4 text-[#E9C46A] shrink-0 mt-0.5" />
                <span>Ảnh chụp chỉ xử lý trực tiếp trên trình duyệt thiết bị, hoàn toàn không được gửi ra ngoài hay lưu giữ ngầm.</span>
              </div>

              <button
                onClick={handleStartCameraConsent}
                className="w-full py-3 px-5 bg-gradient-to-r from-[#9B2226] to-[#800E13] hover:from-[#BA2D32] hover:to-[#9B2226] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#9B2226]/30 transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Đồng Ý & Mở Camera</span>
              </button>
            </div>
          ) : capturedPhoto ? (
            /* Review captured photo */
            <div className="relative w-full h-full">
              <img
                src={capturedPhoto}
                alt="Ảnh chụp của bạn"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs text-[#E9C46A]">
                Ảnh vừa chụp
              </div>
            </div>
          ) : (
            /* Live Camera Stream */
            <>
              {isCameraActive && !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="p-6 text-center text-stone-400">
                  <Camera className="w-12 h-12 mx-auto text-stone-600 mb-2" />
                  <p className="text-xs max-w-xs mx-auto text-stone-300">
                    {cameraError || (isLoadingCamera ? 'Đang khởi động camera...' : 'Chưa kết nối camera')}
                  </p>
                </div>
              )}

              {/* Silhouette Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-30">
                <div className="w-44 h-56 border-2 border-dashed border-[#E9D8A6] rounded-full" />
                <span className="text-[10px] text-stone-300 mt-2 bg-black/50 px-2 py-0.5 rounded">
                  Căn chỉnh gương mặt vào khung tròn
                </span>
              </div>

              {/* Countdown Number Overlay */}
              {countdownValue !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-20">
                  <span className="text-7xl font-heritage font-bold text-[#E9C46A] animate-ping">
                    {countdownValue}
                  </span>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Controls Footer */}
        <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800 space-y-4">
          {capturedPhoto ? (
            /* Action when photo is captured: "Dùng ảnh này" & "Chụp lại" */
            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Chụp lại</span>
              </button>
              <button
                onClick={handleConfirmPhoto}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#800E13] hover:bg-[#9B2226] text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-[#800E13]/30"
              >
                <Check className="w-4 h-4" />
                <span>Dùng ảnh này</span>
              </button>
            </div>
          ) : (
            /* Options & Live Camera Controls */
            <div className="space-y-3">
              {hasUserRequestedCamera && (
                <div className="flex items-center justify-between">
                  {/* 5-second countdown toggle */}
                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={countdownEnabled}
                      onChange={(e) => setCountdownEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-[#9B2226] focus:ring-[#9B2226] border-stone-700 bg-stone-800"
                    />
                    <Timer className="w-3.5 h-3.5 text-[#E9C46A]" />
                    <span>Đếm ngược 5 giây</span>
                  </label>

                  {/* Shutter Button */}
                  <button
                    onClick={triggerCapture}
                    disabled={countdownValue !== null || !isCameraActive}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#800E13] hover:bg-[#9B2226] disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{countdownValue !== null ? `Đếm ngược (${countdownValue}s)` : 'Chụp ngay'}</span>
                  </button>
                </div>
              )}

              {/* Sample models & File upload without camera */}
              <div className="pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-[#D4A373]" />
                    <span>Hoặc chọn ảnh mẫu / tải ảnh cá nhân:</span>
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#E9C46A] hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Tải ảnh lên</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleUseSample(model.url)}
                      className="group flex flex-col items-center p-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 border border-stone-700 hover:border-[#D4A373] transition-all"
                    >
                      <img
                        src={model.url}
                        alt={model.label}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-600 group-hover:ring-[#D4A373]"
                      />
                      <span className="text-[10px] text-stone-300 mt-1 truncate max-w-full">
                        {model.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

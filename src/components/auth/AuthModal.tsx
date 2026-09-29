import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  setDoc,
  doc,
  db
} from '../../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getFriendlyError = (err: any) => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Địa chỉ email không hợp lệ.';
      case 'auth/user-disabled':
        return 'Tài khoản này đã bị khóa.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email hoặc mật khẩu không chính xác.';
      case 'auth/email-already-in-use':
        return 'Email này đã được đăng ký. Vui lòng đăng nhập.';
      case 'auth/weak-password':
        return 'Mật khẩu cần ít nhất 6 ký tự.';
      case 'auth/popup-closed-by-user':
        return 'Cửa sổ đăng nhập Google đã đóng trước khi hoàn tất.';
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.';
      default:
        return err?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setErrorMessage('Vui lòng nhập họ và tên của bạn.');
          setIsLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        // Persist initial profile in Firestore
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name: displayName.trim(),
          email: email.trim(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        setSuccessMessage('Đăng ký tài khoản thành công!');
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setSuccessMessage('Đăng nhập thành công!');
      }

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      // Sync user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || 'Khách Quý Nếp',
        email: user.email || '',
        avatar: user.photoURL || '',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setSuccessMessage('Đăng nhập Google thành công!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#DFD4C4] text-[#2C241D] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7B6858] hover:text-[#2C241D] hover:bg-[#EFE7DC] transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9B2226] to-[#800E13] text-white shadow-lg shadow-[#9B2226]/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-heritage text-2xl font-bold text-[#2C241D]">
            {mode === 'signin' ? 'Đăng Nhập Nếp' : 'Tạo Tài Khoản Mới'}
          </h2>
          <p className="mt-1 text-xs text-[#6C584C]">
            Lưu giữ bộ sưu tập Lookbook và đồng bộ số đo vóc dáng cá nhân
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex p-1 bg-[#EFE7DC] rounded-xl mb-5 border border-[#DFD4C4]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#9B2226] shadow-xs'
                : 'text-[#6C584C] hover:text-[#2C241D]'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#9B2226] shadow-xs'
                : 'text-[#6C584C] hover:text-[#2C241D]'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Feedback Alert */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google One-Click Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-stone-50 border border-[#DFD4C4] text-[#2C241D] text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#9B2226]" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Tiếp tục với Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DFD4C4]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#FAF6F0] text-[#7B6858]">hoặc qua Email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
                Họ và Tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B6858]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Linh Chi"
                  required={mode === 'signup'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DFD4C4] rounded-xl text-xs sm:text-sm text-[#2C241D] placeholder-[#9C8B7D] focus:outline-none focus:ring-2 focus:ring-[#9B2226]/30 focus:border-[#9B2226]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B6858]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenban@email.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DFD4C4] rounded-xl text-xs sm:text-sm text-[#2C241D] placeholder-[#9C8B7D] focus:outline-none focus:ring-2 focus:ring-[#9B2226]/30 focus:border-[#9B2226]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3E35] mb-1">
              Mật Khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B6858]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#DFD4C4] rounded-xl text-xs sm:text-sm text-[#2C241D] placeholder-[#9C8B7D] focus:outline-none focus:ring-2 focus:ring-[#9B2226]/30 focus:border-[#9B2226]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#9B2226] to-[#800E13] hover:from-[#BA2D32] hover:to-[#9B2226] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#9B2226]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="mt-5 text-center text-[11px] text-[#7B6858]">
          Bằng việc đăng nhập, bạn đồng ý với tiêu chuẩn bảo vệ di sản trang phục Việt và dữ liệu người dùng của Nếp.
        </p>
      </div>
    </div>
  );
};

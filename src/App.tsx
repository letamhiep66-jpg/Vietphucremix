/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { Loading } from './components/common/Loading';
import { ErrorModal } from './components/common/ErrorModal';

// ExploreSection is eagerly loaded to ensure instant First Contentful Paint (FCP)
import { ExploreSection } from './components/explore/ExploreSection';

// Background patterns
import { ExploreHeritageBackground } from './components/backgrounds/ExploreHeritageBackground';
import { MixHeritageBackground } from './components/backgrounds/MixHeritageBackground';
import { SettingsHeritageBackground } from './components/backgrounds/SettingsHeritageBackground';

// Lazy-loaded secondary feature tabs to dramatically reduce initial JavaScript bundle
const MixSection = React.lazy(() =>
  import('./components/mix/MixSection').then((m) => ({ default: m.MixSection }))
);
const HeritageMapsExplorer = React.lazy(() =>
  import('./components/maps/HeritageMapsExplorer').then((m) => ({
    default: m.HeritageMapsExplorer,
  }))
);
const SettingsSection = React.lazy(() =>
  import('./components/settings/SettingsSection').then((m) => ({
    default: m.SettingsSection,
  }))
);
const OutfitCritiqueSection = React.lazy(() =>
  import('./components/critique/OutfitCritiqueSection').then((m) => ({
    default: m.OutfitCritiqueSection,
  }))
);
const HistorySection = React.lazy(() =>
  import('./components/history/HistorySection').then((m) => ({
    default: m.HistorySection,
  }))
);
const HeritageAdvisorChatbot = React.lazy(() =>
  import('./components/chat/HeritageAdvisorChatbot').then((m) => ({
    default: m.HeritageAdvisorChatbot,
  }))
);
const AuthModal = React.lazy(() =>
  import('./components/auth/AuthModal').then((m) => ({
    default: m.AuthModal,
  }))
);

/**
 * Giao diện Fallback thanh thoát phong cách hoài cổ (Nền #FBF8F3, chữ nâu đất #786454,
 * biểu tượng hoa văn trống đồng Đông Sơn xoay nhẹ).
 */
const SectionLoadingFallback: React.FC<{ label?: string }> = ({
  label = 'Đang mở không gian di sản...',
}) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
    <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
      {/* Vòng quay họa tiết di sản */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed border-[#DFD1BD] animate-spin"
        style={{ animationDuration: '10s' }}
      />
      <div className="absolute -inset-1 rounded-full border border-[#800E13]/20 animate-pulse" />
      {/* Biểu tượng trống đồng Đông Sơn */}
      <img
        src="/assets/trong_dong_dong_son.svg"
        alt="Trống đồng Đông Sơn"
        className="w-12 h-12 object-contain opacity-75 animate-spin"
        style={{ animationDuration: '24s' }}
      />
    </div>
    <p className="font-serif text-[#786454] text-sm tracking-wide animate-pulse font-medium text-center">
      {label}
    </p>
    <p className="text-[11px] text-[#A89887] mt-1 italic">Nếp · Việt Phục Remix</p>
  </div>
);

const MainContent: React.FC = () => {
  const { activeTab, isLoading, loadingMessage, isAuthModalOpen, closeAuthModal } = useApp();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FBF8F3] text-[#2C241D] overflow-x-hidden">
      {/* Nền họa tiết lịch sử Việt Nam riêng biệt cho từng Phần */}
      {activeTab === 'explore' && <ExploreHeritageBackground />}
      {activeTab === 'mix' && <MixHeritageBackground />}
      {activeTab === 'critique' && <ExploreHeritageBackground />}
      {activeTab === 'maps' && <ExploreHeritageBackground />}
      {activeTab === 'settings' && <SettingsHeritageBackground />}
      {activeTab === 'history' && <MixHeritageBackground />}

      {/* Navbar with brand, tabs, and user profile pill */}
      <Navbar />

      {/* Main Feature View with bottom safe padding for mobile navigation bar */}
      <main className="flex-1 relative z-10 w-full max-w-full overflow-x-hidden pb-20 md:pb-0">
        {activeTab === 'explore' && <ExploreSection />}

        {activeTab === 'mix' && (
          <Suspense fallback={<SectionLoadingFallback label="Đang tải Xưởng Phối Đồ & Ma-nơ-canh 2D..." />}>
            <MixSection />
          </Suspense>
        )}

        {activeTab === 'critique' && (
          <Suspense fallback={<SectionLoadingFallback label="Đang mở Viện Thẩm Mỹ & Giám Định..." />}>
            <OutfitCritiqueSection />
          </Suspense>
        )}

        {activeTab === 'maps' && (
          <Suspense fallback={<SectionLoadingFallback label="Đang nạp Bản đồ Di sản & Tiệm Cổ phục..." />}>
            <HeritageMapsExplorer />
          </Suspense>
        )}

        {activeTab === 'history' && (
          <Suspense fallback={<SectionLoadingFallback label="Đang tra cứu Lịch sử & Dòng chảy Cổ phục..." />}>
            <HistorySection />
          </Suspense>
        )}

        {activeTab === 'settings' && (
          <Suspense fallback={<SectionLoadingFallback label="Đang tải Hồ sơ May đo & Nhân trắc học..." />}>
            <SettingsSection />
          </Suspense>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav />

      {/* Global Heritage Advisor Chatbot with Google Maps Integration (Lazy Loaded) */}
      <Suspense fallback={null}>
        <HeritageAdvisorChatbot />
      </Suspense>

      {/* Footer */}
      <Footer />

      {/* Global Loading Spinner */}
      {isLoading && <Loading message={loadingMessage} />}

      {/* Friendly Error Dialog */}
      <ErrorModal />

      {/* Firebase Authentication Modal (Lazy Loaded) */}
      {isAuthModalOpen && (
        <Suspense fallback={null}>
          <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
        </Suspense>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

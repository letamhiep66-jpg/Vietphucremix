import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  TraditionalCostume, 
  UserWardrobeItem, 
  AppError, 
  CanvasLayerState,
  MixOption,
  ActiveTab,
  SavedLookbookItem
} from '../types';
import { 
  TRADITIONAL_COSTUMES, 
  MODERN_GARMENTS, 
  ACCESSORY_ITEMS, 
  TRADITIONAL_COLORS, 
  MODERN_COLORS 
} from '../services/costumeService';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  firebaseSignOut, 
  doc, 
  getDoc, 
  setDoc,
  type User 
} from '../services/firebase';

interface AppContextType {
  // Authentication
  currentUser: User | null;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mixSubflow: 'event' | 'free';
  setMixSubflow: (subflow: 'event' | 'free') => void;

  // Lookbook History
  lookbookHistory: SavedLookbookItem[];
  saveLookbook: (item: Omit<SavedLookbookItem, 'id' | 'createdAt'>) => SavedLookbookItem;
  deleteLookbook: (id: string) => void;
  updateLookbookTitle: (id: string, newTitle: string) => void;
  clearLookbookHistory: () => void;
  restoreLookbookToCanvas: (item: SavedLookbookItem) => void;

  // Heritage Maps Location Navigation
  selectedMapLocationId: string | null;
  setSelectedMapLocationId: (id: string | null) => void;
  navigateToMapLocation: (locationId: string) => void;

  // Heritage Advisor Chatbot
  isChatOpen: boolean;
  chatInitialPrompt: string;
  chatCostumeContext: string;
  openChatWithContext: (initialPrompt?: string, costumeContext?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Selected costume bridge from Explore to Mix
  selectedCostumeForMix: TraditionalCostume | null;
  selectCostumeForMix: (costume: TraditionalCostume) => void;

  // Canvas State (Free Mix)
  canvasState: CanvasLayerState;
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasLayerState>>;
  updateCanvasLayer: <K extends keyof CanvasLayerState>(layer: K, value: CanvasLayerState[K]) => void;

  // Comparison State
  comparisonSlotA: CanvasLayerState | null;
  comparisonSlotB: CanvasLayerState | null;
  saveToComparison: () => void;
  clearComparison: () => void;
  isComparing: boolean;
  setIsComparing: (val: boolean) => void;

  // Wardrobe Items (Session only, max 5)
  wardrobeItems: UserWardrobeItem[];
  addWardrobeItem: (item: Omit<UserWardrobeItem, 'id' | 'addedAt'>) => { success: boolean; message?: string };
  removeWardrobeItem: (id: string) => void;


  // Camera / Fitting Modal Flow
  activeFittingOutfit: MixOption | CanvasLayerState | null;
  setActiveFittingOutfit: (outfit: MixOption | CanvasLayerState | null) => void;

  // Global Loading & Error
  isLoading: boolean;
  loadingMessage: string;
  setLoadingState: (loading: boolean, message?: string) => void;

  currentError: AppError | null;
  showError: (error: AppError) => void;
  clearError: () => void;
  simulateError: (type: 'quota' | 'network' | 'limit') => void;
}

const DEFAULT_SAVED_LOOKBOOKS: SavedLookbookItem[] = [
  {
    id: 'sample-lookbook-1',
    title: 'Lookbook Áo Tấc Lễ Nhạc × Chân Váy Xếp Ly Đen',
    createdAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    compositeImage: TRADITIONAL_COSTUMES[2]?.frontImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    costumeName: 'Áo Tấc (Lễ Phục Thụng Tay Ngũ Thân)',
    costumeEra: 'Thời Nguyễn (Thế kỷ XIX - XX)',
    costumeId: 'ao-tac-tay-thung',
    modernGarmentName: 'Chân Váy Xếp Ly Dáng Dài',
    modernGarmentCategory: 'skirt',
    modernGarmentId: 'mod-pleated-skirt',
    accessoryNames: ['Khăn Đóng Quấn Nếp Chữ Nhân', 'Khánh Ngọc Bội Chạm Khắc'],
    traditionalColorName: 'Đỏ Điều Son',
    modernColorName: 'Đen Mực Tàu',
    occasion: 'Khai mạc triển lãm Mỹ thuật Di sản',
    harmonyScore: 96,
    notes: 'Phom dáng tay thụng uyển chuyển, kết hợp chân váy tối giản tôn lên vẻ quý phái trầm mặc.',
    canvasState: {
      traditional: TRADITIONAL_COSTUMES[2] || TRADITIONAL_COSTUMES[0],
      modern: MODERN_GARMENTS[2] || null,
      accessory: ACCESSORY_ITEMS[0] || null,
      traditionalColor: TRADITIONAL_COLORS[0],
      modernColor: MODERN_COLORS[1]
    }
  },
  {
    id: 'sample-lookbook-2',
    title: 'Lookbook Áo Dài Ngũ Thân Nam × Blazer Dáng Suông',
    createdAt: new Date(Date.now() - 86400000 * 5).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    compositeImage: TRADITIONAL_COSTUMES[1]?.frontImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    costumeName: 'Áo Dài Ngũ Thân Nam (Lập Lĩnh Khăn Đóng)',
    costumeEra: 'Thế kỷ XVIII - nay (Định hình 1744 - 1827)',
    costumeId: 'ao-ngu-than-nam',
    modernGarmentName: 'Blazer Phom Rộng Cắt Tối Giản',
    modernGarmentCategory: 'jacket',
    modernGarmentId: 'mod-blazer-oversize',
    accessoryNames: ['Khăn Đóng Nam Giới', 'Kính Râm Gọng Đồi Mồi Retro'],
    traditionalColorName: 'Xanh Chàm Lam Điền',
    modernColorName: 'Xám Ghi Tro',
    occasion: 'Gặp gỡ đối tác quốc tế & Giao lưu văn hóa',
    harmonyScore: 92,
    notes: 'Phong thái đĩnh đạc, cổ lập lĩnh đứng đoan trang bên trong lớp blazer vai xuôi hiện đại.',
    canvasState: {
      traditional: TRADITIONAL_COSTUMES[1],
      modern: MODERN_GARMENTS[0] || null,
      accessory: ACCESSORY_ITEMS[3] || null,
      traditionalColor: TRADITIONAL_COLORS[1] || TRADITIONAL_COLORS[0],
      modernColor: MODERN_COLORS[0]
    }
  }
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Lê Minh An',
  age: 24,
  height: 168,
  weight: 56,
  gender: 'female',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [mixSubflow, setMixSubflow] = useState<'event' | 'free'>('event');

  // Firebase Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  };

  // Lookbook History state
  const [lookbookHistory, setLookbookHistory] = useState<SavedLookbookItem[]>(() => {
    try {
      const saved = localStorage.getItem('nep_saved_lookbooks_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_SAVED_LOOKBOOKS;
    } catch {
      return DEFAULT_SAVED_LOOKBOOKS;
    }
  });

  // Persist lookbook history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nep_saved_lookbooks_v1', JSON.stringify(lookbookHistory));
    } catch (e) {
      console.warn('Cannot write lookbook history to localStorage', e);
    }
  }, [lookbookHistory]);

  const saveLookbook = (item: Omit<SavedLookbookItem, 'id' | 'createdAt'>): SavedLookbookItem => {
    const newItem: SavedLookbookItem = {
      ...item,
      id: `lookbook-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setLookbookHistory((prev) => [newItem, ...prev]);

    // If authenticated, sync to Firestore
    if (currentUser) {
      setDoc(doc(db, 'users', currentUser.uid, 'lookbooks', newItem.id), {
        ...newItem,
        userId: currentUser.uid,
      }).catch((err) => console.warn('Could not sync lookbook to Firestore:', err));
    }

    return newItem;
  };

  const deleteLookbook = (id: string) => {
    setLookbookHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const updateLookbookTitle = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setLookbookHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle.trim() } : item))
    );
  };

  const clearLookbookHistory = () => {
    setLookbookHistory([]);
  };

  const restoreLookbookToCanvas = (item: SavedLookbookItem) => {
    if (item.canvasState) {
      setCanvasState(item.canvasState);
    } else {
      const foundCostume = TRADITIONAL_COSTUMES.find(
        (c) => c.id === item.costumeId || c.name === item.costumeName
      ) || TRADITIONAL_COSTUMES[0];

      const foundModern = MODERN_GARMENTS.find(
        (m) => m.id === item.modernGarmentId || m.name === item.modernGarmentName
      ) || null;

      const foundAcc = ACCESSORY_ITEMS.find(
        (a) => item.accessoryNames?.includes(a.name)
      ) || null;

      const foundTradColor = TRADITIONAL_COLORS.find(
        (c) => c.name === item.traditionalColorName
      ) || TRADITIONAL_COLORS[0];

      const foundModColor = MODERN_COLORS.find(
        (c) => c.name === item.modernColorName
      ) || MODERN_COLORS[0];

      setCanvasState({
        traditional: foundCostume,
        modern: foundModern,
        accessory: foundAcc,
        traditionalColor: foundTradColor,
        modernColor: foundModColor
      });
    }

    setActiveTab('mix');
    setMixSubflow('free');
  };

  // Heritage Maps Location Navigation
  const [selectedMapLocationId, setSelectedMapLocationId] = useState<string | null>(null);

  const navigateToMapLocation = (locationId: string) => {
    setSelectedMapLocationId(locationId);
    setActiveTab('maps');
  };

  // Heritage Advisor Chatbot State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [chatCostumeContext, setChatCostumeContext] = useState<string>('');

  const openChatWithContext = (initialPrompt?: string, costumeContext?: string) => {
    if (initialPrompt) setChatInitialPrompt(initialPrompt);
    if (costumeContext) setChatCostumeContext(costumeContext);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // Load profile from sessionStorage or default
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = sessionStorage.getItem('nep_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [selectedCostumeForMix, setSelectedCostumeForMix] = useState<TraditionalCostume | null>(null);

  // Canvas layers state
  const [canvasState, setCanvasState] = useState<CanvasLayerState>({
    traditional: TRADITIONAL_COSTUMES[0],
    modern: MODERN_GARMENTS[1],
    accessory: ACCESSORY_ITEMS[1],
    traditionalColor: TRADITIONAL_COLORS[0],
    modernColor: MODERN_COLORS[0],
    equippedLayers: {
      baseGender: 'female',
      bottom: MODERN_GARMENTS[1],
      innerTop: TRADITIONAL_COSTUMES[6] || null, // Áo yếm lót trong
      outerTop: TRADITIONAL_COSTUMES[0], // Áo Dài truyền thống
      accessoryBack: ACCESSORY_ITEMS[0], // Khăn đóng
      shoes: MODERN_GARMENTS[3], // Chelsea boots
      accessoryFront: ACCESSORY_ITEMS[1] // Túi gấm
    }
  });

  // Comparison slots
  const [comparisonSlotA, setComparisonSlotA] = useState<CanvasLayerState | null>(null);
  const [comparisonSlotB, setComparisonSlotB] = useState<CanvasLayerState | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Wardrobe items (max 5 in session)
  const [wardrobeItems, setWardrobeItems] = useState<UserWardrobeItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('nep_wardrobe_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeFittingOutfit, setActiveFittingOutfit] = useState<MixOption | CanvasLayerState | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Đang thêu dệt tà áo...');
  const [currentError, setCurrentError] = useState<AppError | null>(null);

  // Persist profile in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('nep_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Cannot write profile to sessionStorage', e);
    }
  }, [userProfile]);

  // Persist wardrobe in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('nep_wardrobe_items', JSON.stringify(wardrobeItems));
    } catch (e) {
      console.warn('Cannot write wardrobe to sessionStorage', e);
    }
  }, [wardrobeItems]);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile };
      if (currentUser) {
        setDoc(doc(db, 'users', currentUser.uid), {
          ...updated,
          uid: currentUser.uid,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch((err) => console.warn('Could not sync user profile to Firestore:', err));
      }
      return updated;
    });
  };

  // Listen to Firebase Auth state change and load user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile((prev) => ({
              ...prev,
              name: data.name || user.displayName || prev.name,
              avatar: data.avatar || user.photoURL || prev.avatar,
              age: data.age ?? prev.age,
              height: data.height ?? prev.height,
              weight: data.weight ?? prev.weight,
              gender: data.gender || prev.gender,
            }));
          } else {
            // First time login - initialize doc
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              name: user.displayName || userProfile.name,
              email: user.email || '',
              avatar: user.photoURL || userProfile.avatar,
              age: userProfile.age,
              height: userProfile.height,
              weight: userProfile.weight,
              gender: userProfile.gender,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        } catch (e) {
          console.warn('Error fetching Firestore user profile:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const selectCostumeForMix = (costume: TraditionalCostume) => {
    setSelectedCostumeForMix(costume);
    setCanvasState((prev) => ({
      ...prev,
      traditional: costume
    }));
    setMixSubflow('free');
    setActiveTab('mix');
  };

  const updateCanvasLayer = <K extends keyof CanvasLayerState>(layer: K, value: CanvasLayerState[K]) => {
    setCanvasState((prev) => ({ ...prev, [layer]: value }));
  };

  const saveToComparison = () => {
    if (!comparisonSlotA) {
      setComparisonSlotA({ ...canvasState });
      setIsComparing(true);
    } else {
      setComparisonSlotB({ ...canvasState });
      setIsComparing(true);
    }
  };

  const clearComparison = () => {
    setComparisonSlotA(null);
    setComparisonSlotB(null);
    setIsComparing(false);
  };

  const addWardrobeItem = (item: Omit<UserWardrobeItem, 'id' | 'addedAt'>) => {
    if (wardrobeItems.length >= 5) {
      return { 
        success: false, 
        message: 'Tủ đồ phiên hiện tại đã đạt tối đa 5 món. Vui lòng xóa bớt trước khi thêm mới.' 
      };
    }
    const newItem: UserWardrobeItem = {
      ...item,
      id: `wardrobe-${Date.now()}`,
      addedAt: Date.now()
    };
    setWardrobeItems((prev) => [newItem, ...prev]);
    return { success: true };
  };

  const removeWardrobeItem = (id: string) => {
    setWardrobeItems((prev) => prev.filter((item) => item.id !== id));
  };

  const setLoadingState = (loading: boolean, message = 'Đang thêu dệt tà áo...') => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  const showError = (error: AppError) => {
    setCurrentError(error);
  };

  const clearError = () => {
    setCurrentError(null);
  };

  const simulateError = (type: 'quota' | 'network' | 'limit') => {
    if (type === 'quota') {
      showError({
        type: 'quota',
        title: 'Hạn Mức Hệ Thống',
        message: 'Hệ thống đang quá tải người thử đồ, bạn nán lại uống chén trà nhé (vui lòng thử lại sau ít phút).',
        retryTime: '15 phút'
      });
    } else if (type === 'network') {
      showError({
        type: 'network',
        title: 'Lỗi Kết Nối Mạng',
        message: 'Mất kết nối mạng, vui lòng kiểm tra lại đường truyền internet.'
      });
    } else if (type === 'limit') {
      showError({
        type: 'limit',
        title: 'Giới Hạn Lượt Trải Nghiệm',
        message: 'Bạn đã đạt giới hạn lượt dùng thử trong ngày hôm nay.'
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        logout,
        activeTab,
        setActiveTab,
        mixSubflow,
        setMixSubflow,
        lookbookHistory,
        saveLookbook,
        deleteLookbook,
        updateLookbookTitle,
        clearLookbookHistory,
        restoreLookbookToCanvas,
        selectedMapLocationId,
        setSelectedMapLocationId,
        navigateToMapLocation,
        isChatOpen,
        chatInitialPrompt,
        chatCostumeContext,
        openChatWithContext,
        closeChat,
        toggleChat,
        userProfile,
        updateUserProfile,
        selectedCostumeForMix,
        selectCostumeForMix,
        canvasState,
        setCanvasState,
        updateCanvasLayer,
        comparisonSlotA,
        comparisonSlotB,
        saveToComparison,
        clearComparison,
        isComparing,
        setIsComparing,
        wardrobeItems,
        addWardrobeItem,
        removeWardrobeItem,
        activeFittingOutfit,
        setActiveFittingOutfit,
        isLoading,
        loadingMessage,
        setLoadingState,
        currentError,
        showError,
        clearError,
        simulateError
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

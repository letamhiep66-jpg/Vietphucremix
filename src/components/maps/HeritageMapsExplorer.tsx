import React, { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { HERITAGE_LOCATIONS, HeritageLocation, CITY_COORDINATES } from '../../data/heritageLocations';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  ExternalLink, 
  Search, 
  Camera, 
  Store, 
  Scissors, 
  Sparkles, 
  Compass, 
  MessageSquare, 
  Filter, 
  ChevronRight,
  Maximize2,
  Navigation,
  Navigation2,
  CheckCircle2,
  Star,
  Layers,
  Phone,
  Crosshair,
  AlertCircle,
  ArrowUpDown,
  LocateFixed,
  SlidersHorizontal
} from 'lucide-react';

/**
 * Tính khoảng cách địa lý theo công thức Haversine (đơn vị: km)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Bán kính trái đất tính bằng km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export const HeritageMapsExplorer: React.FC = () => {
  const { openChatWithContext, selectedMapLocationId, setSelectedMapLocationId } = useApp();

  // Map DOM refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter & Search states
  const [selectedCity, setSelectedCity] = useState<string>('Toàn quốc');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'photo_spot' | 'rental_shop' | 'tailor_shop'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCostumeFilter, setSelectedCostumeFilter] = useState<string>('Tất cả');
  const [activeLocation, setActiveLocation] = useState<HeritageLocation | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid'>('split');
  const [mapTileStyle, setMapTileStyle] = useState<'voyager' | 'osm'>('voyager');

  // Geolocation & Suggestion states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [maxDistanceRadius, setMaxDistanceRadius] = useState<number | null>(null); // km

  const cities = ['Toàn quốc', 'Hà Nội', 'Thừa Thiên Huế', 'Đà Nẵng / Hội An', 'TP. Hồ Chí Minh', 'Ninh Bình', 'Bắc Ninh'];
  const costumeFilters = ['Tất cả', 'Áo Tấc', 'Áo Nhật Bình', 'Áo Tứ Thân', 'Áo Dài Truyền Thống Nữ', 'Áo Ngũ Thân Nam', 'Áo Giao Lĩnh', 'Áo Đối Khâm'];

  // =========================================================================
  // 1. GEOLOCATION HANDLERS: Xin quyền vị trí và cập nhật tọa độ người dùng
  // =========================================================================
  const requestUserLocation = (showAutoPrompt = false) => {
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setLocationPermission('granted');
        setIsLocating(false);
        setSortByDistance(true);

        // Di chuyển camera bản đồ đến vị trí người dùng
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 13, { duration: 1.2 });
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationPermission('denied');
          if (!showAutoPrompt) {
            setLocationError('Bạn đã từ chối quyền truy cập vị trí. Bạn có thể chọn thành phố thủ công ở bộ lọc.');
          }
        } else {
          setLocationError('Không thể xác định vị trí hiện tại. Vui lòng thử lại sau.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Tự động kiểm tra quyền vị trí khi vào trang nếu đã được cấp quyền trước đó
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestUserLocation(true);
        } else if (result.state === 'denied') {
          setLocationPermission('denied');
        }
      }).catch(() => {
        // Fallback for browsers that don't support geolocation permissions query
      });
    }
  }, []);

  // =========================================================================
  // 2. KHỞI TẠO BẢN ĐỒ LEAFLET VỚI OPENSTREETMAP / CARTO TILES
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Khởi tạo bản đồ
      const map = L.map(mapContainerRef.current, {
        center: [16.0544, 107.5000],
        zoom: 6,
        zoomControl: false,
        attributionControl: true
      });

      // Zoom controls ở góc dưới phải
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer: CartoDB Voyager (Phong cách màu ấm hoài cổ, chuẩn mỹ cảm Việt phục)
      const tileUrl = mapTileStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // LayerGroup chứa các markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        userMarkerRef.current = null;
      }
    };
  }, []);

  // Đổi kiểu hiển thị Tile Layer khi người dùng chọn phong cách
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const tileUrl = mapTileStyle === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(mapInstanceRef.current);
  }, [mapTileStyle]);

  // =========================================================================
  // 3. TÍNH TOÁN KHOẢNG CÁCH VÀ LỌC ĐỊA ĐIỂM
  // =========================================================================
  const locationsWithDistance = useMemo(() => {
    return HERITAGE_LOCATIONS.map((loc) => {
      const distance = userLocation
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, loc.lat, loc.lng)
        : null;
      return { ...loc, distance };
    });
  }, [userLocation]);

  // Các địa điểm sau khi áp dụng bộ lọc (thành phố, danh mục, trang phục, tìm kiếm, bán kính)
  const filteredLocations = useMemo(() => {
    let list = locationsWithDistance.filter((loc) => {
      // Thành phố
      if (selectedCity !== 'Toàn quốc' && loc.city !== selectedCity) {
        return false;
      }
      // Danh mục
      if (selectedCategory !== 'all' && loc.category !== selectedCategory) {
        return false;
      }
      // Trang phục
      if (
        selectedCostumeFilter !== 'Tất cả' &&
        !loc.recommendedCostumes.some((c) =>
          c.toLowerCase().includes(selectedCostumeFilter.toLowerCase())
        )
      ) {
        return false;
      }
      // Bán kính gần
      if (maxDistanceRadius && loc.distance !== null && loc.distance > maxDistanceRadius) {
        return false;
      }
      // Tìm kiếm từ khóa
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = loc.name.toLowerCase().includes(q);
        const matchAddress = loc.address.toLowerCase().includes(q);
        const matchDesc = loc.description.toLowerCase().includes(q);
        const matchCostumes = loc.recommendedCostumes.some((c) =>
          c.toLowerCase().includes(q)
        );
        if (!matchName && !matchAddress && !matchDesc && !matchCostumes) {
          return false;
        }
      }
      return true;
    });

    // Sắp xếp: Gần nhất hoặc mặc định
    if (sortByDistance && userLocation) {
      list = [...list].sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return list;
  }, [locationsWithDistance, selectedCity, selectedCategory, selectedCostumeFilter, searchQuery, sortByDistance, userLocation, maxDistanceRadius]);

  // TOP gợi ý gần nhất (Nearest Suggestions)
  const nearestSuggestions = useMemo(() => {
    if (!userLocation) return [];
    return [...locationsWithDistance]
      .filter((loc) => loc.distance !== null)
      .sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999))
      .slice(0, 4);
  }, [locationsWithDistance, userLocation]);

  // =========================================================================
  // 4. VẼ VÀ ĐỒNG BỘ MARKERS LÊN BẢN ĐỒ OPENSTREETMAP LEAFLET
  // =========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    // Xóa markers cũ
    markersLayerRef.current.clearLayers();

    // 1. Vẽ User Location Marker nếu có
    if (userLocation) {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white">
            <div class="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <div class="absolute -inset-1.5 bg-blue-400/40 rounded-full animate-ping"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userHtml,
        className: 'custom-leaflet-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
          .bindPopup(`
            <div class="p-2 text-xs font-sans text-center">
              <span class="font-bold text-blue-700">📍 Vị trí hiện tại của bạn</span>
              <p class="text-stone-500 mt-0.5">Đang gợi ý các điểm Việt phục gần bạn</p>
            </div>
          `);
      }
      userMarkerRef.current.addTo(markersLayerRef.current);
    }

    // 2. Vẽ Markers các địa điểm di sản, tiệm thuê, nhà may
    filteredLocations.forEach((loc) => {
      const isSelected = activeLocation?.id === loc.id;

      // Màu sắc theo danh mục
      const bgColor = loc.category === 'photo_spot' 
        ? '#9B2226' 
        : loc.category === 'rental_shop' 
        ? '#1B4332' 
        : '#1D3557';

      const iconSymbol = loc.category === 'photo_spot' ? '📸' : loc.category === 'rental_shop' ? '👘' : '🧵';

      const distanceBadge = loc.distance !== null
        ? `<span class="bg-black/60 text-white text-[9px] px-1 py-0.2 rounded-sm ml-1">${loc.distance}km</span>`
        : '';

      const markerHtml = `
        <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer ${
          isSelected 
            ? 'scale-115 ring-3 ring-amber-400 shadow-xl' 
            : 'hover:scale-105'
        }" style="background-color: ${bgColor}; white-space: nowrap;">
          <span>${iconSymbol}</span>
          <span class="max-w-[110px] truncate">${loc.name}</span>
          ${distanceBadge}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [120, 28],
        iconAnchor: [60, 14]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });

      // Nội dung popup chi tiết chuẩn di sản
      const popupHtml = `
        <div class="p-3 max-w-[280px] font-sans text-[#2C241D]">
          <div class="relative h-28 w-full rounded-xl overflow-hidden mb-2 bg-stone-900">
            <img src="${loc.image}" alt="${loc.name}" class="w-full h-full object-cover" />
            <span class="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white" style="background-color: ${bgColor}">
              ${loc.categoryLabel}
            </span>
            ${loc.distance !== null ? `<span class="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-amber-300">Cách bạn ${loc.distance} km</span>` : ''}
          </div>
          <h4 class="font-bold text-sm text-[#1E1713] leading-snug">${loc.name}</h4>
          <p class="text-[11px] text-[#6C584C] mt-1 leading-tight flex items-start gap-1">
            📍 <span>${loc.address}</span>
          </p>
          ${loc.photoTip ? `<p class="mt-1.5 text-[10px] text-[#55473D] bg-[#FAF5EE] p-1.5 rounded-lg border border-[#E9DFD2]"><strong class="text-[#800E13]">📸 Mẹo chụp:</strong> ${loc.photoTip}</p>` : ''}
          <div class="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
            <span class="text-[10px] font-semibold text-[#800E13]">${loc.priceRange || 'Miễn phí / Vé vào cổng'}</span>
            <a href="${loc.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-[#800E13] hover:bg-[#9B2226] text-white text-[10px] font-semibold rounded-lg flex items-center gap-1 shadow-xs">
              Chỉ đường
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        handleSelectLocation(loc, false);
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [filteredLocations, activeLocation, userLocation]);

  // Xử lý chọn địa điểm
  const handleSelectLocation = (loc: HeritageLocation, panMap = true) => {
    setActiveLocation(loc);
    setSelectedMapLocationId(loc.id);

    // Cuộn thẻ tương ứng
    cardRefs.current[loc.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Bay mượt camera đến tọa độ
    if (panMap && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  };

  // Điều hướng từ bên ngoài (ví dụ chat)
  useEffect(() => {
    if (selectedMapLocationId) {
      const found = HERITAGE_LOCATIONS.find((l) => l.id === selectedMapLocationId);
      if (found) {
        handleSelectLocation(found, true);
        setSelectedCity(found.city);
        setViewMode('split');
      }
    }
  }, [selectedMapLocationId]);

  // Camera đổi theo thành phố khi người dùng bấm chọn thành phố
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setActiveLocation(null);
    if (mapInstanceRef.current && CITY_COORDINATES[city]) {
      const { lat, lng, zoom } = CITY_COORDINATES[city];
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Header & Title Section */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-[#9B2226]" />
          <span>Bản đồ Mở OpenStreetMap & Định vị Thông minh</span>
        </div>

        <h1 className="font-heritage text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E1713] tracking-tight">
          Bản Đồ Di Sản & Không Gian Cổ Phục
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6C584C] max-w-2xl mx-auto leading-relaxed">
          Tự động gợi ý những điểm check-in di sản, tiệm thuê trang phục và nhà may đo gần bạn nhất. Hoạt động mượt mà qua OpenStreetMap, không phụ thuộc mã khóa API.
        </p>
      </div>

      {/* =========================================================================
          BANNER XIN QUYỀN VỊ TRÍ / TRẠNG THÁI GPS
          ========================================================================= */}
      {!userLocation && locationPermission !== 'denied' && (
        <div className="max-w-5xl mx-auto mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border border-amber-300 text-amber-950 shadow-sm animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9B2226] text-white flex items-center justify-center shrink-0 shadow-sm">
                <LocateFixed className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left text-xs sm:text-sm">
                <p className="font-bold text-amber-950">
                  Khám phá các điểm Việt phục gần bạn nhất
                </p>
                <p className="text-amber-800 text-[11px] sm:text-xs">
                  Bật quyền vị trí để hệ thống tự tính khoảng cách chính xác và gợi ý không gian chụp ảnh quanh bạn.
                </p>
              </div>
            </div>

            <button
              onClick={() => requestUserLocation(false)}
              disabled={isLocating}
              className="px-4 py-2 bg-[#9B2226] hover:bg-[#800E13] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {isLocating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang định vị...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Bật vị trí & Gợi ý ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {locationError && (
        <div className="max-w-5xl mx-auto mb-4 p-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{locationError}</span>
          </div>
          <button 
            onClick={() => setLocationError(null)} 
            className="text-stone-500 hover:text-stone-800 text-[11px] font-semibold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* =========================================================================
          SUGGESTION STRIP: GỢI Ý ĐỊA ĐIỂM GẦN BẠN NHẤT
          ========================================================================= */}
      {userLocation && nearestSuggestions.length > 0 && (
        <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-amber-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9B2226]" />
              <h3 className="text-xs sm:text-sm font-bold text-[#1E1713]">
                Gợi ý gần vị trí của bạn nhất
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Đã định vị GPS
              </span>
            </div>

            <button
              onClick={() => {
                setSortByDistance(true);
                setSelectedCity('Toàn quốc');
              }}
              className="text-[11px] text-[#9B2226] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Xem theo thứ tự cự ly</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nearestSuggestions.map((loc) => {
              const isSelected = activeLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc, true)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-2.5 items-center ${
                    isSelected
                      ? 'border-[#9B2226] bg-amber-50/70 ring-1 ring-[#9B2226]'
                      : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                  }`}
                >
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 bg-stone-900"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-[#9B2226] bg-red-50 px-1 py-0.2 rounded">
                        {loc.distance} km
                      </span>
                      <span className="text-[9px] text-stone-500 truncate">{loc.categoryLabel}</span>
                    </div>
                    <p className="text-xs font-bold text-stone-900 truncate mt-0.5">{loc.name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{loc.address}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          BỘ LỌC VÀ ĐIỀU KHIỂN
          ========================================================================= */}
      <div className="max-w-5xl mx-auto mb-6 space-y-3.5">
        {/* Search, Vị trí của tôi, và View Mode */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm di tích, địa chỉ, hoặc trang phục (Áo Tấc, Nhật Bình...)"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#DFD1BD] rounded-xl text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9B2226]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Nút định vị lại */}
            <button
              onClick={() => requestUserLocation(false)}
              disabled={isLocating}
              title="Định vị vị trí của tôi"
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                userLocation
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-[#DFD1BD] text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Vị trí của tôi</span>
            </button>

            {/* Sắp xếp theo khoảng cách */}
            {userLocation && (
              <button
                onClick={() => setSortByDistance(!sortByDistance)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  sortByDistance
                    ? 'bg-[#9B2226] text-white border-[#9B2226]'
                    : 'bg-white border-[#DFD1BD] text-stone-700 hover:bg-stone-50'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Gần tôi nhất</span>
              </button>
            )}

            {/* Đổi giao diện Bản đồ / Lưới thẻ */}
            <div className="flex p-0.5 bg-stone-100 rounded-xl border border-stone-200">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'split' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Bản đồ
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Danh sách
              </button>
            </div>
          </div>
        </div>

        {/* Thanh lọc Thành phố */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 whitespace-nowrap mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#9B2226]" /> Tỉnh/Thành:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-[#9B2226] text-white shadow-xs'
                  : 'bg-white/80 border border-[#DFD1BD] text-[#6C584C] hover:bg-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Lọc danh mục & trang phục */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tất cả ({locationsWithDistance.length})
            </button>
            <button
              onClick={() => setSelectedCategory('photo_spot')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedCategory === 'photo_spot'
                  ? 'bg-[#9B2226] text-white'
                  : 'bg-red-50 text-[#9B2226] hover:bg-red-100'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Điểm Chụp</span>
            </button>
            <button
              onClick={() => setSelectedCategory('rental_shop')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedCategory === 'rental_shop'
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-emerald-50 text-[#1B4332] hover:bg-emerald-100'
              }`}
            >
              <Store className="w-3 h-3" />
              <span>Tiệm Thuê</span>
            </button>
            <button
              onClick={() => setSelectedCategory('tailor_shop')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedCategory === 'tailor_shop'
                  ? 'bg-[#1D3557] text-white'
                  : 'bg-blue-50 text-[#1D3557] hover:bg-blue-100'
              }`}
            >
              <Scissors className="w-3 h-3" />
              <span>Nhà May Đo</span>
            </button>
          </div>

          {/* Chọn phong cách nền bản đồ OpenStreetMap */}
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <span className="hidden sm:inline">Kiểu bản đồ:</span>
            <button
              onClick={() => setMapTileStyle('voyager')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                mapTileStyle === 'voyager' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Hoài Cổ (Voyager)
            </button>
            <span>•</span>
            <button
              onClick={() => setMapTileStyle('osm')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                mapTileStyle === 'osm' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Tiêu chuẩn (OSM)
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          KHÔNG GIAN HIỂN THỊ CHÍNH (BẢN ĐỒ LEAFLET + DANH SÁCH THẺ)
          ========================================================================= */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cột Bản đồ Leaflet OpenStreetMap */}
          <div className="lg:col-span-7 sticky top-20 z-20">
            <div className="bg-white p-2 rounded-3xl border border-[#DFD1BD] shadow-lg overflow-hidden">
              <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[580px] rounded-2xl overflow-hidden bg-stone-100">
                {/* Leaflet map container */}
                <div 
                  ref={mapContainerRef} 
                  className="w-full h-full z-0" 
                  style={{ minHeight: '100%' }}
                />

                {/* Chú thích màu sắc góc dưới */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#DFD1BD] shadow-sm text-[10px] text-stone-700 flex items-center gap-3 z-10">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9B2226]" />
                    <span>Điểm Chụp</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />
                    <span>Tiệm Thuê</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1D3557]" />
                    <span>Nhà May Đo</span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center gap-1 border-l pl-2 border-stone-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                      <span className="font-semibold text-blue-700">Vị trí của bạn</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cột Danh sách thẻ địa điểm */}
          <div className="lg:col-span-5 space-y-4 max-h-[700px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-stone-600">
                Tìm thấy {filteredLocations.length} địa điểm
                {sortByDistance && userLocation ? ' (sắp xếp theo cự ly gần nhất)' : ''}
              </span>
              <span className="text-[11px] text-[#9B2226] font-medium">
                Nhấp thẻ để định vị trên bản đồ
              </span>
            </div>

            {filteredLocations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
                <Compass className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-bold">Không tìm thấy địa điểm phù hợp</p>
                <p className="text-xs mt-1">Hãy thử xóa bộ lọc hoặc chọn thành phố khác.</p>
                <button
                  onClick={() => {
                    setSelectedCity('Toàn quốc');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 bg-[#9B2226] text-white text-xs font-semibold rounded-lg"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = activeLocation?.id === loc.id;

                return (
                  <div
                    key={loc.id}
                    ref={(el) => { cardRefs.current[loc.id] = el; }}
                    onClick={() => handleSelectLocation(loc, true)}
                    className={`bg-white rounded-2xl border p-4 transition-all duration-200 cursor-pointer shadow-xs ${
                      isSelected
                        ? 'border-[#9B2226] ring-2 ring-[#9B2226]/20 shadow-md bg-[#FFFDFB]'
                        : 'border-[#E9DFD1] hover:border-[#D4A373] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex gap-3.5">
                      {/* Ảnh thu nhỏ */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-stone-900">
                        <img
                          src={loc.image}
                          alt={loc.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white">
                          {loc.categoryLabel}
                        </span>

                        {loc.distance !== null && (
                          <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#9B2226] text-white shadow-xs">
                            {loc.distance} km
                          </span>
                        )}
                      </div>

                      {/* Thông tin chi tiết */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-heritage text-sm sm:text-base font-bold text-[#1E1713] leading-snug">
                              {loc.name}
                            </h3>
                            {loc.rating && (
                              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {loc.rating}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-[#6C584C] flex items-start gap-1 mt-1 leading-tight line-clamp-1">
                            <MapPin className="w-3 h-3 text-[#9B2226] shrink-0 mt-0.5" />
                            <span>{loc.address}</span>
                          </p>

                          <p className="text-xs text-[#55473D] mt-1.5 line-clamp-2 leading-relaxed">
                            {loc.description}
                          </p>
                        </div>

                        {/* Thẻ trang phục gợi ý */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {loc.recommendedCostumes.slice(0, 3).map((c) => (
                            <span
                              key={c}
                              className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF5EE] text-[#800E13] border border-[#E9DFD2]"
                            >
                              {c}
                            </span>
                          ))}
                          {loc.recommendedCostumes.length > 3 && (
                            <span className="text-[9px] text-[#6C584C] self-center">
                              +{loc.recommendedCostumes.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Mẹo chụp và nút hành động */}
                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-[#9B2226] font-semibold">
                            {loc.priceRange || 'Miễn phí'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openChatWithContext(`Tư vấn cho tôi về địa điểm ${loc.name} (${loc.address}) và cách phối đồ chụp ảnh tại đây.`);
                              }}
                              className="text-[10px] font-semibold text-[#800E13] hover:underline flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Hỏi Nếp AI</span>
                            </button>

                            <a
                              href={loc.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1 bg-[#800E13] hover:bg-[#9B2226] text-white text-[10px] font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <span>Chỉ đường</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Grid Gallery View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-[#E9DFD1] overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-48 w-full bg-stone-900">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#800E13] text-white shadow-xs">
                  {loc.categoryLabel}
                </span>
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded bg-black/70 text-white">
                  {loc.city}
                </span>
                {loc.distance !== null && (
                  <span className="absolute bottom-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-[#9B2226] text-white shadow-sm">
                    Cách {loc.distance} km
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heritage text-base font-bold text-[#1E1713]">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[#6C584C] mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#9B2226] shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </p>
                  <p className="text-xs text-[#55473D] mt-2 leading-relaxed">
                    {loc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setViewMode('split');
                      handleSelectLocation(loc, true);
                    }}
                    className="text-xs font-bold text-[#800E13] hover:underline flex items-center gap-1"
                  >
                    <span>Xem trên bản đồ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={loc.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#800E13] text-white text-xs font-semibold rounded-xl hover:bg-[#9B2226] flex items-center gap-1"
                  >
                    <span>Chỉ đường</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

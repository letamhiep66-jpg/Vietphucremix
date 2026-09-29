import { CulturalCheck, CulturalStatus, TraditionalCostume, ModernGarment, AccessoryItem, ColorItem, UserWardrobeItem } from '../types';

export function evaluateOutfitMix(
  costume: TraditionalCostume,
  modernItem: ModernGarment | UserWardrobeItem | null,
  accessory: AccessoryItem | UserWardrobeItem | null,
  traditionalColor: ColorItem,
  modernColor: ColorItem,
  eventContext?: string
): CulturalCheck {
  // 1. Evaluate Silhouette (Dáng áo)
  let silhouetteStatus: CulturalStatus = 'green';
  let silhouetteNote = 'Phom dáng bảo tồn tốt vẻ trang nghiêm và tôn nghiêm của cổ phục.';
  let silhouetteSuggestion: string | undefined = undefined;

  if (costume.id === 'ao-nhat-binh') {
    if (modernItem && 'category' in modernItem && (modernItem.category === 'jacket')) {
      silhouetteStatus = 'yellow';
      silhouetteNote = 'Áo Nhật Bình đã có bản cổ chữ nhật to bản đặc thù, khoác thêm áo khoác ngoài có thể làm che mất hoa văn Ngũ Hành cổ áo.';
      silhouetteSuggestion = 'Nên mặc Nhật Bình như áo khoác chính ngoài cùng, bên trong lót sơ mi cổ tàu hoặc áo lụa trơn.';
    }
  }

  if (costume.id === 'ao-tac') {
    if (modernItem && 'category' in modernItem && modernItem.category === 'shoes' && modernItem.name.toLowerCase().includes('crocs')) {
      silhouetteStatus = 'red';
      silhouetteNote = 'Áo Tấc là đại lễ phục mang tính trang trọng bậc nhất, phối cùng dép xuồng/crocs phá vỡ hoàn toàn tính tôn nghiêm.';
      silhouetteSuggestion = 'Thay bằng hài thêu truyền thống, giày da âu hoặc chelsea boots da mờ.';
    }
  }

  // 2. Evaluate Accessories (Phụ kiện)
  let accessoryStatus: CulturalStatus = 'green';
  let accessoryNote = 'Phụ kiện điểm xuyết hài hòa giữa truyền thống và phong cách đương đại.';
  let accessorySuggestion: string | undefined = undefined;

  if (accessory) {
    const accName = accessory.name.toLowerCase();
    if (accName.includes('vương miện phương tây') || accName.includes('mũ cao bồi')) {
      accessoryStatus = 'red';
      accessoryNote = 'Phụ kiện lệch chuẩn phong tục cổ truyền, tạo cảm giác phục trang hóa trang (costume cosplay) thiếu nghiêm cẩn.';
      accessorySuggestion = 'Sử dụng khăn đóng ngũ thân, trâm cài bạc hoặc quạt trầm hương.';
    } else if (accName.includes('kính râm') || accName.includes('retro')) {
      accessoryStatus = 'green';
      accessoryNote = 'Kính mắt gọng đồi mồi/retro tạo điểm chạm Đông Dương thập niên 1930 rất hợp thời trang Remix.';
    } else if (accName.includes('túi')) {
      accessoryStatus = 'green';
      accessoryNote = 'Túi gấm hoặc da tối giản vừa tiện dụng vừa tôn chất liệu lụa truyền thống.';
    } else {
      accessoryStatus = 'yellow';
      accessoryNote = 'Phụ kiện hiện đại có thể làm lu mờ nét nền nã cổ truyền nếu quá sặc sỡ.';
      accessorySuggestion = 'Khuyên dùng phụ kiện gam màu mộc hoặc kim loại cổ điển.';
    }
  }

  // 3. Evaluate Color & Occasion (Màu sắc và họa tiết theo dịp)
  let occasionColorStatus: CulturalStatus = 'green';
  let occasionColorNote = `Sự kết hợp giữa sắc ${traditionalColor.name} (${traditionalColor.meaning}) và ${modernColor.name} đạt độ tao nhã.`;
  let occasionColorSuggestion: string | undefined = undefined;

  const eventLower = (eventContext || '').toLowerCase();

  // Royal yellow warning for solemn court reproduction
  if (traditionalColor.name.toLowerCase().includes('vàng chính sắc') || traditionalColor.hex.toLowerCase() === '#f4a261') {
    if (eventLower.includes('đám cưới') && !eventLower.includes('chủ rể') && !eventLower.includes('cô dâu')) {
      occasionColorStatus = 'yellow';
      occasionColorNote = 'Màu vàng hoàng yến/chính sắc rất rực rỡ, khách dự tiệc cưới nên khéo léo tiết chế để không lấn át nhân vật chính.';
      occasionColorSuggestion = 'Có thể chọn sắc xanh chàm, đỏ son thẫm hoặc tím hoa cà.';
    }
  }

  // Pure white warning for festive events
  if (traditionalColor.name.toLowerCase().includes('trắng toát') && eventLower.includes('tết')) {
    occasionColorStatus = 'yellow';
    occasionColorNote = 'Dịp Tết Nguyên Đán người Việt chuộng màu tươi sáng ấm áp (Đỏ điều, Vàng hoa mai, Xanh ngọc) hơn màu đơn sắc lạnh.';
    occasionColorSuggestion = 'Chuyển sang sắc đỏ son hoặc xanh chàm tươi.';
  } else if (traditionalColor.hex === '#1C1917' && modernColor.hex === '#212529' && eventLower.includes('cưới')) {
    occasionColorStatus = 'red';
    occasionColorNote = 'Phối toàn bộ trang phục màu đen u ám trong lễ cưới hỏi truyền thống là điều kiêng kỵ.';
    occasionColorSuggestion = 'Chuyển sang sắc Đỏ điều, Vàng hoàng yến hoặc Tím hoa cà tươi tắn.';
  }

  // Overall score & status
  let score = 95;
  if (silhouetteStatus === 'red' || accessoryStatus === 'red' || occasionColorStatus === 'red') {
    score -= 30;
  }
  if (silhouetteStatus === 'yellow') score -= 12;
  if (accessoryStatus === 'yellow') score -= 10;
  if (occasionColorStatus === 'yellow') score -= 8;

  let overallStatus: 'green' | 'yellow' | 'red' = 'green';
  if (score < 65 || silhouetteStatus === 'red' || accessoryStatus === 'red') {
    overallStatus = 'red';
  } else if (score < 85 || silhouetteStatus === 'yellow' || occasionColorStatus === 'yellow') {
    overallStatus = 'yellow';
  }

  let summary = 'Bộ trang phục đạt chuẩn mực văn hóa cao, kết hợp sáng tạo mà vẫn giữ trọn nếp xưa.';
  if (overallStatus === 'yellow') {
    summary = 'Bộ phối có điểm sáng tạo hiện đại, cần tinh chỉnh một vài phụ kiện hoặc phom dáng để thêm chuẩn chỉ.';
  } else if (overallStatus === 'red') {
    summary = 'Có chi tiết chưa phù hợp với quy tắc cổ phục truyền thống, khuyến nghị sử dụng nút "Giúp đỡ chỉnh sửa".';
  }

  return {
    overallStatus,
    score,
    silhouette: {
      status: silhouetteStatus,
      title: 'Phom Dáng & Cấu Trúc Áo',
      note: silhouetteNote,
      suggestion: silhouetteSuggestion
    },
    accessories: {
      status: accessoryStatus,
      title: 'Phụ Kiện Đi Kèm',
      note: accessoryNote,
      suggestion: accessorySuggestion
    },
    occasionColor: {
      status: occasionColorStatus,
      title: 'Sắc Màu & Phép Ứng Đối Theo Dịp',
      note: occasionColorNote,
      suggestion: occasionColorSuggestion
    },
    summary
  };
}

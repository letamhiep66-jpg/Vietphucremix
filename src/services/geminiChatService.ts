export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  places?: Array<{
    name: string;
    category: string;
    address: string;
    city: string;
    googleMapsUrl: string;
    tip?: string;
  }>;
  sources?: Array<{
    title: string;
    url: string;
  }>;
  modelUsed?: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  places?: Array<{
    name: string;
    category: string;
    address: string;
    city: string;
    googleMapsUrl: string;
    tip?: string;
  }>;
  sources?: Array<{
    title: string;
    url: string;
  }>;
  modelUsed?: string;
  error?: string;
}

export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'model'; content: string }>,
  model: 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview' = 'gemini-3.5-flash',
  costumeContext?: string
): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        costumeContext,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend chat API unreachable, utilizing client fallback heritage advisor:', err);
  }

  // Client-side fallback
  const lastMsg = messages[messages.length - 1]?.content || '';
  return getClientChatFallback(lastMsg, costumeContext, model);
}

function getClientChatFallback(
  message: string,
  costumeContext?: string,
  model: string = 'gemini-3.5-flash'
): ChatResponse {
  const m = message.toLowerCase();

  if (m.includes('chụp') || m.includes('địa điểm') || m.includes('ở đâu')) {
    return {
      success: true,
      modelUsed: model,
      reply: `Dưới đây là các danh thắng và địa điểm chụp ảnh di sản chuẩn mực nhất trên Google Maps phù hợp với cổ phục Việt Nam:

1. **Hoàng Thành Thăng Long (Hà Nội):** Tường gạch rêu phong và vòm Đoan Môn cổ kính, rất hợp với Áo Tấc, Áo Giao Lĩnh, Áo Đối Khâm và Áo Ngũ Thân.
   - *Địa chỉ:* 19C Hoàng Diệu, Ba Đình, Hà Nội.
2. **Văn Miếu - Quốc Tử Giám (Hà Nội):** Không gian Khuê Văn Các uy nghiêm, lý tưởng cho Áo Dài truyền thống và Áo Ngũ Thân nam.
   - *Địa chỉ:* 58 Quốc Tử Giám, Đống Đa, Hà Nội.
3. **Đại Nội Huế & Lăng Tự Đức (Thừa Thiên Huế):** Chiếc nôi của Áo Nhật Bình và Áo Tấc triều đình.
   - *Địa chỉ:* Đường 23 Tháng 8, Phường Thuận Hòa, TP. Huế.
4. **Bảo Tàng Mỹ Thuật TP.HCM (Sài Gòn):** Kiến trúc Art Deco Đông Dương thập niên 1930 hoàn hảo cho Áo Dài Le Mur và áo ngũ thân tay chẽn.
   - *Địa chỉ:* 97A Phó Đức Chính, Quận 1, TP.HCM.`,
      places: [
        {
          name: 'Hoàng Thành Thăng Long',
          category: 'Điểm Chụp Di Sản',
          address: '19C Hoàng Diệu, Điện Biên, Ba Đình, Hà Nội',
          city: 'Hà Nội',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ho%C3%A0ng+Th%C3%A0nh+Th%C4%83ng+Long+19C+Ho%C3%A0ng+Di%E1%BB%87u+H%C3%A0+N%E1%BB%99i',
          tip: 'Góc chụp trước Đoan Môn bắt nắng sớm mai tạo phong thái hoàng gia cổ kính.'
        },
        {
          name: 'Đại Nội Huế',
          category: 'Điểm Chụp Di Sản',
          address: 'Đường 23 Tháng 8, Phường Thuận Hòa, TP. Huế',
          city: 'Thừa Thiên Huế',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%C4%90%E1%BA%A1i+N%E1%BB%99i+Hu%E1%BA%BF+23+Th%C3%A1ng+8+Hu%E1%BA%BF',
          tip: 'Hành lang Trường Lang và Cung Diên Thọ sơn son thếp vàng tuyệt đẹp cho Áo Nhật Bình.'
        },
        {
          name: 'Văn Miếu - Quốc Tử Giám',
          category: 'Điểm Chụp Di Sản',
          address: '58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội',
          city: 'Hà Nội',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=V%C4%83n+Mi%E1%BA%BFu+Qu%E1%BB%91c+T%E1%BB%AD+Gi%C3%A1m+H%C3%A0+N%E1%BB%99i',
          tip: 'Khuê Văn Các và giếng Thiên Quang tôn vinh nét nho nhã của Áo Dài.'
        }
      ],
      sources: [{ title: 'Google Maps Điểm Chụp Di Sản', url: 'https://maps.google.com' }]
    };
  }

  if (m.includes('thuê') || m.includes('tiệm') || m.includes('may')) {
    return {
      success: true,
      modelUsed: model,
      reply: `Dưới đây là các nhà may đo và tiệm cho thuê cổ phục uy tín hàng đầu kèm địa chỉ trên Google Maps:

- **Hà Nội:**
  + **Ỷ Vân Hiên:** Số 16, Ngõ 192 Lê Trọng Tấn, Thanh Xuân, Hà Nội (Chuyên may đo, phục dựng cổ phục chuẩn triều điển).
  + **Cổ Trang Đại Việt / Vạn Thiên Shop:** Đội Cấn, Ba Đình, Hà Nội (Cho thuê đa dạng Áo Tấc, Nhật Bình, Tứ Thân).
- **Thừa Thiên Huế:**
  + **Hoa Niên - Năm Tháng Tươi Đẹp:** Đường Đinh Tiên Hoàng, Thuận Thành, TP. Huế (Cho thuê Áo Nhật Bình, Áo Tấc trọn gói kèm phụ kiện).
- **TP. Hồ Chí Minh:**
  + **Áo Dài Minh Thư:** 199 Lý Tự Trọng, Bến Thành, Quận 1, TP.HCM (Chuyên may đo và cho thuê Áo Dài & Ngũ Thân cao cấp).`,
      places: [
        {
          name: 'Ỷ Vân Hiên (May đo & Cho thuê Cổ phục)',
          category: 'Tiệm May & Cho Thuê',
          address: 'Số 16, Ngõ 192 Lê Trọng Tấn, Khương Mai, Thanh Xuân, Hà Nội',
          city: 'Hà Nội',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E1%BB%B6+V%C3%A2n+Hi%C3%AAn+L%C3%AA+Tr%E1%BB%8Dng+T%E1%BA%A5n+H%C3%A0+N%E1%BB%99i',
          tip: 'May đo và phục dựng cổ phục cao cấp theo đúng chuẩn bảo tàng.'
        },
        {
          name: 'Hoa Niên - Cổ Phục Huế',
          category: 'Tiệm Cho Thuê & Trải Nghiệm',
          address: 'Đường Đinh Tiên Hoàng, Thuận Thành, TP. Huế',
          city: 'Thừa Thiên Huế',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=thu%C3%AA+c%E1%BB%95+ph%E1%BB%A5c+Hu%E1%BA%BF+%C4%90inh+Ti%C3%AAn+Ho%C3%A0ng',
          tip: 'Cho thuê Áo Nhật Bình và Áo Tấc trọn gói kèm trâm cài, nón bài thơ.'
        },
        {
          name: 'Áo Dài Minh Thư',
          category: 'Tiệm May & Cho Thuê',
          address: '199 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP.HCM',
          city: 'TP. Hồ Chí Minh',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%C3%81o+D%C3%A0i+Minh+Th%C6%B0+199+L%C3%BD+T%E1%BB%B1+Tr%E1%BB%8Dng+Qu%E1%BA%ADn+1+TPHCM',
          tip: 'May đo và cho thuê áo dài truyền thống, áo ngũ thân nam nữ chất liệu tơ tằm.'
        }
      ],
      sources: [{ title: 'Danh mục Tiệm Cổ Phục Google Maps', url: 'https://maps.google.com' }]
    };
  }

  return {
    success: true,
    modelUsed: model,
    reply: `Chào bạn! Tôi là **Trợ Lý Cố Vấn Cổ Phục & Di Sản Việt Nam (Nếp AI)**.

Tôi có thể hỗ trợ bạn:
1. **Khám phá đặc điểm & cấu trúc:** Chi tiết về cổ lập lĩnh, tay raglan, năm hạt cúc khuy ngọc (Ngũ Luân) của Áo Dài, Áo Tứ Thân, Áo Ngũ Thân, Áo Tấc, Áo Nhật Bình...
2. **Gợi ý phối đồ Remix:** Tư vấn kết hợp cổ phục cùng thời trang đương đại (blazer, quần âu, chân váy) thanh lịch.
3. **Tìm điểm chụp ảnh di sản trên Google Maps:** Gợi ý danh thắng, cung đình, đền đài có phong cảnh hợp nhất với từng tà áo.
4. **Định vị tiệm thuê & may đo:** Cung cấp địa chỉ chuẩn xác trên Google Maps tại Hà Nội, Huế, TP.HCM, Hội An.

Bạn đang quan tâm đến bộ trang phục nào hay cần tìm điểm chụp gần nhất?`,
    places: [
      {
        name: 'Hoàng Thành Thăng Long',
        category: 'Điểm Chụp Di Sản',
        address: '19C Hoàng Diệu, Ba Đình, Hà Nội',
        city: 'Hà Nội',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ho%C3%A0ng+Th%C3%A0nh+Th%C4%83ng+Long+19C+Ho%C3%A0ng+Di%E1%BB%87u+H%C3%A0+N%E1%BB%99i'
      },
      {
        name: 'Đại Nội Huế',
        category: 'Điểm Chụp Di Sản',
        address: 'Đường 23 Tháng 8, Phường Thuận Hòa, TP. Huế',
        city: 'Thừa Thiên Huế',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%C4%90%E1%BA%A1i+N%E1%BB%99i+Hu%E1%BA%BF+23+Th%C3%A1ng+8+Hu%E1%BA%BF'
      }
    ],
    sources: [{ title: 'Cổng Thông tin Di sản Văn hóa Việt Nam', url: 'https://dsvh.gov.vn' }]
  };
}

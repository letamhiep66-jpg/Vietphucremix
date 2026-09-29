export interface HeritageLocation {
  id: string;
  name: string;
  category: 'photo_spot' | 'rental_shop' | 'tailor_shop';
  categoryLabel: string;
  city: 'Hà Nội' | 'Thừa Thiên Huế' | 'Đà Nẵng / Hội An' | 'TP. Hồ Chí Minh' | 'Bắc Ninh' | 'Ninh Bình';
  address: string;
  mapQuery: string;
  googleMapsUrl: string;
  lat: number;
  lng: number;
  recommendedCostumes: string[]; // e.g. ['Áo Tấc', 'Áo Nhật Bình', 'Áo Dài']
  description: string;
  photoTip?: string;
  rating?: number;
  priceRange?: string;
  contact?: string;
  image: string;
}

export const CITY_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Toàn quốc': { lat: 16.0544, lng: 107.5000, zoom: 6 },
  'Hà Nội': { lat: 21.0285, lng: 105.8542, zoom: 12 },
  'Thừa Thiên Huế': { lat: 16.4637, lng: 107.5909, zoom: 13 },
  'Đà Nẵng / Hội An': { lat: 15.8801, lng: 108.3273, zoom: 13 },
  'TP. Hồ Chí Minh': { lat: 10.7769, lng: 106.7009, zoom: 12 },
  'Ninh Bình': { lat: 20.2506, lng: 105.9745, zoom: 12 },
  'Bắc Ninh': { lat: 21.1861, lng: 106.0763, zoom: 12 },
};

export const HERITAGE_LOCATIONS: HeritageLocation[] = [
  // --- HÀ NỘI ---
  {
    id: 'loc-hn-hoang-thanh',
    name: 'Hoàng Thành Thăng Long',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Hà Nội',
    address: '19C Hoàng Diệu, Điện Biên, Ba Đình, Hà Nội',
    mapQuery: 'Hoàng Thành Thăng Long, 19C Hoàng Diệu, Ba Đình, Hà Nội',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ho%C3%A0ng+Th%C3%A0nh+Th%C4%83ng+Long+19C+Ho%C3%A0ng+Di%E1%BB%87u+H%C3%A0+N%E1%BB%99i',
    lat: 21.0345,
    lng: 105.8398,
    recommendedCostumes: ['Áo Tấc', 'Áo Giao Lĩnh', 'Áo Đối Khâm', 'Áo Ngũ Thân', 'Áo Viên Lĩnh'],
    description: 'Di sản Văn hóa Thế giới với Đoan Môn, Kỳ Đài và các hành lang gạch cổ rêu phong, hoàn hảo cho cổ phục triều Lý, Trần, Lê.',
    photoTip: 'Chụp vào buổi sáng từ 8h00 - 10h00 hoặc nắng chiều 15h30 - 17h00 tại vòm Đoan Môn để bắt góc ánh sáng xuyên cổ kính.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hn-van-mieu',
    name: 'Văn Miếu - Quốc Tử Giám',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Hà Nội',
    address: '58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội',
    mapQuery: 'Văn Miếu Quốc Tử Giám, Đống Đa, Hà Nội',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=V%C4%83n+Mi%E1%BA%BFu+Qu%E1%BB%91c+T%E1%BB%AD+Gi%C3%A1m+H%C3%A0+N%E1%BB%99i',
    lat: 21.0276,
    lng: 105.8355,
    recommendedCostumes: ['Áo Dài Truyền Thống Nữ', 'Áo Dài Ngũ Thân Nam', 'Áo Tấc'],
    description: 'Trường đại học đầu tiên của Việt Nam với Khuê Văn Các, giếng Thiên Quang và hàng bia tiến sĩ uy nghiêm, tôn vinh tinh thần hiếu học.',
    photoTip: 'Góc chụp trước Khuê Văn Các và dãy hành lang gỗ lim cổ kính tôn lên cốt cách nho nhã của Áo Dài và Áo Ngũ Thân nam.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hn-duong-lam',
    name: 'Làng Cổ Đường Lâm',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Hà Nội',
    address: 'Xã Đường Lâm, Thị xã Sơn Tây, Hà Nội',
    mapQuery: 'Làng cổ Đường Lâm, Sơn Tây, Hà Nội',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=L%C3%A0ng+c%E1%BB%95+%C4%90%C6%B0%E1%BB%9Dng+L%C3%A2m+S%C6%A1n+T%C3%A2y+H%C3%A0+N%E1%BB%99i',
    lat: 21.1448,
    lng: 105.4746,
    recommendedCostumes: ['Áo Tứ Thân', 'Áo Yếm Cổ Truyền', 'Áo Ngũ Thân Tay Chẽn'],
    description: 'Ngôi làng đá ong cổ kính tiêu biểu của châu thổ sông Hồng với cổng làng Mông Phụ, cây đa, giếng nước, sân đình.',
    photoTip: 'Tường đá ong màu vàng nâu mộc mạc làm nổi bật chiếc áo tứ thân buộc vạt và yếm đào rực rỡ.',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hn-ho-guom',
    name: 'Hồ Hoàn Kiếm & Đền Ngọc Sơn',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Hà Nội',
    address: 'Đinh Tiên Hoàng, Hàng Trống, Hoàn Kiếm, Hà Nội',
    mapQuery: 'Hồ Hoàn Kiếm, Đền Ngọc Sơn, Hà Nội',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=H%E1%BB%93+Ho%C3%A0n+Ki%E1%BA%BFm+%C4%90%E1%BB%81n+Ng%E1%BB%8Dc+S%C6%A1n+H%C3%A0+N%E1%BB%99i',
    lat: 21.0307,
    lng: 105.8523,
    recommendedCostumes: ['Áo Dài Truyền Thống Nữ', 'Áo Dài Ngũ Thân Nam', 'Áo Tấc'],
    description: 'Trái tim của Thủ đô ngàn năm văn hiến với Cầu Thê Húc son đỏ, Tháp Bút, Đài Nghiên và hàng liễu rủ thơ mộng.',
    photoTip: 'Chụp tại nhịp Cầu Thê Húc buổi sớm mai 6h30 - 8h00 khi sương sớm còn vương trên mặt hồ tĩnh lặng.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hn-y-van-hien',
    name: 'Ỷ Vân Hiên (Phục dựng & May đo Cổ phục)',
    category: 'tailor_shop',
    categoryLabel: 'Tiệm May & Phục Dựng',
    city: 'Hà Nội',
    address: 'Số 16, Ngõ 192 Lê Trọng Tấn, Thanh Xuân, Hà Nội',
    mapQuery: 'Ỷ Vân Hiên Cổ Phục, Hà Nội',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%E1%BB%B6+V%C3%A2n+Hi%C3%AAn+L%C3%AA+Tr%E1%BB%8Dng+T%E1%BA%A5n+H%C3%A0+N%E1%BB%99i',
    lat: 20.9928,
    lng: 105.8285,
    recommendedCostumes: ['Áo Tấc', 'Áo Nhật Bình', 'Áo Giao Lĩnh', 'Áo Ngũ Thân'],
    description: 'Thương hiệu phục dựng cổ phục Việt tiên phong, chuyên nghiên cứu điển chế triều đình, dệt gấm thêu tay chuẩn quy thức bảo tàng.',
    priceRange: 'May đo: 3.500.000đ - 18.000.000đ | Thuê: 500.000đ - 1.500.000đ',
    contact: '096 828 29 19',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hn-dai-viet-co-phong',
    name: 'Cổ Trang Đại Việt / Vạn Thiên Shop (Cho thuê & Chụp ảnh)',
    category: 'rental_shop',
    categoryLabel: 'Tiệm Cho Thuê',
    city: 'Hà Nội',
    address: 'Phố Đội Cấn, Ba Đình, Hà Nội (gần Hoàng Thành)',
    mapQuery: 'Thuê cổ phục Việt Nam Đội Cấn Ba Đình Hà Nội',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=thu%C3%AA+c%E1%BB%95+ph%E1%BB%A5c+vi%E1%BB%87t+nam+H%C3%A0+N%E1%BB%99i',
    lat: 21.0360,
    lng: 105.8200,
    recommendedCostumes: ['Áo Tấc', 'Áo Nhật Bình', 'Áo Tứ Thân', 'Áo Đối Khâm'],
    description: 'Kho trang phục cổ trang Việt phong phú, hỗ trợ phụ kiện quạt trầm, trâm cài, nón quai thao, nón bài thơ.',
    priceRange: 'Thuê từ 250.000đ - 800.000đ / ngày',
    contact: 'Hỗ trợ trang điểm cổ điển',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  },

  // --- THỪA THIÊN HUẾ ---
  {
    id: 'loc-hue-dai-noi',
    name: 'Đại Nội Huế & Tử Cấm Thành',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Thừa Thiên Huế',
    address: 'Đường 23 Tháng 8, Phường Thuận Hòa, TP. Huế',
    mapQuery: 'Đại Nội Huế, 23 Tháng 8, TP Huế',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%C4%90%E1%BA%A1i+N%E1%BB%99i+Hu%E1%BA%BF+23+Th%C3%A1ng+8+Hu%E1%BA%BF',
    lat: 16.4699,
    lng: 107.5786,
    recommendedCostumes: ['Áo Nhật Bình', 'Áo Tấc', 'Áo Ngũ Thân Tay Chẽn', 'Áo Dài Truyền Thống Nữ'],
    description: 'Hoàng cung triều Nguyễn với Ngọ Môn, Điện Thái Hòa, Cung Diên Thọ; là cái nôi ra đời của Áo Tấc và Áo Nhật Bình cung đình.',
    photoTip: 'Hành lang sơn son thếp vàng Cung Diên Thọ và Trường Lang là bối cảnh đỉnh cao để chụp Áo Nhật Bình và Áo Tấc.',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hue-lang-tu-duc',
    name: 'Lăng Tự Đức (Khiêm Lăng)',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Thừa Thiên Huế',
    address: 'Thôn Thượng Ba, Phường Thủy Xuân, TP. Huế',
    mapQuery: 'Lăng Tự Đức, Thủy Xuân, TP Huế',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=L%C4%83ng+T%E1%BB%B1+%C4%90%E1%BB%A9c+Th%E1%BB%A7y+Xu%C3%A2n+Hu%E1%BA%BF',
    lat: 16.4328,
    lng: 107.5658,
    recommendedCostumes: ['Áo Tấc', 'Áo Ngũ Thân Nam', 'Áo Dài Truyền Thống Nữ'],
    description: 'Quần thể lăng tẩm thơ mộng nhất cố đô với hồ Lưu Khiêm, nhà tạ Xung Khiêm rợp bóng thông xanh tĩnh mịch.',
    photoTip: 'Cây cầu nhỏ bắc qua hồ súng và nhà tạ Xung Khiêm mang vẻ trầm mặc cổ kính tuyệt mỹ.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hue-lang-khai-dinh',
    name: 'Lăng Khải Định (Ứng Lăng)',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Thừa Thiên Huế',
    address: 'Xã Thủy Bằng, TP. Huế, Thừa Thiên Huế',
    mapQuery: 'Lăng Khải Định, Thủy Bằng, TP Huế',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=L%C4%83ng+Kh%E1%BA%A3i+%C4%90%E1%BB%8Bnh+Hu%E1%BA%BF',
    lat: 16.3986,
    lng: 107.5905,
    recommendedCostumes: ['Áo Ngũ Thân Nam', 'Áo Dài Le Mur', 'Áo Tấc'],
    description: 'Kiệt tác nghệ thuật ghép sành sứ đỉnh cao giao thoa kiến trúc Đông - Tây thế kỷ XX, cực kỳ ăn khớp với trang phục thời kỳ chuyển giao.',
    photoTip: 'Sân Bái Đình với hai hàng tượng quan quân văn võ bằng đá sa thạch uy nghiêm tạo nên khung hình điện ảnh.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hue-hoa-nien',
    name: 'Hoa Niên - Năm Tháng Tươi Đẹp (Cổ phục & Thuê đồ Huế)',
    category: 'rental_shop',
    categoryLabel: 'Tiệm Cho Thuê & Trải Nghiệm',
    city: 'Thừa Thiên Huế',
    address: 'Đường Đinh Tiên Hoàng, Thuận Thành, TP. Huế',
    mapQuery: 'Cổ phục Huế Đinh Tiên Hoàng TP Huế',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=thu%C3%AA+c%E1%BB%95+ph%E1%BB%A5c+Hu%E1%BA%BF+%C4%90inh+Ti%C3%AAn+Ho%C3%A0ng',
    lat: 16.4748,
    lng: 107.5815,
    recommendedCostumes: ['Áo Nhật Bình', 'Áo Tấc', 'Áo Ngũ Thân'],
    description: 'Địa chỉ uy tín số một tại Cố đô để thuê Áo Nhật Bình ngũ sắc và Áo Tấc đúng chuẩn điển lễ hoàng triều.',
    priceRange: 'Thuê trọn gói: 300.000đ - 700.000đ / bộ (kèm trâm, hài, quạt)',
    contact: '090 512 34 56',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
  },

  // --- HỘI AN / ĐÀ NẴNG ---
  {
    id: 'loc-ha-pho-co',
    name: 'Phố Cổ Hội An & Chùa Cầu',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Đà Nẵng / Hội An',
    address: 'Đường Trần Phú / Nguyễn Thái Học, Phường Minh An, Hội An',
    mapQuery: 'Phố cổ Hội An, Quảng Nam',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%91+c%E1%BB%95+H%E1%BB%99i+An',
    lat: 15.8778,
    lng: 108.3262,
    recommendedCostumes: ['Áo Dài Truyền Thống Nữ', 'Áo Đối Khâm', 'Áo Bà Ba', 'Áo Dài Le Mur'],
    description: 'Thương cảng cổ thế kỷ XVII với những bức tường vàng rực, giàn hoa giấy, đèn lồng và mái ngói âm dương rêu phong.',
    photoTip: 'Buổi sáng sớm trước 7h30 vắng khách du lịch hoặc buổi tối khi phố lên đèn lồng lung linh huyền ảo.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-dn-ban-dao-son-tra',
    name: 'Chùa Linh Ứng & Bán Đảo Sơn Trà',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Đà Nẵng / Hội An',
    address: 'Bán đảo Sơn Trà, Phường Thọ Quang, Sơn Trà, Đà Nẵng',
    mapQuery: 'Chùa Linh Ứng Bán đảo Sơn Trà Đà Nẵng',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ch%C3%B9a+Linh+%E1%BB%A8ng+S%C6%A1n+Tr%C3%A0+%C4%90%C3%A0+N%E1%BA%B5ng',
    lat: 16.1018,
    lng: 108.2778,
    recommendedCostumes: ['Áo Dài Truyền Thống Nữ', 'Áo Tấc', 'Áo Ngũ Thân Nam'],
    description: 'Ngôi chùa hướng biển Đông hùng vĩ với tượng Bồ Tát Quán Thế Âm cao 67m, vườn tháp đá thanh tịnh giữa mây trời.',
    photoTip: 'Thời điểm hoàng hôn nhìn về thành phố Đà Nẵng lung linh ánh đèn sau lưng tà áo bay thanh thoát.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-ha-hoi-an-heritage-costume',
    name: 'Hội An Heritage Costume Studio (Cho thuê & May đo)',
    category: 'rental_shop',
    categoryLabel: 'Tiệm Cho Thuê & Chụp Ảnh',
    city: 'Đà Nẵng / Hội An',
    address: 'Đường Nguyễn Thị Minh Khai, Phường Minh An, TP. Hội An',
    mapQuery: 'Thuê cổ phục Hội An Nguyễn Thị Minh Khai',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=thu%C3%AA+c%E1%BB%95+ph%E1%BB%A5c+H%E1%BB%99i+An',
    lat: 15.8765,
    lng: 108.3280,
    recommendedCostumes: ['Áo Dài Truyền Thống Nữ', 'Áo Đối Khâm', 'Áo Giao Lĩnh'],
    description: 'Cho thuê Áo Dài tơ tằm Hội An, nón lá chằm hoa văn và phụ kiện chụp ảnh hoài niệm phố hội.',
    priceRange: 'Thuê từ 200.000đ - 600.000đ / ngày',
    contact: '093 543 21 00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },

  // --- TP. HỒ CHÍ MINH ---
  {
    id: 'loc-hcm-bao-tang-my-thuat',
    name: 'Bảo Tàng Mỹ Thuật TP. Hồ Chí Minh',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'TP. Hồ Chí Minh',
    address: '97A Phó Đức Chính, Phường Nguyễn Thái Bình, Quận 1, TP.HCM',
    mapQuery: 'Bảo tàng Mỹ thuật TP. Hồ Chí Minh, 97A Phó Đức Chính, Quận 1',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=B%E1%BA%A3o+t%C3%A0ng+M%E1%BB%B9+thu%E1%BA%ADt+97A+Ph%C3%B3+%C4%90%E1%BB%A9c+Ch%C3%ADnh+Qu%E1%BA%ADn+1+TPHCM',
    lat: 10.7700,
    lng: 106.6997,
    recommendedCostumes: ['Áo Dài Le Mur', 'Áo Dài Truyền Thống Nữ', 'Áo Ngũ Thân Tay Chẽn', 'Áo Đối Khâm'],
    description: 'Dinh thự mang kiến trúc Art Deco kết hợp hoa văn Đông Dương xưa của Hứa Bổn Hòa, không gian hoài cổ sang trọng.',
    photoTip: 'Cầu thang xoắn ốc cổ kính và các vòm cửa kính màu stained-glass mang lại cảm giác Sài Gòn thập niên 1930 hoàn hảo.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hcm-chua-ba-thien-hau',
    name: 'Chùa Bà Thiên Hậu (Chợ Lớn)',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'TP. Hồ Chí Minh',
    address: '710 Nguyễn Trãi, Phường 11, Quận 5, TP.HCM',
    mapQuery: 'Chùa Bà Thiên Hậu, 710 Nguyễn Trãi, Quận 5, TPHCM',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ch%C3%B9a+B%C3%A0+Thi%C3%AAn+H%E1%BA%ADu+710+Nguy%E1%BB%85n+Tr%C3%A3i+Qu%E1%BA%ADn+5+TPHCM',
    lat: 10.7538,
    lng: 106.6606,
    recommendedCostumes: ['Áo Dài Ngũ Thân Nam', 'Áo Dài Truyền Thống Nữ', 'Áo Đối Khâm'],
    description: 'Ngôi chùa cổ kính hơn 250 năm với mái phù điêu gốm tinh xảo, nhang vòng treo tầng tầng lớp lớp và ánh sáng khói trầm bảng lảng.',
    photoTip: 'Chụp tại sân thiên tỉnh (giếng trời) dưới những vòng nhang hương buông thả trầm mặc.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hcm-ao-dai-minh-thu',
    name: 'Nhà May Áo Dài Minh Thư & Cổ Phục Sài Gòn',
    category: 'tailor_shop',
    categoryLabel: 'Nhà May Truyền Thống',
    city: 'TP. Hồ Chí Minh',
    address: '199 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP.HCM',
    mapQuery: 'Áo Dài Minh Thư Lý Tự Trọng Quận 1 TPHCM',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=%C3%81o+D%C3%A0i+Minh+Th%C6%B0+199+L%C3%BD+T%E1%BB%B1+Tr%E1%BB%8Dng+Qu%E1%BA%ADn+1+TPHCM',
    lat: 10.7719,
    lng: 106.6946,
    recommendedCostumes: ['Áo Dài Truyền Thống Nữ', 'Áo Dài Ngũ Thân Nam', 'Áo Tấc'],
    description: 'Nhà may uy tín với hơn 30 năm kinh nghiệm may đo Áo Dài tơ tằm lụa Hà Đông và phục dựng áo ngũ thân cho kiều bào, đại sứ.',
    priceRange: 'May đo: 1.800.000đ - 6.500.000đ / bộ',
    contact: '090 333 44 55',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'loc-hcm-thue-co-phuc-sai-gon',
    name: 'Cổ Trang Việt Sài Gòn (Tiệm thuê & Studio)',
    category: 'rental_shop',
    categoryLabel: 'Tiệm Cho Thuê & Chụp Ảnh',
    city: 'TP. Hồ Chí Minh',
    address: 'Đường Hoàng Sa, Phường Đa Kao, Quận 1, TP.HCM',
    mapQuery: 'Thuê cổ phục Việt Nam Quận 1 TPHCM',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=thu%C3%AA+c%E1%BB%95+ph%E1%BB%A5c+vi%E1%BB%87t+nam+Qu%E1%BA%ADn+1+TPHCM',
    lat: 10.7915,
    lng: 106.6934,
    recommendedCostumes: ['Áo Nhật Bình', 'Áo Tấc', 'Áo Bà Ba', 'Áo Giao Lĩnh'],
    description: 'Chuyên cho thuê cổ phục đóng gói đầy đủ phụ kiện vòng ngọc, trâm cài, quạt lụa và gói makeup chụp ảnh theo concept.',
    priceRange: 'Thuê từ 300.000đ - 850.000đ / ngày',
    contact: 'Hỗ trợ giao nhận nội thành',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },

  // --- NINH BÌNH ---
  {
    id: 'loc-nb-trang-an',
    name: 'Quần Thể Danh Thắng Tràng An & Cố Đô Hoa Lư',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Ninh Bình',
    address: 'Xã Tràng An & Xã Trường Yên, Huyện Hoa Lư, Ninh Bình',
    mapQuery: 'Quần thể danh thắng Tràng An, Ninh Bình',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tr%C3%A0ng+An+Hoa+L%C6%B0+Ninh+B%C3%ACnh',
    lat: 20.2520,
    lng: 105.9080,
    recommendedCostumes: ['Áo Tấc', 'Áo Giao Lĩnh', 'Áo Đối Khâm', 'Áo Tứ Thân'],
    description: 'Di sản Hỗn hợp Văn hóa và Thiên nhiên Thế giới duy nhất tại Đông Nam Á với non nước hữu tình, đền chùa hang động trầm mặc thời Đinh - Tiền Lê.',
    photoTip: 'Ngồi trên thuyền gỗ xuôi dòng Sào Khê hoặc trước cổng Hành Cung Vũ Lâm với tà áo lụa bay phiêu dật giữa vách núi đá vôi.',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
  },

  // --- BẮC NINH ---
  {
    id: 'loc-bn-chua-but-thap',
    name: 'Chùa Bút Tháp (Ninh Phúc Tự)',
    category: 'photo_spot',
    categoryLabel: 'Điểm Chụp Di Sản',
    city: 'Bắc Ninh',
    address: 'Thôn Bút Tháp, Xã Đình Tổ, Thị xã Thuận Thành, Bắc Ninh',
    mapQuery: 'Chùa Bút Tháp, Thuận Thành, Bắc Ninh',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ch%C3%B9a+B%C3%BAt+Th%C3%A1p+B%E1%BA%AFc+Ninh',
    lat: 21.0592,
    lng: 106.0227,
    recommendedCostumes: ['Áo Tứ Thân', 'Áo Giao Lĩnh', 'Áo Ngũ Thân'],
    description: 'Ngôi chùa cổ thế kỷ XVII lưu giữ pho tượng Phật Bà Quan Âm nghìn mắt nghìn tay bằng gỗ kiệt tác và Tháp Báo Nghiêm bằng đá uy nghi.',
    photoTip: 'Hành lang gỗ lim ngả màu thời gian và cây Tháp Báo Nghiêm bát giác là khung hình kinh điển cho cổ phục thời Lê Trung Hưng.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
  }
];

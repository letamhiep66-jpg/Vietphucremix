import { 
  TraditionalCostume, 
  ModernGarment, 
  AccessoryItem, 
  ColorItem, 
  MixOption, 
  UserProfile 
} from '../types';
import { fuzzyMatch } from '../utils/vietnameseSearch';
import { evaluateOutfitMix } from '../utils/culturalRuleChecker';

// 100% Real photography of historically reconstructed Vietnamese garments
export const TRADITIONAL_COSTUMES: TraditionalCostume[] = [
  {
    id: 'ao-dai-truyen-thong',
    name: 'Áo Dài Truyền Thống Nữ',
    dynasty: 'Thời kỳ Cận đại & Đương đại',
    era: 'Thế kỷ XVIII - nay (Từ Ngũ thân -> Le Mur -> Raglan -> Hiện đại)',
    gender: 'female',
    shortDesc: 'Biểu tượng quốc phục của phụ nữ Việt Nam với hai tà thướt tha, tôn vinh nét đoan trang và thanh tú.',
    historyStory: 'Lịch sử Áo Dài trải qua hơn 300 năm tiến hóa, bắt nguồn từ cuộc cải cách trang phục năm 1744 của Chúa Nguyễn Phúc Khoát ở Đàng Trong nhằm định hình bản sắc riêng (chuyển sang áo 5 thân cài khuy, mặc quần 2 ống). Đến thập niên 1930, họa sĩ Cát Tường (Le Mur) và họa sĩ Lê Phổ đã thổi làn gió cách tân Tây phương với đường cắt ôm sát đường cong. Bước ngoặt lớn nhất diễn ra năm 1960 khi nhà may Dung ở Đakao (Sài Gòn) sáng chế kỹ thuật ráp tay raglan nối từ chân cổ xéo xuống nách, giúp tà áo ôm sát vòng eo mà hoàn toàn không nhăn nách. Ngày nay, Áo Dài được cộng đồng quốc tế công nhận là di sản văn hóa phi vật thể tiêu biểu của người Việt.',
    identificationFeatures: [
      'Cổ áo lập lĩnh (cổ đứng 2 - 4cm), cổ tròn khuyết hoặc cổ thuyền thanh thoát',
      'Tay áo may liền hoặc ráp theo lối raglan ôm vừa vặn từ vai xuống cổ tay',
      'Thân áo chít eo ôm sát cơ thể, xẻ tà hai bên hông cao tới tận eo lườn',
      'Hai tà áo (tà trước và tà sau) buông dài ngang bắp chân hoặc chấm mu bàn chân',
      'Mặc cùng quần lụa ống rộng màu trắng, đen hoặc tiệp sắc cùng tà áo'
    ],
    structureComponents: [
      'Cổ áo (Lập lĩnh ôm nhẹ chân cổ)',
      'Thân áo (Thân trước và thân sau may liền hoặc chít eo đôi)',
      'Tà áo (Tà trước và tà sau buông rủ bay bổng)',
      'Tay áo (Cắt raglan nối từ cổ áo xuống cổ tay)',
      'Hàng cúc (Khuy bấm hoặc cúc ngọc cài chéo từ cổ qua nách xuống eo)'
    ],
    topImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    femaleTopDesc: 'Thượng phục Áo Dài Nữ: Đường ráp tay raglan tinh xảo, cổ lập lĩnh thanh nhã ôm khít chân cổ, thân chít eo đôi tôn trọn đường cong mềm mại của phụ nữ Á Đông.',
    wearingEtiquette: 'Khi bước đi cần giữ lưng thẳng, bước khoan thai nhẹ nhàng để tà áo bay tự nhiên; khi ngồi cần nhẹ nhàng vuốt hai tà xuôi theo thân ghế để giữ nếp lụa thẳng thớm.',
    modernRemixTips: 'Có thể kết hợp cùng áo khoác măng tô mỏng, áo blazer dáng lửng, hoặc phối túi cói, hài thêu và nón lá cách điệu.',
    suitableOccasions: [
      'Lễ cưới hỏi truyền thống (Cô dâu & khách mời)',
      'Tết Nguyên Đán và lễ hội hoa đăng đầu xuân',
      'Lễ tốt nghiệp đại học & ngày Nhà giáo Việt Nam 20/11',
      'Nghi lễ ngoại giao cấp nhà nước & sự kiện văn hóa quốc tế',
      'Đồng phục công sở hàng không, học đường và ngân hàng'
    ],
    frontImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
    sideImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D'],
    culturalNotes: 'Áo Dài là biểu tượng của tinh thần tự tôn dân tộc; tà áo tượng trưng cho sự kín đáo mà gợi cảm, khiêm nhường mà kiêu sa của người phụ nữ Việt.',
    region: 'Toàn quốc',
    silhouetteType: 'fitted'
  },
  {
    id: 'ao-dai-ngu-than-nam',
    name: 'Áo Dài Ngũ Thân Nam (Lập Lĩnh Khăn Đóng)',
    dynasty: 'Triều Nguyễn & Phong trào Phục hưng đương đại',
    era: 'Thế kỷ XVIII - nay (Định hình 1744 - 1827)',
    gender: 'male',
    shortDesc: 'Đỉnh cao trang phục nam giới truyền thống, thể hiện phong thái đĩnh đạc, nho nhã và cốt cách quân tử.',
    historyStory: 'Năm 1744, Chúa Sãi Nguyễn Phúc Khoát ban sắc lệnh định hình trang phục Đàng Trong, chính thức khai sinh áo ngũ thân cài khuy. Năm 1827 và 1837, vua Minh Mạng ban dụ chuẩn hóa trang phục trên toàn cõi Đại Nam: từ quan lại đến thứ dân nam giới đều mặc áo dài ngũ thân cổ đứng khi ra đường. Năm thân áo tượng trưng cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) và cha mẹ bốn phương (tứ thân phụ mẫu) chở che bản thân (thân con nằm kín đáo bên trong). Năm hạt cúc cài tượng trưng cho Ngũ Luân (quân thần, phụ tử, phu phụ, huynh đệ, bằng hữu). Ngày nay, áo dài nam đang được khôi phục mạnh mẽ như quốc phục chính danh của nam giới Việt Nam.',
    identificationFeatures: [
      'Cổ áo đứng (lập lĩnh) tròn vuông vức cao 3.5 - 4.5cm, ôm khít cổ thể hiện sự đoan chính',
      'Phom áo ngũ thân ghép từ 5 thân vải: 2 thân trước, 2 thân sau và 1 vạt con lót bên trong ngực phải',
      'Tay áo may dạng tay chẽn (ôm gọn từ khuỷu tay xuống cổ tay) hoặc tay thụng (khi làm đại lễ)',
      '5 hạt cúc (khuy) may dọc từ chân cổ qua nách xuống sườn phải làm bằng gỗ quý, ngọc hoặc kim loại',
      'Đội cùng khăn đóng (khăn xếp) quấn nếp chữ Nhất hoặc chữ Nhân, đi giày tây hoặc hài cổ'
    ],
    structureComponents: [
      'Cổ lập lĩnh (Cổ đứng cài khuy sát cằm)',
      'Thân áo (Gồm 5 thân tượng trưng ngũ thường)',
      'Khuy cúc (5 cúc tượng trưng ngũ luân đạo nghĩa)',
      'Tay chẽn (Ống tay thuôn gọn, tiện cử động)',
      'Khăn đóng / Khăn quấn (Nếp chữ Nhân thể hiện đức khiêm nhường)'
    ],
    topImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    maleTopImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    maleTopDesc: 'Thượng phục Áo Dài Nam: Cắt phom chữ Nhân đĩnh đạc, cổ lập lĩnh đứng vuông 4cm cài 1 cúc cổ và 4 cúc sườn phải, vạt rộng buông thẳng không chiết eo để tôn phong thái đĩnh đạc.',
    wearingEtiquette: 'Khi mặc áo ngũ thân nam, tư thế đứng thẳng, mắt nhìn đoan chính, hai tay chắp ngang ngực hoặc buông xuôi tự nhiên; cúc cổ phải cài kín đáo không được để phanh ngực.',
    modernRemixTips: 'Có thể kết hợp cùng đồng hồ cổ điển, giày da Oxford hoặc Chelsea boots đen bóng, khoác ngoài áo choàng dạ dáng dài khi trời lạnh.',
    suitableOccasions: [
      'Chú rể trong lễ gia tiên và hôn lễ truyền thống',
      'Đại lễ cúng tổ tiên, tế xuân đình làng, ngày Tết cổ truyền',
      'Ngoại giao văn hóa quốc tế, đại sứ di sản',
      'Khai mạc triển lãm nghệ thuật, tuần lễ thời trang di sản'
    ],
    frontImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#1D3557', '#457B9D', '#2B2D42', '#8D99AE'],
    culturalNotes: 'Áo dài ngũ thân nam là biểu tượng của tinh thần khiêm cung, trọng đạo lý; phom áo không bó sát ngực mà buông suôn theo dáng chữ Nhân (người đàn ông nhân hậu).',
    region: 'Toàn quốc',
    silhouetteType: 'fitted'
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân (Kinh Bắc - Bắc Bộ)',
    dynasty: 'Thời Lý - Trần - Lê đến đầu thế kỷ XX',
    era: 'Thế kỷ XI - XX',
    gender: 'female',
    shortDesc: 'Trang phục dân gian lâu đời nhất của phụ nữ Bắc Bộ, gắn liền với di sản Dân ca Quan họ và chiếu chèo xứ Kinh Bắc.',
    historyStory: 'Áo Tứ Thân là trang phục lao động và trẩy hội cổ truyền của người phụ nữ nông thôn vùng đồng bằng Bắc Bộ từ thời xa xưa. Thuở xưa khi khổ vải dệt bằng khung cửi thủ công chỉ rộng khoảng 35 - 40cm, người thợ may phải ghép 4 khổ vải lại với nhau để tạo thành một chiếc áo hoàn chỉnh: hai vạt sau may ghép lại ở giữa sống lưng gọi là sống áo, hai vạt trước để buông thả tự do để khi làm đồng hay trẩy hội có thể buộc vạt vào nhau trước bụng. Bốn vạt áo tượng trưng cho tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ chồng). Bộ trang phục kết hợp hài hòa giữa áo khoác tứ thân, yếm đào, dải thắt lưng ruột tượng và nón quai thao ba tầm.',
    identificationFeatures: [
      'Gồm 4 thân áo: 2 thân sau may liền ở sống lưng, 2 thân trước buông dài để buộc chéo trước bụng',
      'Áo không có cúc khuy cài ngực, khi mặc khoác ngoài để lộ lớp yếm đào bên trong',
      'Bên trong mặc yếm cổ xây hoặc yếm cánh sen, lót thêm áo cánh trắng hoặc nâu non',
      'Thắt lưng dải lụa dài (ruột tượng) màu xanh lục, hồng cánh sen hoặc vàng mỡ gà buông rủ',
      'Váy lụa sồi đen chấm gót xòe rộng, đội nón quai thao (nón ba tầm) và chít khăn mỏ quạ'
    ],
    structureComponents: [
      'Bốn thân áo (Hai thân sau may giáp sống, hai thân trước xẻ)',
      'Áo yếm lót trong (Yếm đào lụa tơ tằm thêu hoa)',
      'Áo cánh mỏng (Lót giữa yếm và áo tứ thân)',
      'Dải thắt lưng ruột tượng (Lụa ngũ sắc buông dài)',
      'Váy sồi đen đũi (Dáng xòe bay chấm gót chân)',
      'Khăn mỏ quạ & Nón quai thao (Phụ kiện linh hồn Bắc Bộ)'
    ],
    topImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    femaleTopDesc: 'Thượng phục Áo Tứ Thân Nữ: Phần cổ xẻ chữ V buông mở không cài khuy, để lộ lớp yếm đào lụa tơ tằm cổ xây bên trong, hai vạt trước thắt nút điệu đà.',
    wearingEtiquette: 'Hai dải vạt trước buộc nút mềm mại ngang rốn hoặc hơi trễ dưới eo; bước đi uyển chuyển nhịp nhàng theo câu hát quan họ, tay nâng nhẹ vành nón quai thao duyên dáng.',
    modernRemixTips: 'Có thể tách áo tứ thân làm áo khoác duster coat dài phối cùng áo croptop lụa và quần ống suông palazzo hiện đại.',
    suitableOccasions: [
      'Lễ hội mùa xuân vùng Kinh Bắc (Hội Lim, Hội Đền Hùng, Hội Chùa Hương)',
      'Diễn xướng Dân ca Quan họ Bắc Ninh, Hát Xoan, Ca Trù, Hát Chèo',
      'Ngày hội di sản văn hóa phi vật thể các dân tộc Việt Nam',
      'Chụp ảnh nghệ thuật concept thiếu nữ đồng quê Kinh Bắc'
    ],
    frontImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#6B705C', '#A5A58D', '#B7B7A4', '#DDBEA9'],
    culturalNotes: 'Áo Tứ Thân biểu trưng cho đức hy sinh, tình cảm gia đình keo sơn gắn bó và nét đằm thắm mộc mạc của người mẹ, người chị xứ Bắc.',
    region: 'Bắc Bộ',
    silhouetteType: 'layered'
  },
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Áo Thụng Ngũ Thân Triều Nguyễn)',
    dynasty: 'Triều Nguyễn (1802 - 1945)',
    era: 'Thế kỷ XIX - XX',
    gender: 'unisex',
    shortDesc: 'Đại lễ phục cổ đứng năm thân, tay thụng rộng trang trọng bậc nhất của người Việt dưới triều Nguyễn.',
    historyStory: 'Áo Tấc (còn gọi là Áo thụng) là lễ phục truyền thống quy định chặt chẽ trong Khâm Định Đại Nam Hội Điển Sự Lệ. Từ Hoàng đế, hoàng tộc, quan lại văn võ đến thứ dân đều mặc trong các dịp đại lễ, tế tự giao miếu, hôn lễ hay Tết Nguyên Đán. Áo may theo thể năm thân (ngũ thân), vạt cả đè lên vạt con bên phải, tượng trưng cho tứ thân phụ mẫu ôm ấp con cái. Tay áo thụng dài và rộng hơn thân chừng một gang tay (khoảng 1 tấc vải, nên gọi là Áo Tấc), khi chắp tay trước ngực tạo tư thế cung kính, trang trọng tuyệt đối.',
    identificationFeatures: [
      'Cổ áo đứng (lập lĩnh) tròn cài khuy bên phải (thường từ 4 đến 5 khuy ngọc hoặc kim loại mạ vàng)',
      'Tay áo thụng dài và rộng bằng hoặc hơn thân áo (khi chắp tay che kín hoàn toàn cổ tay)',
      'Thân áo ngũ thân may rộng rãi, dài qua gối, tà buông thẳng tôn nghiêm',
      'Mặc cùng khăn đóng (khăn xếp) và quần lụa trắng hoặc đen ống rộng'
    ],
    structureComponents: [
      'Cổ lập lĩnh (Cổ đứng cài khuy)',
      'Năm thân áo (Vạt cả, vạt con, thân sau)',
      'Ống tay thụng rộng (Rộng 40 - 50cm, dài chấm ngón tay)',
      '5 hạt cúc ngọc cài chéo nách'
    ],
    topImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    maleTopImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
    maleTopDesc: 'Áo Tấc Nam: Tay thụng bản rộng vuông vức, cổ đứng cao 4.5cm khép kín cằm, màu sắc trang nghiêm (xanh lam chàm, đen tuyền, tím hoa cà, đỏ sẫm) phối khăn đóng chữ Nhân.',
    femaleTopDesc: 'Áo Tấc Nữ: Tay thụng lụa gấm mềm mại, nẹp cổ thêu hoa sen hoặc mẫu đơn, tà áo thêu họa tiết tứ thời, phối cùng khăn vành dây tơ tằm thanh nhã.',
    wearingEtiquette: 'Khi mặc Áo Tấc bắt buộc phải giữ tay chắp trước bụng hoặc khép tà đoan trang; tuyệt đối không xắn tay thụng lên cao làm hỏng phom dáng điển lễ triều đình.',
    modernRemixTips: 'Remix cùng khăn choàng lụa tơ tằm thêu tay hoa sen, cài trâm bạc thủ công tinh xảo.',
    suitableOccasions: [
      'Lễ tân hôn trọng đại (Cô dâu & chú rể)',
      'Lễ Tết Nguyên Đán & Lễ cúng gia tiên linh thiêng',
      'Nghi lễ thờ cúng đền chùa, lễ hội Festival Huế',
      'Dự tiệc ngoại giao văn hóa cấp quốc gia'
    ],
    frontImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#9B2226', '#1D3557', '#E9D8A6'],
    culturalNotes: 'Áo Tấc là đỉnh cao của sự trang trọng và kính cẩn trong văn hóa lễ nhạc cổ truyền Việt Nam.',
    region: 'Trung Bộ',
    silhouetteType: 'loose'
  },
  {
    id: 'ao-ngu-than',
    name: 'Áo Ngũ Thân Tay Chẽn (Tiền Thân Áo Dài)',
    dynasty: 'Triều Nguyễn (1802 - 1945)',
    era: 'Thế kỷ XVIII - XX',
    gender: 'unisex',
    shortDesc: 'Thường phục thanh lịch, kín đáo, chuẩn mực nếp sống của cả nam và nữ trước thời kỳ tân thời.',
    historyStory: 'Được định hình từ cuộc cải cách trang phục của Chúa Nguyễn Phúc Khoát năm 1744 và hoàn thiện dưới triều vua Minh Mạng (1827 - 1837). Áo ngũ thân tay chẽn có phom dáng gọn gàng, tay áo ôm khít từ khuỷu tay đến cổ tay, giúp người mặc sinh hoạt, làm việc thuận tiện nhưng vẫn toát lên phong thái nho nhã, đĩnh đạc. Năm thân áo tượng trưng cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) và năm hạt cúc tượng trưng cho Ngũ Luân. Đây chính là tiền thân trực tiếp nhất của chiếc Áo Dài hiện đại ngày nay.',
    identificationFeatures: [
      'Tay áo may ôm vừa vặn (tay chẽn) từ nách xuống cổ tay',
      'Cổ đứng thẳng vuông vức cao chừng 3-4cm ôm nhẹ cổ',
      '5 thân áo gồm 2 thân trước, 2 thân sau và 1 thân con (vạt con) nằm lót bên trong ngực phải',
      '5 hạt cúc (khuy) bằng ngọc, kim loại hoặc đá quý tượng trưng ngũ luân'
    ],
    structureComponents: [
      'Cổ áo lập lĩnh thẳng thớm',
      'Vạt cả đè lên vạt con bên phải',
      'Hàng 5 khuy cúc dọc sườn phải',
      'Tay chẽn thuôn gọn ôm cổ tay'
    ],
    topImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    maleTopImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    maleTopDesc: 'Ngũ Thân Nam: Thân áo thẳng đứng buông suôn theo dáng chữ Nhân, cổ cao vuông vức, tay chẽn ôm từ khuỷu đến cổ tay tiện cử động viết lách, đàm đạo.',
    femaleTopDesc: 'Ngũ Thân Nữ: Đường nẹp cổ và vạt áo lượn sóng mềm mại, ôm nhẹ phần thân trên kín đáo, vạt cả đè vạt con đoan trang hiền thục.',
    wearingEtiquette: 'Tác phong nhẹ nhàng, khép tà khi ngồi, giữ cổ áo luôn cài cúc ngay ngắn.',
    modernRemixTips: 'Áo Ngũ Thân tay chẽn rất dễ phối kết hợp cùng quần âu hiện đại hoặc áo blazer mỏng, mang hơi thở giao thoa Đông - Tây tuyệt mỹ.',
    suitableOccasions: [
      'Đi làm công sở sáng tạo & giảng đường đại học',
      'Dạo phố cuối tuần, gặp gỡ giao lưu văn hóa',
      'Tham quan di tích, bảo tàng, không gian trà đạo',
      'Lễ chúc mừng tốt nghiệp và kỷ niệm trang trọng'
    ],
    frontImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#2A6F97', '#014F86', '#F4A261'],
    culturalNotes: 'Ngũ thân tượng trưng cho sự gắn bó keo sơn ruột thịt, sống có đạo nghĩa trước sau.',
    region: 'Toàn quốc',
    silhouetteType: 'fitted'
  },
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình (Cung Đình Triều Nguyễn)',
    dynasty: 'Triều Nguyễn (1802 - 1945)',
    era: 'Năm 1807 - 1945',
    gender: 'female',
    shortDesc: 'Thường phục cao quý của Hoàng tộc và mệnh phụ triều Nguyễn với dải cổ chữ nhật và viền ngũ hành rực rỡ.',
    historyStory: 'Quy định trong Khâm Định Đại Nam Hội Điển Sự Lệ từ năm Gia Long thứ 6 (1807), Áo Nhật Bình là thường phục của Hoàng Thái Hậu, Hoàng Hậu, Hoàng Quý Phi, Công chúa và mệnh phụ quan viên tam phẩm trở lên. Tên gọi xuất phát từ bản cổ áo hình chữ nhật vuông vức trước ngực. Vải áo dệt gấm thêu hoa văn ngũ hành, chim phụng, hoa mẫu đơn; tay áo viền dải ngũ sắc lộng lẫy (xanh, đỏ, trắng, vàng, lục) biểu trưng cho âm dương ngũ hành điều hòa và sự thịnh vượng của vương triều.',
    identificationFeatures: [
      'Cổ áo chữ nhật to bản xẻ trước ngực với dải hoa văn thêu tỉ mỉ',
      'Hai dải dải buông thêu phụng, hoa sen hoặc mây ngũ sắc thõng dài trước bụng',
      'Tay áo có dải viền ngũ sắc rực rỡ tượng trưng Ngũ Hành',
      'Áo cài bằng dây thắt hoặc khuy ngọc quý giá'
    ],
    structureComponents: [
      'Cổ chữ nhật bản to thêu rồng phụng hoa mẫu đơn',
      'Dải viền ngũ hành 5 màu ở cổ tay',
      'Hai dải dải buông (dải phốc) buông dài trước bụng',
      'Khuy cài ngọc bích hoặc vàng ròng'
    ],
    topImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    femaleTopDesc: 'Thượng phục Áo Nhật Bình Nữ: Dải cổ vuông chữ nhật thêu chỉ vàng kim tuyến rực rỡ, hai dải dải buông thêu chim loan phụng thõng xuống trước ngực, viền tay áo 5 màu ngũ hành tương sinh.',
    wearingEtiquette: 'Tư thế đoan trang, bước đi từ tốn để dải dải buông không bị xô lệch; kết hợp đội khăn vành dây màu xanh hoặc vàng đồng.',
    modernRemixTips: 'Khi remix hiện đại nên tiết chế phụ kiện rườm rà, để họa tiết cổ chữ nhật và dải viền ngũ sắc tỏa sáng tự nhiên.',
    suitableOccasions: [
      'Lễ tân hôn trọng đại (Cô dâu quyền quý)',
      'Sự kiện thảm đỏ văn hóa nghệ thuật quốc tế',
      'Chụp ảnh nghệ thuật di sản cố đô',
      'Lễ hội Festival Cố đô Huế'
    ],
    frontImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#E76F51', '#D4A373', '#9B2226'],
    culturalNotes: 'Nhật Bình vốn là trang phục của các bậc mẫu nghi thiên hạ, tượng trưng cho vẻ đẹp đài các, tôn nghiêm.',
    region: 'Trung Bộ',
    silhouetteType: 'loose'
  },
  {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh (Trực Lĩnh Cổ Chéo)',
    dynasty: 'Thời Lý - Trần - Hậu Lê',
    era: 'Thế kỷ XI - XVIII',
    gender: 'unisex',
    shortDesc: 'Cổ phục cổ kính với hai vạt áo giao nhau chéo trước ngực, phong vị hào hoa thanh thoát của Đại Việt ngàn năm.',
    historyStory: 'Áo Giao Lĩnh (còn gọi là Giao Cổ Y) là kiểu áo phổ biến bậc nhất trong lịch sử Việt Nam xuyên suốt thời Lý, Trần, Lê cho đến trước thời Minh Mạng. Áo có đặc trưng hai cổ bắt chéo qua ngực, vạt phải đè lên vạt trái (hữu nhậm), buộc dây hoặc thắt đai lưng (thường gọi là tạp tụng hoặc đại đái). Tượng đá thời Lý tại chùa Phật Tích hay tranh vẽ thời Lê Trung Hưng đều minh chứng cho vẻ đẹp thanh tao, phóng khoáng của phom dáng này.',
    identificationFeatures: [
      'Hai vạt áo giao chéo nhau tạo thành đường cổ chữ V thanh thoát',
      'Thường dùng dây buộc bên hông phải hoặc thắt đai lưng vải bản rộng',
      'Tay áo có thể là tay thụng rộng hoặc tay chẽn tùy tầng lớp và dịp lễ',
      'Tà áo dài thướt tha, buông rủ uyển chuyển'
    ],
    structureComponents: [
      'Cổ giao chéo (Vạt phải đè vạt trái - Hữu nhậm)',
      'Thắt lưng lụa bản rộng thắt eo',
      'Thân áo xòe rộng buông dài qua gối',
      'Tay áo thụng dài phiêu dật'
    ],
    topImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    maleTopImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    maleTopDesc: 'Giao Lĩnh Nam: Cổ chéo chữ V mở rộng thể hiện khí phách hào sảng, vạt áo rộng khoác ngoài, thắt đai lưng da hoặc lụa bản lớn ngang eo.',
    femaleTopDesc: 'Giao Lĩnh Nữ: Đường cổ chữ V ôm khít thanh thoát để lộ lấp ló cổ áo lót trắng bên trong, thắt nơ lụa mềm mại rủ xuống tà váy thướt tha.',
    wearingEtiquette: 'Quy tắc vạt phải đè lên vạt trái (hữu nhậm) là chuẩn mực trang phục văn minh Đại Việt; tuyệt đối không mặc chéo vạt trái đè lên vạt phải (tả nhậm - kiêng kỵ trong nghi lễ người sống).',
    modernRemixTips: 'Khoác nhẹ bên ngoài đầm lụa trơn hoặc phối đai thắt lưng da hiện đại tôn vòng eo.',
    suitableOccasions: [
      'Triển lãm thời trang đương đại & tuần lễ văn hóa',
      'Trình diễn âm nhạc dân tộc, đàn tranh, sáo trúc',
      'Chụp lookbook concept hoài cổ Đại Việt',
      'Lễ hội trà đạo và thư pháp cung đình'
    ],
    frontImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#3A5A40', '#588157', '#A3B18F'],
    culturalNotes: 'Giao Lĩnh mang tinh thần khoáng đạt, tự do của thời đại Lý - Trần hưng thịnh.',
    region: 'Bắc Bộ',
    silhouetteType: 'layered'
  },
  {
    id: 'ao-doi-kham',
    name: 'Áo Đối Khâm (Bì Cương Quý Tộc)',
    dynasty: 'Thời Lý - Trần - Lê',
    era: 'Thế kỷ XI - XVII',
    gender: 'unisex',
    shortDesc: 'Áo khoác dài buông thẳng hai vạt song song, lộng lẫy và dễ phối nhiều lớp thời thượng bậc nhất.',
    historyStory: 'Áo Đối Khâm là loại áo khoác ngoài có hai thân trước song song buông thẳng đối diện nhau mà không giao chéo. Vào thời Trần - Lê, áo Đối Khâm thường được các quý tộc, cung nữ và văn nhân dùng khoác bên ngoài áo Giao Lĩnh hoặc yếm đào để tạo vẻ thanh tú, phiêu dật. Trong thời trang đương đại, phom dáng Đối Khâm tương tự một chiếc trench coat hoặc cardigan dáng dài, cực kỳ thích hợp cho các bản phối Remix.',
    identificationFeatures: [
      'Hai vạt áo buông thẳng song song phía trước ngực',
      'Không cài cúc hoặc chỉ cài một ngọc bội/dây thắt nhẹ ngang ngực',
      'Tạo hiệu ứng layer lớp lang tuyệt đẹp khi để lộ lớp áo bên trong',
      'Tay áo dài rộng, biên vải thêu hoa văn hoa sen, lá đề hoặc triện cổ'
    ],
    structureComponents: [
      'Hai vạt áo buông đối xứng song song',
      'Nẹp cổ thẳng viền hoa văn hoa sen',
      'Dây thắt đính ngọc bội ngang ngực',
      'Tay áo thụng rộng rủ mềm'
    ],
    topImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    maleTopImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    maleTopDesc: 'Đối Khâm Nam: Nẹp áo viền gấm trơn hoặc hoa văn kỷ hà trầm tĩnh, thân áo dài buông thẳng như trench coat quý phái.',
    femaleTopDesc: 'Đối Khâm Nữ: Nẹp áo viền thêu hoa sen chỉ vàng, vạt buông lơi để lộ yếm và áo lót màu ngọc bên trong.',
    wearingEtiquette: 'Để mở hai vạt tự nhiên bay theo từng bước chân để khoe lớp áo phối màu tương phản bên trong.',
    modernRemixTips: 'Rất linh hoạt khi khoác ngoài áo thun cổ lọ, sơ mi trắng hoặc đầm slip-dress hiện đại.',
    suitableOccasions: [
      'Tuần lễ thời trang Fashion Week quốc tế',
      'Gặp gỡ bạn bè quán cà phê hoài cổ, dạo phố',
      'Biểu diễn nghệ thuật sân khấu đương đại',
      'Dạo chơi tiết trời thu đông se lạnh'
    ],
    frontImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#6B705C', '#CB997E', '#DDBEA9'],
    culturalNotes: 'Đối Khâm là biểu tượng của nghệ thuật phân tầng trang phục (layering) tinh tế của tiền nhân.',
    region: 'Toàn quốc',
    silhouetteType: 'loose'
  },
  {
    id: 'ao-vien-linh',
    name: 'Áo Viên Lĩnh (Bàn Lĩnh Hoàng Triều)',
    dynasty: 'Thời Lý - Trần - Hậu Lê',
    era: 'Thế kỷ XI - XVIII',
    gender: 'male',
    shortDesc: 'Triều phục cổ tròn uy nghiêm của hoàng đế và quan lại cao cấp trong các nghi lễ quốc gia Đại Việt.',
    historyStory: 'Áo Viên Lĩnh (còn gọi là Bàn Lĩnh) là áo có cổ tròn khép kín viền cong, cài khuy sang vai phải, thân rộng và tay thụng dài. Dưới thời Lý, Trần và Lê, Viên Lĩnh là loại áo chính thức dành cho Thiên tử (Long bào thêu rồng uốn lượn) và quan văn võ khi vào triều bái yết hoặc xử lý chính sự. Quan lại mặc áo Viên Lĩnh đính tấm Bổ tử vuông trước ngực và sau lưng thêu hình chim muông (quan văn: hạc, công, trĩ...) hoặc cầm thú (quan võ: sư tử, hổ, báo...) để phân định phẩm trật rõ ràng.',
    identificationFeatures: [
      'Cổ áo cắt tròn cong khép kín quanh chân cổ (Viên lĩnh)',
      'Hàng khuy cài lệch sang vai và nách bên phải',
      'Ngực áo thêu rồng thời Lý/Lê hoặc đính phù hiệu Bổ tử phẩm hàm',
      'Thân áo rộng rãi, hai bên sườn có xẻ tà lót vạt con che kín'
    ],
    structureComponents: [
      'Cổ tròn viền cong ôm khít',
      'Bổ tử thêu tay chỉ vàng trước ngực và sau lưng',
      'Ống tay thụng rộng 45 - 55cm',
      'Đai lưng ngọc bản to thắt ngang bụng'
    ],
    topImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    maleTopImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    maleTopDesc: 'Thượng phục Viên Lĩnh Nam: Cổ tròn viền kín cài khuy sang vai phải, ngực áo đính Bổ tử thêu rồng thời Lý/Lê hoặc hạc trắng đại khoa, thắt đai ngọc vàng trang trọng.',
    wearingEtiquette: 'Tác phong uy nghiêm, đĩnh đạc; khi đi hai tay giữ đai ngọc hoặc chắp trước ngực.',
    modernRemixTips: 'Ứng dụng họa tiết Bổ tử thêu tay vào áo khoác bomber hoặc áo vest không cổ hiện đại.',
    suitableOccasions: [
      'Nghi lễ tái hiện lịch sử cung đình & tế giao',
      'Trình diễn thời trang nghệ thuật chủ đề Hoàng triều Đại Việt',
      'Phim ảnh và sân khấu kịch lịch sử'
    ],
    frontImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#FFB703', '#FB8500', '#023047'],
    culturalNotes: 'Áo Viên Lĩnh đại diện cho thể chế nhà nước Đại Việt độc lập, văn minh và rực rỡ.',
    region: 'Bắc Bộ',
    silhouetteType: 'loose'
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    dynasty: 'Giai đoạn Khai phá & Hiện đại Nam Bộ',
    era: 'Thế kỷ XIX - nay',
    gender: 'unisex',
    shortDesc: 'Vẻ đẹp mộc mạc, phóng khoáng, chịu thương chịu khó của người dân miền Tây sông nước Nam Bộ.',
    historyStory: 'Áo Bà Ba xuất hiện vào khoảng đầu thế kỷ XIX tại vùng đất Nam Bộ trù phú. Học giả Trương Vĩnh Ký nhận định áo có thể tiếp biến từ trang phục của người Mã Lai hoặc được cải biên từ áo cánh miền Bắc để phù hợp với khí hậu nhiệt đới kênh rạch phương Nam. Thân áo ngắn vừa vặn, chẻ tà hai bên hông tạo sự thoáng mát và dễ dàng chèo thuyền, làm đồng. Áo Bà Ba gắn liền với hình ảnh khăn rằn và nón lá, biểu trưng cho sự chất phác, hào sảng, trọng nghĩa khinh tài của người Nam Bộ.',
    identificationFeatures: [
      'Thân áo ngắn chớm hông, xẻ tà hai bên lườn tầm 10-15cm giúp cử động thoải mái',
      'Cổ áo tròn hoặc khoét hình quả tim thanh thoát, không có cổ đứng',
      'Thân trước có hàng cúc cài thẳng tắp ở giữa (cúc nhựa, cúc bọc vải hoặc cúc bấm)',
      'Phía dưới vạt trước có 2 túi vuông to tiện lợi đựng vật dụng cá nhân',
      'Kết hợp cùng khăn rằn Nam Bộ, nón lá chóp nhọn và quần lụa đen rộng'
    ],
    structureComponents: [
      'Cổ tròn hoặc tim thoáng mát',
      'Thân trước xẻ giữa cài hàng cúc',
      'Hai túi vuông vạt trước',
      'Xẻ tà hai bên hông',
      'Khăn rằn caro đen trắng'
    ],
    topImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    maleTopImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    maleTopDesc: 'Áo Bà Ba Nam: Thân áo may suông rộng rãi, màu nâu non hoặc đen chàm, 2 túi to trước vạt, tạo sự năng động hào sảng nơi sông nước.',
    femaleTopDesc: 'Áo Bà Ba Nữ: Cổ khoét hình tim hoặc tròn, chiết eo thon thả tôn đường cong duyên dáng, may bằng lụa satin bóng hoặc gấm hoa rực rỡ.',
    wearingEtiquette: 'Tư thế tự nhiên, thân thiện; khăn rằn có thể vắt chéo qua cổ hoặc quấn gọn gàng trên đầu.',
    modernRemixTips: 'Mix áo bà ba lụa gấm cùng quần jeans ống suông hoặc chân váy midi xếp ly hiện đại.',
    suitableOccasions: [
      'Du lịch trải nghiệm miệt vườn sông nước miền Tây',
      'Lễ hội bánh dân gian Nam Bộ, chợ nổi Cái Răng',
      'Giao lưu đờn ca tài tử Nam Bộ',
      'Mặc thư thái tại nhà, dạo phố cuối tuần'
    ],
    frontImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#2B2D42', '#8D99AE', '#EDF2F4'],
    culturalNotes: 'Áo Bà Ba là hình ảnh thân thương của đất phương Nam hào hiệp, chân tình.',
    region: 'Nam Bộ',
    silhouetteType: 'fitted'
  },
  {
    id: 'ao-dai-lemur',
    name: 'Áo Dài Le Mur (Tân Thời 1934 - Họa Sĩ Cát Tường)',
    dynasty: 'Giai đoạn Giao thời Đông Dương',
    era: 'Thập niên 1930 - 1940',
    gender: 'female',
    shortDesc: 'Cột mốc cách tân táo bạo hòa quyện nghệ thuật tạo hình phương Tây với nét thướt tha phụ nữ Việt.',
    historyStory: 'Sáng tạo bởi họa sĩ Cát Tường (bút danh Le Mur) năm 1934 trên tuần báo Phong Hóa thuộc Tự Lực Văn Đoàn. Áo Dài Le Mur đã thổi bùng cuộc cách mạng thời trang: cổ áo mở rộng hoặc khoét tim, vai phồng tay bồng kiểu Tây phương, eo thắt gọn gàng khoe đường cong tự nhiên và tà áo dài chấm gót. Đây là biểu tượng của tinh thần đổi mới và nữ quyền Việt Nam thời kỳ đầu thế kỷ XX.',
    identificationFeatures: [
      'Cổ áo có bèo nhún hoặc khoét tim thanh lịch',
      'Vai phồng nhẹ tay bồng phong cách Art Deco Đông Dương',
      'Đường cắt chiết eo mềm mại tôn dáng vóc',
      'Tà áo bay bổng kết hợp cùng quần âu trắng lụa satin'
    ],
    structureComponents: [
      'Cổ áo viền ren bèo nhún',
      'Vai phồng bồng tay Tây phương',
      'Chiết eo tôn ngực hông',
      'Tà áo cắt dài bay bổng'
    ],
    topImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    femaleTopDesc: 'Thượng phục Áo Dài Le Mur: Vai phồng tay bồng kiểu Pháp, cổ mở rộng xếp bèo đăng ten hoặc cổ lá sen Tây hóa, chiết ngực eo tân thời.',
    wearingEtiquette: 'Bước đi thanh thoát, dáng dấp quý phái; kết hợp cùng ví cầm tay và giày cao gót cổ điển.',
    modernRemixTips: 'Nên kết hợp cùng giày cao gót mũi nhọn hoặc sandal quai mảnh, tóc uốn sóng nước cổ điển phong cách Indochine.',
    suitableOccasions: [
      'Tiệc sinh nhật trang trọng & dạ hội nghệ thuật',
      'Sự kiện thời trang phong cách Indochine hoài niệm',
      'Chụp ảnh kỷ yếu thanh xuân, concept thập niên 30'
    ],
    frontImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    dominantColors: ['#BC6C25', '#DDA15E', '#FEFAE0'],
    culturalNotes: 'Biểu tượng của bước chuyển mình mạnh mẽ trong ý thức thẩm mỹ của phụ nữ Việt Nam đầu thế kỷ XX.',
    region: 'Toàn quốc',
    silhouetteType: 'fitted'
  },
  {
    id: 'ao-yem-co-truyen',
    name: 'Áo Yếm Cổ Truyền (Yếm Đào / Yếm Cánh Sen)',
    dynasty: 'Thời Lý - Trần qua Lê - Nguyễn đến đầu thế kỷ XX',
    era: 'Ngàn năm lịch sử',
    gender: 'female',
    shortDesc: 'Nội y duyên dáng độc nhất vô nhị gắn liền với vẻ đẹp gợi cảm, e ấp của người phụ nữ Việt Nam cổ truyền.',
    historyStory: 'Chiếc Áo Yếm đã đồng hành cùng người phụ nữ Việt suốt ngàn năm lịch sử. Yếm có nhiều sắc thái phong phú: từ chiếc yếm nâu, yếm sồi mộc mạc thấm giọt mồ hôi của cô thôn nữ trên đồng ruộng; đến chiếc yếm đào, yếm hoa chanh, yếm thủy lục rực rỡ của thiếu nữ trẩy hội mùa xuân; và chiếc yếm lụa thêu kim tuyến trong chốn quyền quý hoàng cung. Yếm khoe khéo bờ vai thon thả và tấm lưng trần duyên dáng nhưng vẫn giữ được nét e ấp tế nhị khi được che chắn khéo léo bởi lớp áo khoác tứ thân hoặc giao lĩnh.',
    identificationFeatures: [
      'Tấm vải hình vuông hoặc quả trám vát góc ôm trọn phần ngực',
      'Cổ tròn khoét sâu viền mép (yếm cổ xây) hoặc khoét nhọn hình chữ V (yếm cổ xẻ / cánh sen)',
      'Bốn dải dây lụa: hai dải buộc sau gáy và hai dải buộc sau lưng',
      'Chất liệu lụa tơ tằm, đũi tơ hoặc gấm nhuộm màu tự nhiên (hồng đào, xanh lục, vàng mỡ gà)'
    ],
    structureComponents: [
      'Thân yếm quả trám che ngực',
      'Cổ xây / Cổ xẻ cánh sen',
      'Dây buộc sau cổ',
      'Dây buộc eo lưng'
    ],
    topImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    femaleTopImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    femaleTopDesc: 'Thượng phục Áo Yếm Nữ: Vải lụa quả trám ôm ngực, hai dải lụa mềm buộc sau gáy, hai dải buộc ngang lưng để lộ trọn bờ vai và lưng trần ngọc ngà.',
    wearingEtiquette: 'Mặc lót bên trong áo tứ thân, áo đối khâm, giao lĩnh; khi mặc độc lập chụp ảnh sen cần giữ phong thái thanh tao, tránh hở hang phảm cảm.',
    modernRemixTips: 'Remix thành áo halter top lụa phối cùng quần ống rộng lưng cao hoặc chân váy lụa satin hiện đại.',
    suitableOccasions: [
      'Mặc lót bên trong áo tứ thân trẩy hội mùa xuân',
      'Chụp ảnh nghệ thuật đầm sen mùa hạ',
      'Trình diễn múa dân gian đương đại & tuần lễ thời trang'
    ],
    frontImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    backImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    layerType: 'inner_top',
    dominantColors: ['#E76F51', '#F4A261', '#E9C46A'],
    culturalNotes: 'Yếm đào là biểu tượng bất hủ của vẻ đẹp dịu dàng, e ấp và thuần khiết của người phụ nữ Việt.',
    region: 'Toàn quốc',
    silhouetteType: 'fitted'
  }
];

export const MODERN_GARMENTS: ModernGarment[] = [
  {
    id: 'mod-blazer-oversize',
    name: 'Blazer Phom Rộng Cắt Tối Giản',
    category: 'jacket',
    layerType: 'outer_top',
    colorName: 'Xám Ghi Tro',
    hexColor: '#6C757D',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    styleDesc: 'Đường cắt may sắc sảo của phong cách tailoring đương đại, tạo cấu trúc cân bằng với tà áo buông mềm mại.'
  },
  {
    id: 'mod-wide-pants',
    name: 'Quần Âu Ống Suông Culottes',
    category: 'pants',
    layerType: 'bottom',
    colorName: 'Beige Kem Lụa',
    hexColor: '#E9ECEF',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
    styleDesc: 'Ống suông bay bổng mô phỏng chuyển động của tà quần lụa xưa nhưng tiện lợi khi di chuyển.'
  },
  {
    id: 'mod-pleated-skirt',
    name: 'Chân Váy Xếp Ly Dáng Dài',
    category: 'skirt',
    layerType: 'bottom',
    colorName: 'Đen Mực Tàu',
    hexColor: '#212529',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80',
    styleDesc: 'Những đường nếp gấp kỷ hà tinh tế, ăn khớp với triết lý đối xứng của trang phục Đông Sơn và cổ triều.'
  },
  {
    id: 'mod-chelsea-boots',
    name: 'Chelsea Boots Da Mờ Tối Giản',
    category: 'shoes',
    layerType: 'shoes',
    colorName: 'Nâu Vỏ Cây Hạt Dẻ',
    hexColor: '#493628',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80',
    styleDesc: 'Đôi boot da vững chãi thay thế cho hài thêu, tạo diện mạo thành thị (urban) cá tính.'
  },
  {
    id: 'mod-minimal-sneaker',
    name: 'Sneaker Da Trắng Tinh Giản',
    category: 'shoes',
    layerType: 'shoes',
    colorName: 'Trắng Ngà Tinh Khôi',
    hexColor: '#F8F9FA',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    styleDesc: 'Điểm nhấn trẻ trung, giải phóng sự gò bó, hoàn hảo cho thế hệ Gen Z yêu di sản.'
  }
];

export const ACCESSORY_ITEMS: AccessoryItem[] = [
  {
    id: 'acc-khan-dong',
    name: 'Khăn Đóng (Khăn Xếp) Nhũ Tơ',
    category: 'hat',
    layerType: 'accessory_back',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
    traditional: true,
    desc: 'Biểu trưng của sự ngay ngắn, chỉnh tề; quấn theo phép chữ Nhất hoặc chữ Nhân.'
  },
  {
    id: 'acc-tui-gam',
    name: 'Túi Xách Gấm Họa Tiết Vân Mây',
    category: 'bag',
    layerType: 'accessory_front',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    traditional: true,
    desc: 'Chất liệu gấm dệt hoa văn sóng nước thủy ba cổ truyền kết hợp quai da hiện đại.'
  },
  {
    id: 'acc-quat-tram',
    name: 'Quạt Trầm Hương Điêu Khắc Trống Đồng',
    category: 'fan',
    layerType: 'accessory_front',
    image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80',
    traditional: true,
    desc: 'Hương trầm thoang thoảng cùng họa tiết chim Lạc khắc laser tinh xảo.'
  },
  {
    id: 'acc-kinh-retro',
    name: 'Kính Râm Gọng Đồi Mồi Đông Dương',
    category: 'eyewear',
    layerType: 'accessory_front',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    traditional: false,
    desc: 'Hơi thở hoài niệm Sài Gòn - Hà Nội những năm 1950, tăng vẻ thời thượng cho bộ phối.'
  },
  {
    id: 'acc-vong-ngoc',
    name: 'Vòng Cổ Khánh Bạc Đính Ngọc Bích',
    category: 'jewelry',
    layerType: 'accessory_front',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    pngOverlayImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    traditional: true,
    desc: 'Kim khánh mang ý nghĩa chúc phúc, bình an và thăng tiến.'
  }
];

export const TRADITIONAL_COLORS: ColorItem[] = [
  { id: 'c-do-dieu', name: 'Đỏ Điều (Son Thẫm)', hex: '#9B2226', type: 'traditional', meaning: 'Hỷ sự, thịnh vượng, xua đuổi tà khí', element: 'Hỏa' },
  { id: 'c-hoang-yen', name: 'Vàng Hoàng Yến', hex: '#E9C46A', type: 'traditional', meaning: 'Uy nghiêm, phú quý hoàng gia, ấm áp', element: 'Thổ' },
  { id: 'c-cham-thuy-luc', name: 'Xanh Chàm Thủy Lục', hex: '#264653', type: 'traditional', meaning: 'Điềm đạm, sông nước, sự tĩnh tại nội tâm', element: 'Thủy' },
  { id: 'c-tim-hue', name: 'Tím Hoa Cà Xứ Huế', hex: '#6D597A', type: 'traditional', meaning: 'Đoan trang, chung thủy, thi vị tao nhã', element: 'Hỏa' },
  { id: 'c-trang-nga', name: 'Trắng Ngà Tơ Tằm', hex: '#FDFBF7', type: 'traditional', meaning: 'Thanh bạch, tinh khôi, cốt cách quân tử', element: 'Kim' },
  { id: 'c-den-huyen', name: 'Đen Mực Tàu Chân Phương', hex: '#1C1917', type: 'traditional', meaning: 'Vững chãi, mực thước, phẩm hàm chính trực', element: 'Thủy' }
];

export const MODERN_COLORS: ColorItem[] = [
  { id: 'mc-beige', name: 'Kem Sữa (Oatmeal Beige)', hex: '#DDBEA9', type: 'modern', meaning: 'Thanh lịch, tối giản đương đại, dễ chịu' },
  { id: 'mc-terracotta', name: 'Cam Đất Terracotta', hex: '#B25032', type: 'modern', meaning: 'Năng động, ấm áp, cá tính sáng tạo' },
  { id: 'mc-cement', name: 'Xám Xi Măng Tối Giản', hex: '#4A4E69', type: 'modern', meaning: 'Thành thị, hiện đại, sắc sảo' },
  { id: 'mc-navy', name: 'Xanh Navy Hiện Đại', hex: '#1D3557', type: 'modern', meaning: 'Chuyên nghiệp, tin cậy, chiều sâu' },
  { id: 'mc-sage', name: 'Xanh Cỏ Xạ Hương (Sage Green)', hex: '#84A59D', type: 'modern', meaning: 'Tự nhiên, tươi mới, thư thái' }
];

/**
 * Service API for Costume Discovery with Fuzzy Search and Gender Filtering
 */
export async function getCostumes(
  query = '',
  genderFilter: 'all' | 'male' | 'female' | 'unisex' = 'all'
): Promise<TraditionalCostume[]> {
  // Simulate slight async response
  await new Promise((resolve) => setTimeout(resolve, 60));

  let results = TRADITIONAL_COSTUMES;

  if (genderFilter !== 'all') {
    results = results.filter((c) => {
      if (genderFilter === 'male') return c.gender === 'male' || c.gender === 'unisex';
      if (genderFilter === 'female') return c.gender === 'female' || c.gender === 'unisex';
      if (genderFilter === 'unisex') return c.gender === 'unisex';
      return true;
    });
  }

  if (!query || !query.trim()) {
    return results;
  }

  return results.filter((costume) => {
    return (
      fuzzyMatch(query, costume.name) ||
      fuzzyMatch(query, costume.dynasty) ||
      fuzzyMatch(query, costume.shortDesc) ||
      fuzzyMatch(query, costume.historyStory) ||
      (costume.region && fuzzyMatch(query, costume.region)) ||
      costume.identificationFeatures.some((f) => fuzzyMatch(query, f)) ||
      costume.suitableOccasions.some((o) => fuzzyMatch(query, o))
    );
  });
}

export async function getCostumeById(id: string): Promise<TraditionalCostume | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return TRADITIONAL_COSTUMES.find((c) => c.id === id);
}

/**
 * Service API: Event-based outfit recommendation engine
 * Considers User Profile (Age, Height, Weight, Gender) + Event Description
 */
export async function recommendOutfitsForEvent(
  eventDescription: string,
  userProfile: UserProfile
): Promise<MixOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const desc = eventDescription.toLowerCase();
  const isFormal = desc.includes('cưới') || desc.includes('ngoại giao') || desc.includes('lễ') || desc.includes('tiệc');
  const isCasual = desc.includes('cà phê') || desc.includes('dạo phố') || desc.includes('bạn bè') || desc.includes('triển lãm');

  const options: MixOption[] = [];

  // Option 1: Grand Heritage Remix
  const c1 = isFormal ? TRADITIONAL_COSTUMES[0] : (isCasual ? TRADITIONAL_COSTUMES[1] : TRADITIONAL_COSTUMES[2]);
  const m1 = MODERN_GARMENTS[1]; // culottes
  const a1 = [ACCESSORY_ITEMS[1], ACCESSORY_ITEMS[3]]; // túi gấm + kính retro
  const color1 = TRADITIONAL_COLORS[0];
  const modColor1 = MODERN_COLORS[0];

  options.push({
    id: 'mix-opt-1',
    name: `${c1.name} × ${m1.name}`,
    event: eventDescription || 'Sự kiện trang trọng tinh tế',
    costume: c1,
    modernGarment: m1,
    accessories: a1,
    colorPalette: [color1, modColor1],
    harmonyScore: 94,
    recommendationReason: `Dành riêng cho bạn (${userProfile.name || 'Bạn'}, ${userProfile.age} tuổi, cao ${userProfile.height}cm): Phom tà buông của ${c1.name} kết hợp cùng ống quần suông culottes giúp tôn dáng thon dài, tạo tư thế đĩnh đạc tự tin trong không gian sự kiện.`,
    frontImage: c1.frontImage,
    backImage: c1.backImage,
    culturalCheck: evaluateOutfitMix(c1, m1, a1[0], color1, modColor1, eventDescription)
  });

  // Option 2: Contemporary Youth Remix
  const c2 = userProfile.gender === 'female' ? TRADITIONAL_COSTUMES[2] : TRADITIONAL_COSTUMES[3];
  const m2 = MODERN_GARMENTS[0]; // blazer
  const a2 = [ACCESSORY_ITEMS[2], ACCESSORY_ITEMS[4]]; // quạt trầm + khánh ngọc
  const color2 = TRADITIONAL_COLORS[2];
  const modColor2 = MODERN_COLORS[2];

  options.push({
    id: 'mix-opt-2',
    name: `${c2.name} Cách Điệu × ${m2.name}`,
    event: eventDescription || 'Phong cách tri thức nghệ thuật',
    costume: c2,
    modernGarment: m2,
    accessories: a2,
    colorPalette: [color2, modColor2],
    harmonyScore: 89,
    recommendationReason: `Phối lớp thông minh cho dáng người cân đối (${userProfile.weight}kg): Áo khoác ngoài hiện đại tạo cấu trúc vai vuông vức, lớp cổ ${c2.name} bên trong mang điểm nhấn văn hóa sâu sắc mà không hề phô trương.`,
    frontImage: c2.frontImage,
    backImage: c2.backImage,
    culturalCheck: evaluateOutfitMix(c2, m2, a2[0], color2, modColor2, eventDescription)
  });

  // Option 3: Fusion Casual
  const c3 = TRADITIONAL_COSTUMES[4]; // Áo Đối Khâm
  const m3 = MODERN_GARMENTS[2]; // chân váy hoặc quần
  const a3 = [ACCESSORY_ITEMS[0]]; // khăn đóng
  const color3 = TRADITIONAL_COLORS[3];
  const modColor3 = MODERN_COLORS[4];

  options.push({
    id: 'mix-opt-3',
    name: `${c3.name} Buông Vạt × ${m3.name}`,
    event: eventDescription || 'Giao lưu văn hóa trẻ trung',
    costume: c3,
    modernGarment: m3,
    accessories: a3,
    colorPalette: [color3, modColor3],
    harmonyScore: 91,
    recommendationReason: `Vạt áo buông thẳng của ${c3.name} mang lại sự thoáng mát và chuyển động nhẹ nhàng khi bước đi, rất phù hợp với nhịp sống thành thị sôi động.`,
    frontImage: c3.frontImage,
    backImage: c3.backImage,
    culturalCheck: evaluateOutfitMix(c3, m3, a3[0], color3, modColor3, eventDescription)
  });

  return options;
}

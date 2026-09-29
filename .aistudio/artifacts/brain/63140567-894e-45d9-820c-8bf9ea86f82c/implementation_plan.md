# Kế Hoạch Triển Khai: Tải Ảnh Bộ Đồ Tự Phối / Tự Thiết Kế Lên Nhận Xét & Chấm Điểm AI

## 1. Mục Tiêu & Bối Cảnh
Người dùng cần một không gian trực quan để tải lên bức ảnh bộ Việt Phục do chính họ tự phối (phối đồ hiện đại với cổ phục, tự thiết kế cách tân, hoặc ảnh chụp thực tế khi mặc cổ phục) và nhận được bảng đánh giá, chấm điểm chi tiết từ Hội đồng Thẩm định Di sản AI ("Nếp AI").

## 2. Kiến Trúc & Luồng Trải Nghiệm (UX Flow)

### A. Vị Trí Truy Cập Toàn Diện (Navigation & Discoverability)
1. **Thanh điều hướng Mobile (`BottomNav.tsx`)**:
   - Bổ sung tab **Chấm điểm** (biểu tượng `Award` huân chương di sản) vào thanh điều hướng cố định dưới màn hình, giúp người dùng mở ngay tính năng trên điện thoại.
2. **Thanh điều hướng Desktop & Tablet (`Navbar.tsx`)**:
   - Đưa nút **Chấm điểm** ra vị trí nổi bật cho mọi kích thước màn hình (gỡ bỏ giới hạn `hidden xl:flex`), hiển thị rõ ràng trên cả laptop, tablet và màn hình lớn.
3. **Trong Xưởng Phối Đồ (`MixSection.tsx`)**:
   - Bổ sung nút chuyển đổi chế độ thứ 3: **"Thẩm định & Chấm điểm"** cạnh hai chế độ hiện có (*"Theo sự kiện"* và *"Phối tự do (Canvas)"*).
   - Trong giao diện bàn vẽ Canvas (`CanvasMixFlow.tsx`), thêm nút hành động nhanh: **"Chấm điểm bộ đồ này"** để người dùng sau khi phối xong có thể đưa ngay vào phòng thẩm định AI mà không cần tải ảnh về máy rồi upload lại.

### B. Ba Nguồn Đưa Ảnh Vào Chấm Điểm (Multi-source Input)
1. **Tải tệp ảnh từ thiết bị**:
   - Hỗ trợ kéo thả hoặc chọn ảnh định dạng JPG, PNG, WEBP từ điện thoại/máy tính.
   - Giới hạn dung lượng tối ưu, tự động nén kích thước hiển thị mượt mà.
2. **Chụp trực tiếp bằng Camera**:
   - Tích hợp luồng chụp ảnh nhanh với hộp thoại xin quyền thân thiện (`PermissionModal`).
   - Khung căn chỉnh dáng người, hẹn giờ đếm ngược 5 giây và xem lại ảnh chụp trước khi gửi chấm điểm.
3. **Lấy trực tiếp từ Bàn vẽ Canvas 2D**:
   - Tự động trích xuất các lớp áo, quần, phụ kiện đang phối trên bàn vẽ 2D thành ảnh tổ hợp (composite snapshot) và điền sẵn ngữ cảnh để AI chấm điểm tức thì.
4. **Mẫu demo có sẵn**:
   - Duy trì 4 bộ ảnh mẫu tiêu biểu (Áo Tấc, Nhật Bình, Ngũ Thân, Tứ Thân) để người dùng thử nghiệm nhanh.

### C. Cơ Chế Thẩm Định & Nhận Xét Của AI
- Sử dụng mô hình đa phương thức Gemini (`gemini-3.5-flash`) tại API `/api/gemini/evaluate-outfit`.
- **4 Chiều thẩm định chuyên môn**:
  1. *Độ hài hòa thẩm mỹ & Phom dáng (Harmony)*: Tỉ lệ cơ thể, chiều dài tà áo, độ buông rủ, phối màu ngũ sắc.
  2. *Chuẩn mực lịch sử & Điển chế (Authenticity)*: Nhận diện cấu trúc cổ áo (lập lĩnh, giao lĩnh, viên lĩnh...), tay áo, cúc cài, tính kế thừa văn hóa.
  3. *Phối phụ kiện & Chi tiết (Accessories)*: Khăn vấn, nón ba tầm, kiềng bạc, hài thêu, quạt gấm.
  4. *Độ phù hợp dịp mặc & Bối cảnh (Occasion & Venue Fit)*: Đánh giá với lễ cưới, lễ Tết, dạ tiệc, dạo phố di sản.
- **Lời khuyên nâng tầm trang phục (Actionable Tips)**:
  - Điểm mạnh & Điểm cần gia giảm.
  - Phụ kiện gợi ý bổ sung.
  - Địa điểm di sản chụp ảnh tôn vinh bộ đồ nhất (liên kết mở sang Bản đồ di sản).
- **Hỗ trợ Micro giọng nói (`VoiceInputButton`)**:
  - Nhập bằng giọng nói tiếng Việt cho phần ghi chú thêm hoặc mô tả dịp mặc dự kiến.

## 3. Các Bước Thực Hiện Chi Tiết
1. **Bước 1**: Cập nhật `BottomNav.tsx` và `Navbar.tsx` để hiển thị tab "Chấm điểm" xuyên suốt trên mọi thiết bị.
2. **Bước 2**: Bổ sung kết nối từ `MixSection.tsx` và `CanvasMixFlow.tsx` sang chế độ chấm điểm (`critique`).
3. **Bước 3**: Nâng cấp `OutfitCritiqueSection.tsx` hỗ trợ đủ 3 nguồn ảnh (Upload máy, Camera chụp trực tiếp với `CameraFlowModal`, và Nạp ảnh từ bàn vẽ Canvas).
4. **Bước 4**: Tích hợp `VoiceInputButton` cho phần mô tả ngữ cảnh dịp mặc/địa điểm.
5. **Bước 5**: Kiểm thử build (`compile_applet`), kiểm tra cú pháp (`lint_applet`), và kiểm tra dev server.

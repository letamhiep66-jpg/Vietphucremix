/**
 * Layer Asset Helper for 2D Game Mannequin Dress-up System
 * Provides precise SVG data URIs with transparent backgrounds, 
 * accurate proportions (3:4 aspect ratio / 400x800 coordinate system),
 * and cultural silhouette styling for Vietnamese traditional and contemporary garments.
 */

// Utility to turn raw SVG string into clean data URI
export function svgToDataUri(svgContent: string): string {
  const cleanSvg = svgContent.replace(/\n\s*/g, ' ').trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

// 1. Base Mannequin Avatars (3:4 ratio, 400 x 800 viewBox)
export function getBaseAvatarSvg(gender: 'male' | 'female'): string {
  if (gender === 'female') {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
        <defs>
          <linearGradient id="fem-skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDF2E9"/>
            <stop offset="100%" stop-color="#F5DDC7"/>
          </linearGradient>
          <linearGradient id="fem-hair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2D201C"/>
            <stop offset="100%" stop-color="#140D0B"/>
          </linearGradient>
          <linearGradient id="fem-undergarment" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#EEDAC5"/>
            <stop offset="100%" stop-color="#D8BA9D"/>
          </linearGradient>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#552B18" flood-opacity="0.15"/>
          </filter>
        </defs>

        <g id="female-mannequin" filter="url(#soft-shadow)">
          <!-- Hair Back (Top bun / flowing back) -->
          <ellipse cx="200" cy="118" rx="42" ry="46" fill="url(#fem-hair)"/>
          <circle cx="200" cy="74" r="22" fill="url(#fem-hair)"/>
          <!-- Hair pin stick hint -->
          <line x1="175" y1="62" x2="225" y2="76" stroke="#C59B27" stroke-width="3" stroke-linecap="round"/>
          <circle cx="225" cy="76" r="3.5" fill="#D62828"/>

          <!-- Legs & Feet -->
          <!-- Left Leg -->
          <path d="M 183 480 Q 180 570 178 640 Q 176 700 176 735 Q 176 750 170 754 L 186 754 Q 192 730 193 640 Q 195 560 196 480 Z" fill="url(#fem-skin)"/>
          <!-- Right Leg -->
          <path d="M 204 480 Q 205 560 207 640 Q 208 730 214 754 L 230 754 Q 224 750 224 735 Q 224 700 222 640 Q 220 570 217 480 Z" fill="url(#fem-skin)"/>

          <!-- Body Torso & Hips -->
          <!-- Shoulders: width approx 110px (145 to 255) -->
          <path d="M 175 180 Q 148 190 142 215 Q 138 238 144 280 Q 150 320 156 348 Q 165 390 172 440 L 176 480 Q 188 495 200 495 Q 212 495 224 480 L 228 440 Q 235 390 244 348 Q 250 320 256 280 Q 262 238 258 215 Q 252 190 225 180 Z" fill="url(#fem-skin)"/>

          <!-- Neutral base undergarment (soft slip) -->
          <path d="M 152 260 Q 200 280 248 260 L 240 370 Q 200 380 160 370 Z" fill="url(#fem-undergarment)" opacity="0.6"/>

          <!-- Arms & Hands -->
          <!-- Left Arm (graceful slope) -->
          <path d="M 142 215 Q 128 270 122 340 Q 118 400 115 440 Q 113 456 116 465 Q 120 458 124 440 Q 130 380 138 310 Q 142 270 146 225 Z" fill="url(#fem-skin)"/>
          <!-- Right Arm -->
          <path d="M 258 215 Q 272 270 278 340 Q 282 400 285 440 Q 287 456 284 465 Q 280 458 276 440 Q 270 380 262 310 Q 258 270 254 225 Z" fill="url(#fem-skin)"/>

          <!-- Neck -->
          <path d="M 186 160 L 186 195 Q 200 200 214 195 L 214 160 Z" fill="url(#fem-skin)"/>
          <path d="M 188 178 Q 200 184 212 178" stroke="#E5C7AE" stroke-width="1.5" fill="none"/>

          <!-- Head & Delicate Face -->
          <path d="M 166 122 Q 166 84 200 84 Q 234 84 234 122 Q 234 160 200 164 Q 166 160 166 122 Z" fill="url(#fem-skin)"/>

          <!-- Hair Front bangs/parting -->
          <path d="M 166 114 Q 185 96 200 102 Q 215 96 234 114 Q 232 90 200 86 Q 168 90 166 114 Z" fill="url(#fem-hair)"/>

          <!-- Minimalist Face Features (Eyes, Eyebrows, Lips) -->
          <path d="M 180 118 Q 186 116 192 118" stroke="#684A3B" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M 208 118 Q 214 116 220 118" stroke="#684A3B" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M 181 126 Q 186 130 191 126" stroke="#463126" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M 209 126 Q 214 130 219 126" stroke="#463126" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M 198 132 L 201 138 L 199 140" stroke="#CCA489" stroke-width="1.5" fill="none"/>
          <path d="M 194 148 Q 200 152 206 148" stroke="#D65A5A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- Blush -->
          <circle cx="178" cy="134" r="5" fill="#E76F51" opacity="0.25"/>
          <circle cx="222" cy="134" r="5" fill="#E76F51" opacity="0.25"/>
        </g>
      </svg>
    `);
  }

  // Male Mannequin (Broad shoulders, dignified stance)
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
      <defs>
        <linearGradient id="male-skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCEEE2"/>
          <stop offset="100%" stop-color="#EED3BD"/>
        </linearGradient>
        <linearGradient id="male-hair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#241E1C"/>
          <stop offset="100%" stop-color="#0F0C0B"/>
        </linearGradient>
        <linearGradient id="male-undergarment" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#E2D0BE"/>
          <stop offset="100%" stop-color="#CDAE96"/>
        </linearGradient>
        <filter id="soft-shadow-male" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#402010" flood-opacity="0.18"/>
        </filter>
      </defs>

      <g id="male-mannequin" filter="url(#soft-shadow-male)">
        <!-- Hair Base / Top knot for traditional male look -->
        <circle cx="200" cy="72" r="16" fill="url(#male-hair)"/>
        <ellipse cx="200" cy="116" rx="44" ry="46" fill="url(#male-hair)"/>

        <!-- Legs & Feet (Sturdy stance) -->
        <!-- Left Leg -->
        <path d="M 178 470 Q 174 570 172 650 Q 170 710 168 745 L 186 745 Q 192 710 193 650 Q 196 570 198 470 Z" fill="url(#male-skin)"/>
        <!-- Right Leg -->
        <path d="M 202 470 Q 204 570 207 650 Q 208 710 214 745 L 232 745 Q 230 710 228 650 Q 226 570 222 470 Z" fill="url(#male-skin)"/>

        <!-- Strong Torso & Broad Shoulders (width approx 140px: 130 to 270) -->
        <path d="M 178 175 Q 138 185 130 215 Q 128 245 136 295 Q 146 345 155 385 Q 165 425 170 470 L 200 480 L 230 470 Q 235 425 245 385 Q 254 345 264 295 Q 272 245 270 215 Q 262 185 222 175 Z" fill="url(#male-skin)"/>

        <!-- Neutral undergarment -->
        <path d="M 144 265 L 256 265 L 246 395 L 154 395 Z" fill="url(#male-undergarment)" opacity="0.6"/>

        <!-- Arms -->
        <!-- Left Arm -->
        <path d="M 130 215 Q 116 280 110 350 Q 106 410 104 445 L 118 445 Q 124 410 128 350 Q 134 280 140 225 Z" fill="url(#male-skin)"/>
        <!-- Right Arm -->
        <path d="M 270 215 Q 284 280 290 350 Q 294 410 296 445 L 282 445 Q 276 410 272 350 Q 266 280 260 225 Z" fill="url(#male-skin)"/>

        <!-- Strong Neck -->
        <path d="M 183 155 L 183 185 Q 200 190 217 185 L 217 155 Z" fill="url(#male-skin)"/>

        <!-- Head -->
        <path d="M 164 118 Q 164 82 200 82 Q 236 82 236 118 Q 236 156 200 162 Q 164 156 164 118 Z" fill="url(#male-skin)"/>

        <!-- Short neat hairline -->
        <path d="M 166 112 Q 185 94 200 96 Q 215 94 234 112 Q 230 88 200 84 Q 170 88 166 112 Z" fill="url(#male-hair)"/>

        <!-- Dignified Face (Masculine eyebrows, eyes, mouth) -->
        <path d="M 176 116 L 192 114" stroke="#3D291F" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 208 114 L 224 116" stroke="#3D291F" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 178 124 Q 185 127 192 124" stroke="#2B1A13" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 208 124 Q 215 127 222 124" stroke="#2B1A13" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 197 128 L 201 138 L 198 141" stroke="#BA9174" stroke-width="1.8" fill="none"/>
        <path d="M 192 148 Q 200 150 208 148" stroke="#B85D56" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      </g>
    </svg>
  `);
}

// 2. Background Themes (Z-0)
export function getBackgroundSvg(theme: 'hue' | 'hoian' | 'thanglong' | 'studio' | 'palace' | 'lotus' | 'garden'): string {
  // 1. CỐ ĐÔ HUẾ (Hoàng cung son thắm, ngói hoàng lưu ly)
  if (theme === 'hue' || theme === 'palace') {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
        <defs>
          <linearGradient id="hue-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#24100D"/>
            <stop offset="45%" stop-color="#4E1D16"/>
            <stop offset="100%" stop-color="#1B0A08"/>
          </linearGradient>
          <radialGradient id="hue-glow" cx="50%" cy="32%" r="55%">
            <stop offset="0%" stop-color="#F4A261" stop-opacity="0.45"/>
            <stop offset="40%" stop-color="#9B2226" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#hue-sky)"/>
        <circle cx="200" cy="270" r="170" fill="url(#hue-glow)"/>
        <!-- Cố Đô Cung Điện Mái Ngói Lưu Ly Silhouette -->
        <g stroke="#E9C46A" stroke-width="1.2" opacity="0.22" fill="none">
          <!-- Mái điện cong cung đình -->
          <path d="M 50 200 Q 120 180 200 180 Q 280 180 350 200 Q 370 190 350 175 Q 280 160 200 160 Q 120 160 50 175 Q 30 190 50 200 Z" fill="#9B2226" fill-opacity="0.35"/>
          <path d="M 90 270 Q 150 255 200 255 Q 250 255 310 270 Q 325 260 310 250 Q 250 240 200 240 Q 150 240 90 250 Q 75 260 90 270 Z" fill="#E9C46A" fill-opacity="0.15"/>
          <!-- Cửa võng cung đình & Chấn song -->
          <rect x="45" y="80" width="310" height="600" rx="20"/>
          <circle cx="200" cy="270" r="140"/>
          <circle cx="200" cy="270" r="90"/>
          <line x1="200" y1="80" x2="200" y2="680"/>
          <line x1="45" y1="270" x2="355" y2="270"/>
        </g>
        <!-- Bệ đá Đại Nội -->
        <ellipse cx="200" cy="745" rx="145" ry="26" fill="#120705" opacity="0.75"/>
        <ellipse cx="200" cy="740" rx="125" ry="18" fill="#3D1812" opacity="0.5"/>
      </svg>
    `);
  }

  // 2. PHỐ CỔ HỘI AN (Tường vàng hoàng yến, đèn lồng lung linh)
  if (theme === 'hoian') {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
        <defs>
          <linearGradient id="hoian-wall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4A3B18"/>
            <stop offset="35%" stop-color="#9C7728"/>
            <stop offset="70%" stop-color="#6E5118"/>
            <stop offset="100%" stop-color="#241B08"/>
          </linearGradient>
          <radialGradient id="lantern-light" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#FFD166" stop-opacity="0.5"/>
            <stop offset="50%" stop-color="#E76F51" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#hoian-wall)"/>
        <circle cx="200" cy="260" r="180" fill="url(#lantern-light)"/>
        <!-- Đèn lồng Hội An đung đưa -->
        <!-- Đèn lồng trái -->
        <g opacity="0.7">
          <line x1="80" y1="0" x2="80" y2="120" stroke="#2C241D" stroke-width="2"/>
          <ellipse cx="80" cy="145" rx="22" ry="28" fill="#E76F51"/>
          <line x1="80" y1="173" x2="80" y2="195" stroke="#E9C46A" stroke-width="2"/>
        </g>
        <!-- Đèn lồng phải -->
        <g opacity="0.7">
          <line x1="320" y1="0" x2="320" y2="90" stroke="#2C241D" stroke-width="2"/>
          <ellipse cx="320" cy="112" rx="20" ry="24" fill="#F4A261"/>
          <line x1="320" y1="136" x2="320" y2="158" stroke="#E76F51" stroke-width="2"/>
        </g>
        <!-- Mái ngói âm dương rêu phong Hội An -->
        <path d="M 20 80 Q 200 65 380 80 L 380 110 Q 200 95 20 110 Z" fill="#3D291F" opacity="0.5"/>
        <!-- Cửa gỗ bức bàn cổ kính -->
        <g stroke="#D4A373" stroke-width="1.2" opacity="0.25" fill="none">
          <rect x="50" y="140" width="300" height="540" rx="12"/>
          <rect x="70" y="160" width="115" height="490" rx="6"/>
          <rect x="215" y="160" width="115" height="490" rx="6"/>
        </g>
        <!-- Nền gạch Bát Tràng / Vỉa hè phố cổ -->
        <ellipse cx="200" cy="746" rx="145" ry="24" fill="#1A1208" opacity="0.7"/>
        <ellipse cx="200" cy="742" rx="120" ry="16" fill="#473216" opacity="0.45"/>
      </svg>
    `);
  }

  // 3. HOÀNG THÀNH THĂNG LONG (Gạch cổ Đoan Môn, hoa sen & lá đề thời Lý)
  if (theme === 'thanglong' || theme === 'lotus') {
    return svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
        <defs>
          <linearGradient id="thanglong-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1F2A28"/>
            <stop offset="40%" stop-color="#364944"/>
            <stop offset="100%" stop-color="#121817"/>
          </linearGradient>
          <radialGradient id="lotus-glow" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stop-color="#F2CC8F" stop-opacity="0.4"/>
            <stop offset="50%" stop-color="#81B29A" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#thanglong-sky)"/>
        <circle cx="200" cy="260" r="160" fill="url(#lotus-glow)"/>
        <!-- Cửa vòm Đoan Môn Hoàng Thành Thăng Long -->
        <g stroke="#E9C46A" stroke-width="1.2" opacity="0.25" fill="none">
          <!-- Vòm cuốn cửa thành -->
          <path d="M 90 680 L 90 340 A 110 110 0 0 1 310 340 L 310 680" stroke-width="2"/>
          <path d="M 115 680 L 115 355 A 85 85 0 0 1 285 355 L 285 680"/>
          <!-- Họa tiết hoa sen & lá đề thời Lý -->
          <circle cx="200" cy="220" r="45"/>
          <path d="M 200 175 Q 225 210 200 235 Q 175 210 200 175 Z" fill="#E9C46A" fill-opacity="0.2"/>
          <!-- Rồng thời Lý uốn lượn chìm -->
          <path d="M 70 120 Q 140 90 200 120 Q 260 150 330 110" stroke-width="1.5" opacity="0.4"/>
        </g>
        <!-- Bệ đá Thăng Long ngàn năm -->
        <ellipse cx="200" cy="746" rx="145" ry="24" fill="#0C1211" opacity="0.75"/>
        <ellipse cx="200" cy="742" rx="120" ry="16" fill="#243330" opacity="0.5"/>
      </svg>
    `);
  }

  // 4. STUDIO TỐI GIẢN (Minimalist Silk Canvas Studio)
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
      <defs>
        <radialGradient id="studio-spotlight" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#FAF5EE"/>
          <stop offset="45%" stop-color="#EFE6D7"/>
          <stop offset="85%" stop-color="#D9C9B4"/>
          <stop offset="100%" stop-color="#BFAF9B"/>
        </radialGradient>
      </defs>
      <rect width="400" height="800" fill="url(#studio-spotlight)"/>
      <!-- Khung viền chỉ son mỹ thuật tối giản -->
      <rect x="35" y="60" width="330" height="660" rx="16" fill="none" stroke="#800E13" stroke-width="0.8" opacity="0.15"/>
      <circle cx="200" cy="280" r="140" fill="none" stroke="#CBB9A1" stroke-width="0.6" opacity="0.25"/>
      <!-- Bục đứng studio tinh tế -->
      <ellipse cx="200" cy="748" rx="140" ry="22" fill="#756250" opacity="0.22"/>
      <ellipse cx="200" cy="744" rx="100" ry="14" fill="#423428" opacity="0.28"/>
    </svg>
  `);
}

// 3. Layer Item Generator for Traditional & Modern pieces
export function getGarmentOverlaySvg(itemId: string, tintColor?: string): string {
  const color = tintColor || '#9B2226';

  switch (itemId) {
    // === ÁO TRUYỀN THỐNG (Z-40 OUTER TOPS) ===
    case 'ao-dai-truyen-thong':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="ad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#540B0E"/>
            </linearGradient>
            <filter id="ad-drop" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <g id="ao-dai-nu" filter="url(#ad-drop)">
            <!-- Collar Lập Lĩnh (Standing high neck) -->
            <path d="M 184 162 C 184 150 216 150 216 162 L 217 178 C 200 182 200 182 183 178 Z" fill="${color}" stroke="#FFE6A7" stroke-width="1.5"/>
            
            <!-- Raglan Sleeves Left & Right -->
            <path d="M 184 175 L 140 215 L 118 335 L 132 342 L 152 255 L 160 215 Z" fill="url(#ad-grad)"/>
            <path d="M 216 175 L 260 215 L 282 335 L 268 342 L 248 255 L 240 215 Z" fill="url(#ad-grad)"/>

            <!-- Fitted Bodice with Waist Cinch -->
            <path d="M 184 175 L 216 175 L 245 250 L 235 340 L 165 340 L 155 250 Z" fill="url(#ad-grad)"/>

            <!-- Buttons on Right Shoulder to Waist (Hàng khuy bấm) -->
            <path d="M 200 178 Q 224 195 240 225 Q 236 280 234 340" stroke="#FFE6A7" stroke-width="1.8" stroke-dasharray="2,6" fill="none"/>

            <!-- Front & Back Flowing Flaps (Tà áo dài buông qua gối) -->
            <path d="M 166 340 Q 155 480 148 640 L 252 640 Q 245 480 234 340 Z" fill="url(#ad-grad)"/>
            <!-- Hem detail -->
            <path d="M 148 640 Q 200 648 252 640" stroke="#FFE6A7" stroke-width="2" fill="none"/>

            <!-- Subtle silk highlight curve -->
            <path d="M 180 210 Q 192 340 185 580" stroke="#FFFFFF" stroke-width="2" opacity="0.2" fill="none"/>
          </g>
        </svg>
      `);

    case 'ao-dai-ngu-than-nam':
    case 'ao-ngu-than':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="nt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#141E28"/>
            </linearGradient>
            <filter id="nt-shadow">
              <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000" flood-opacity="0.3"/>
            </filter>
          </defs>
          <g id="ao-ngu-than" filter="url(#nt-shadow)">
            <!-- Square Standing Collar (Cổ Lập Lĩnh Nam) -->
            <path d="M 180 156 L 220 156 L 222 178 L 178 178 Z" fill="${color}" stroke="#D4AF37" stroke-width="2"/>
            
            <!-- Broad Sleeves (Tay Chẽn) -->
            <path d="M 180 176 L 126 215 L 105 348 L 122 355 L 142 260 L 158 215 Z" fill="url(#nt-grad)"/>
            <path d="M 220 176 L 274 215 L 295 348 L 278 355 L 258 260 L 242 215 Z" fill="url(#nt-grad)"/>

            <!-- 5-flap Robe Torso (Straight Cut, Masculine Chữ Nhân) -->
            <path d="M 178 176 L 222 176 L 260 280 L 256 420 L 268 650 L 132 650 L 144 420 L 140 280 Z" fill="url(#nt-grad)"/>

            <!-- 5 Buttons from Neck to Right Flap (Ngũ cúc) -->
            <circle cx="204" cy="170" r="3" fill="#D4AF37"/>
            <circle cx="225" cy="195" r="3" fill="#D4AF37"/>
            <circle cx="236" cy="230" r="3" fill="#D4AF37"/>
            <circle cx="242" cy="275" r="3" fill="#D4AF37"/>
            <circle cx="244" cy="325" r="3" fill="#D4AF37"/>

            <!-- Right flap overlapping left flap line -->
            <path d="M 204 170 Q 235 210 244 325 L 246 650" stroke="#000000" stroke-width="1.5" opacity="0.35" fill="none"/>
            <path d="M 132 650 Q 200 660 268 650" stroke="#D4AF37" stroke-width="1.8" fill="none"/>
          </g>
        </svg>
      `);

    case 'ao-tac':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="tac-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#3A080A"/>
            </linearGradient>
            <filter id="tac-shadow">
              <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.35"/>
            </filter>
          </defs>
          <g id="ao-tac" filter="url(#tac-shadow)">
            <!-- Grand Collar -->
            <path d="M 180 154 L 220 154 L 222 178 L 178 178 Z" fill="${color}" stroke="#E9C46A" stroke-width="2.5"/>
            
            <!-- Extra Wide Flowing Sleeves (Tay Thụng Rộng 50cm) -->
            <!-- Left Wide Sleeve -->
            <path d="M 180 176 L 120 215 L 75 330 L 70 480 Q 120 460 145 360 L 155 240 Z" fill="url(#tac-grad)"/>
            <!-- Right Wide Sleeve -->
            <path d="M 220 176 L 280 215 L 325 330 L 330 480 Q 280 460 255 360 L 245 240 Z" fill="url(#tac-grad)"/>

            <!-- Grand Imperial Body -->
            <path d="M 178 176 L 222 176 L 265 260 L 268 450 L 280 670 L 120 670 L 132 450 L 135 260 Z" fill="url(#tac-grad)"/>

            <!-- Gold Brocade Trimming (Viền gấm hoàng gia) -->
            <path d="M 70 480 Q 120 460 145 360" stroke="#E9C46A" stroke-width="2.5" fill="none"/>
            <path d="M 330 480 Q 280 460 255 360" stroke="#E9C46A" stroke-width="2.5" fill="none"/>
            <path d="M 120 670 Q 200 682 280 670" stroke="#E9C46A" stroke-width="3" fill="none"/>

            <!-- 5 Buttons -->
            <circle cx="204" cy="170" r="3.5" fill="#FFE6A7"/>
            <circle cx="225" cy="195" r="3.5" fill="#FFE6A7"/>
            <circle cx="238" cy="235" r="3.5" fill="#FFE6A7"/>
            <circle cx="246" cy="285" r="3.5" fill="#FFE6A7"/>
            <circle cx="250" cy="340" r="3.5" fill="#FFE6A7"/>
          </g>
        </svg>
      `);

    case 'ao-tu-than':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="tt-outer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#4B3B2B"/>
            </linearGradient>
          </defs>
          <g id="ao-tu-than">
            <!-- Sleeves -->
            <path d="M 180 180 L 134 215 L 115 340 L 130 345 L 148 260 Z" fill="url(#tt-outer)"/>
            <path d="M 220 180 L 266 215 L 285 340 L 270 345 L 252 260 Z" fill="url(#tt-outer)"/>

            <!-- Two Back Flaps (Sewn along center spine) -->
            <path d="M 160 220 L 140 640 L 260 640 L 240 220 Z" fill="url(#tt-outer)" opacity="0.95"/>
            <line x1="200" y1="220" x2="200" y2="640" stroke="#000" stroke-width="1.5" opacity="0.4"/>

            <!-- Two Front Flaps (Tied in Front Knot at Waist) -->
            <!-- Left front flap -->
            <path d="M 175 180 L 150 250 L 160 360 Q 185 385 198 375 L 180 470 L 165 465 L 180 375 L 145 250 Z" fill="${color}"/>
            <!-- Right front flap -->
            <path d="M 225 180 L 250 250 L 240 360 Q 215 385 202 375 L 220 470 L 235 465 L 220 375 L 255 250 Z" fill="${color}"/>

            <!-- Silk Belt / Dải Ruột Tượng Ngũ Sắc -->
            <path d="M 162 360 Q 200 372 238 360 L 236 376 Q 200 388 164 376 Z" fill="#2A9D8F"/>
            <path d="M 194 374 L 190 490 L 202 490 L 206 374 Z" fill="#E76F51"/>
          </g>
        </svg>
      `);

    case 'ao-nhat-binh':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="nb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#480CA8"/>
            </linearGradient>
            <filter id="nb-glow">
              <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#E9C46A" flood-opacity="0.3"/>
            </filter>
          </defs>
          <g id="ao-nhat-binh" filter="url(#nb-glow)">
            <!-- Robe Base -->
            <path d="M 178 175 L 222 175 L 260 260 L 264 450 L 272 650 L 128 650 L 136 450 L 140 260 Z" fill="url(#nb-grad)"/>

            <!-- Sleeves -->
            <path d="M 178 175 L 120 215 L 85 340 L 105 348 L 135 250 Z" fill="url(#nb-grad)"/>
            <path d="M 222 175 L 280 215 L 315 340 L 295 348 L 265 250 Z" fill="url(#nb-grad)"/>

            <!-- Famous 5-Element Wristbands (Viền Ngũ Sắc Cổ Tay) -->
            <!-- Left Wristband -->
            <path d="M 85 340 L 105 348 L 102 342 L 87 334 Z" fill="#E63946"/>
            <path d="M 88 334 L 102 342 L 99 336 L 90 328 Z" fill="#F1FAEE"/>
            <path d="M 90 328 L 99 336 L 96 330 L 92 322 Z" fill="#E9C46A"/>
            <!-- Right Wristband -->
            <path d="M 315 340 L 295 348 L 298 342 L 313 334 Z" fill="#E63946"/>
            <path d="M 312 334 L 298 342 L 301 336 L 310 328 Z" fill="#F1FAEE"/>
            <path d="M 310 328 L 301 336 L 304 330 L 308 322 Z" fill="#E9C46A"/>

            <!-- Rectangular Collar (Cổ Chữ Nhật Nhật Bình Bản To Thêu Phượng) -->
            <path d="M 175 165 L 225 165 L 225 290 L 175 290 Z" fill="#E9C46A" stroke="#B8860B" stroke-width="2"/>
            <rect x="186" y="175" width="28" height="105" fill="#FAF0CA" stroke="#D4AF37" stroke-width="1.5"/>

            <!-- Phoenix & cloud embroidery pattern hint -->
            <circle cx="200" cy="210" r="8" fill="#D62828"/>
            <path d="M 194 210 Q 200 200 206 210" stroke="#FFE6A7" stroke-width="2" fill="none"/>
            <circle cx="200" cy="250" r="7" fill="#0077B6"/>

            <!-- 2 Long Ribbons Falling Down Waist (Hai Dải Buông / Dải Phốc) -->
            <rect x="184" y="290" width="12" height="230" fill="#E9C46A" stroke="#B8860B" stroke-width="1"/>
            <rect x="204" y="290" width="12" height="230" fill="#E9C46A" stroke="#B8860B" stroke-width="1"/>
          </g>
        </svg>
      `);

    case 'ao-doi-kham':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="dk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#283618"/>
            </linearGradient>
          </defs>
          <g id="ao-doi-kham">
            <!-- Flowing Open Sleeves -->
            <path d="M 180 178 L 125 215 L 90 350 L 115 360 L 140 260 Z" fill="url(#dk-grad)"/>
            <path d="M 220 178 L 275 215 L 310 350 L 285 360 L 260 260 Z" fill="url(#dk-grad)"/>

            <!-- Left Flap buông thẳng song song -->
            <path d="M 180 178 L 180 660 L 125 650 L 138 260 Z" fill="url(#dk-grad)"/>
            <path d="M 180 178 L 180 660" stroke="#DDA15E" stroke-width="3" fill="none"/>

            <!-- Right Flap buông thẳng song song -->
            <path d="M 220 178 L 220 660 L 275 650 L 262 260 Z" fill="url(#dk-grad)"/>
            <path d="M 220 178 L 220 660" stroke="#DDA15E" stroke-width="3" fill="none"/>

            <!-- Delicate Chest Jade Clasp -->
            <line x1="180" y1="260" x2="220" y2="260" stroke="#DDA15E" stroke-width="2"/>
            <circle cx="200" cy="260" r="5" fill="#52B788" stroke="#FFE6A7" stroke-width="1.5"/>
          </g>
        </svg>
      `);

    case 'ao-giao-linh':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="gl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#1B4332"/>
            </linearGradient>
          </defs>
          <g id="ao-giao-linh">
            <!-- Sleeves -->
            <path d="M 180 178 L 120 215 L 85 340 L 105 348 L 138 255 Z" fill="url(#gl-grad)"/>
            <path d="M 220 178 L 280 215 L 315 340 L 295 348 L 262 255 Z" fill="url(#gl-grad)"/>

            <!-- Robe Body with Crossed V Collar (Hữu Nhậm: Phải đè Trái) -->
            <path d="M 180 178 L 220 178 L 265 270 L 270 650 L 130 650 L 135 270 Z" fill="url(#gl-grad)"/>

            <!-- Under Flap White Border -->
            <line x1="180" y1="178" x2="228" y2="270" stroke="#FFFFFF" stroke-width="3.5"/>
            <!-- Over Flap (Hữu Nhậm) -->
            <path d="M 220 178 L 170 275 L 170 340 L 255 340 L 255 270 Z" fill="url(#gl-grad)"/>
            <line x1="220" y1="178" x2="170" y2="275" stroke="#E9C46A" stroke-width="3"/>

            <!-- Wide Silk Sash at Waist (Đại Đái) -->
            <rect x="160" y="335" width="80" height="24" rx="4" fill="#E9C46A"/>
            <path d="M 195 359 L 190 480 L 202 480 L 205 359 Z" fill="#E76F51"/>
          </g>
        </svg>
      `);

    case 'ao-ba-ba':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="bb-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#332211"/>
            </linearGradient>
          </defs>
          <g id="ao-ba-ba">
            <!-- Round / Soft Heart Neckline -->
            <path d="M 180 180 Q 200 198 220 180 L 250 220 L 244 380 L 156 380 L 150 220 Z" fill="url(#bb-grad)"/>
            
            <!-- Sleeves -->
            <path d="M 180 180 L 135 215 L 120 330 L 134 335 L 150 235 Z" fill="url(#bb-grad)"/>
            <path d="M 220 180 L 265 215 L 280 330 L 266 335 L 250 235 Z" fill="url(#bb-grad)"/>

            <!-- Center button placket -->
            <line x1="200" y1="198" x2="200" y2="380" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
            <circle cx="200" cy="225" r="2.5" fill="#FAF0CA"/>
            <circle cx="200" cy="260" r="2.5" fill="#FAF0CA"/>
            <circle cx="200" cy="295" r="2.5" fill="#FAF0CA"/>
            <circle cx="200" cy="330" r="2.5" fill="#FAF0CA"/>
            <circle cx="200" cy="365" r="2.5" fill="#FAF0CA"/>

            <!-- 2 Front Pockets -->
            <rect x="164" y="325" width="22" height="26" rx="3" fill="none" stroke="#FAF0CA" stroke-width="1.2" opacity="0.7"/>
            <rect x="214" y="325" width="22" height="26" rx="3" fill="none" stroke="#FAF0CA" stroke-width="1.2" opacity="0.7"/>

            <!-- Side Slits at Hips (Xẻ tà hông 10cm) -->
            <path d="M 156 380 L 160 355" stroke="#FFFFFF" stroke-width="2" opacity="0.4"/>
            <path d="M 244 380 L 240 355" stroke="#FFFFFF" stroke-width="2" opacity="0.4"/>
          </g>
        </svg>
      `);

    // === ÁO LÓT / INNER TOPS (Z-30) ===
    case 'ao-yem-co-truyen':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="yem-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#E76F51"/>
              <stop offset="100%" stop-color="#B23A22"/>
            </linearGradient>
            <filter id="yem-shadow">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.2"/>
            </filter>
          </defs>
          <g id="ao-yem" filter="url(#yem-shadow)">
            <!-- Neck Ribbon tie -->
            <path d="M 188 175 Q 200 178 212 175" stroke="#C53030" stroke-width="3" fill="none"/>
            <circle cx="200" cy="177" r="2.5" fill="#FFE6A7"/>

            <!-- Rhombus / Trapezoid Silk Chest Piece (Yếm Cánh Sen) -->
            <path d="M 188 178 Q 200 188 212 178 L 242 285 Q 200 325 158 285 Z" fill="url(#yem-grad)" stroke="#FFD166" stroke-width="1.5"/>

            <!-- Delicate Lotus Flower Embroidery Center -->
            <path d="M 194 245 Q 200 230 206 245 Q 200 252 194 245 Z" fill="#FFE6A7"/>
            <circle cx="200" cy="242" r="3" fill="#FFE6A7"/>

            <!-- Waist strings tied back -->
            <path d="M 158 285 Q 146 295 138 290" stroke="#B23A22" stroke-width="2.5" fill="none"/>
            <path d="M 242 285 Q 254 295 262 290" stroke="#B23A22" stroke-width="2.5" fill="none"/>
          </g>
        </svg>
      `);

    // === ÁO KHOÁC HIỆN ĐẠI (Z-40 OUTER TOPS) ===
    case 'mod-blazer-oversize':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="blazer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#495057"/>
              <stop offset="100%" stop-color="#212529"/>
            </linearGradient>
            <filter id="blazer-drop">
              <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000" flood-opacity="0.3"/>
            </filter>
          </defs>
          <g id="mod-blazer" filter="url(#blazer-drop)">
            <!-- Broad Tailored Shoulders with Pads -->
            <path d="M 172 185 L 126 210 L 108 340 L 126 348 L 144 260 Z" fill="url(#blazer-grad)"/>
            <path d="M 228 185 L 274 210 L 292 340 L 274 348 L 256 260 Z" fill="url(#blazer-grad)"/>

            <!-- Oversize Boxy Torso -->
            <path d="M 172 185 L 228 185 L 265 260 L 260 460 L 140 460 L 135 260 Z" fill="url(#blazer-grad)"/>

            <!-- Sharp Peak Lapels (Ve áo vest nhọn) -->
            <path d="M 172 185 L 188 280 L 158 260 Z" fill="#343A40" stroke="#6C757D" stroke-width="1"/>
            <path d="M 228 185 L 212 280 L 242 260 Z" fill="#343A40" stroke="#6C757D" stroke-width="1"/>

            <!-- Deep V-Neck Opening to show traditional layer underneath -->
            <path d="M 188 280 L 200 340 L 212 280 Z" fill="none"/>

            <!-- Minimalist horn button -->
            <circle cx="200" cy="345" r="4" fill="#000000" stroke="#6C757D" stroke-width="1"/>

            <!-- Flap Pockets -->
            <rect x="146" y="390" width="30" height="18" rx="2" fill="#343A40"/>
            <rect x="224" y="390" width="30" height="18" rx="2" fill="#343A40"/>
          </g>
        </svg>
      `);

    // === QUẦN & CHÂN VÁY (Z-20 BOTTOMS) ===
    case 'mod-wide-pants':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="culotte-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#E9ECEF"/>
              <stop offset="100%" stop-color="#CED4DA"/>
            </linearGradient>
            <filter id="culotte-shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.15"/>
            </filter>
          </defs>
          <g id="mod-pants" filter="url(#culotte-shadow)">
            <!-- High Waistband -->
            <path d="M 160 360 L 240 360 L 244 382 L 156 382 Z" fill="#CED4DA"/>

            <!-- Wide Pleated Legs falling gracefully to ankles -->
            <!-- Left Leg -->
            <path d="M 156 382 Q 150 520 142 690 L 195 690 Q 198 520 199 440 L 178 382 Z" fill="url(#culotte-grad)"/>
            <!-- Right Leg -->
            <path d="M 244 382 Q 250 520 258 690 L 205 690 Q 202 520 201 440 L 222 382 Z" fill="url(#culotte-grad)"/>

            <!-- Center Pleat Creases -->
            <line x1="168" y1="382" x2="168" y2="690" stroke="#ADB5BD" stroke-width="1.5" opacity="0.7"/>
            <line x1="232" y1="382" x2="232" y2="690" stroke="#ADB5BD" stroke-width="1.5" opacity="0.7"/>
          </g>
        </svg>
      `);

    case 'mod-pleated-skirt':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="skirt-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#212529"/>
              <stop offset="100%" stop-color="#0B090A"/>
            </linearGradient>
          </defs>
          <g id="mod-skirt">
            <!-- High Waist -->
            <path d="M 162 360 L 238 360 L 242 380 L 158 380 Z" fill="#161A1D"/>

            <!-- A-line Pleated Skirt Flow -->
            <path d="M 158 380 Q 140 540 120 700 L 280 700 Q 260 540 242 380 Z" fill="url(#skirt-grad)"/>

            <!-- Crisp Accordion Pleat Lines -->
            <g stroke="#343A40" stroke-width="1.5">
              <line x1="172" y1="380" x2="148" y2="700"/>
              <line x1="186" y1="380" x2="176" y2="700"/>
              <line x1="200" y1="380" x2="200" y2="700"/>
              <line x1="214" y1="380" x2="224" y2="700"/>
              <line x1="228" y1="380" x2="252" y2="700"/>
            </g>
          </g>
        </svg>
      `);

    // === GIÀY & DÉP (Z-60 SHOES) ===
    case 'mod-chelsea-boots':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="boot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#58311A"/>
              <stop offset="100%" stop-color="#271306"/>
            </linearGradient>
          </defs>
          <g id="chelsea-boots">
            <!-- Left Boot -->
            <path d="M 168 705 L 186 705 L 188 745 L 160 748 L 162 725 Z" fill="url(#boot-grad)"/>
            <!-- Elastic gusset -->
            <path d="M 174 712 L 180 712 L 178 728 L 176 728 Z" fill="#140803"/>
            <!-- Sole -->
            <rect x="158" y="745" width="32" height="7" rx="2" fill="#1A0D06"/>

            <!-- Right Boot -->
            <path d="M 214 705 L 232 705 L 238 725 L 240 748 L 212 745 Z" fill="url(#boot-grad)"/>
            <!-- Elastic gusset -->
            <path d="M 220 712 L 226 712 L 224 728 L 222 728 Z" fill="#140803"/>
            <!-- Sole -->
            <rect x="210" y="745" width="32" height="7" rx="2" fill="#1A0D06"/>
          </g>
        </svg>
      `);

    case 'mod-minimal-sneaker':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <g id="white-sneakers">
            <!-- Left Sneaker -->
            <path d="M 168 720 Q 186 720 188 746 L 158 746 Q 160 730 168 720 Z" fill="#F8F9FA" stroke="#E9ECEF" stroke-width="1.5"/>
            <!-- Sole -->
            <rect x="156" y="746" width="34" height="6" rx="2" fill="#FFFFFF" stroke="#DEE2E6"/>
            <!-- Laces -->
            <line x1="172" y1="728" x2="182" y2="728" stroke="#ADB5BD" stroke-width="1.5"/>

            <!-- Right Sneaker -->
            <path d="M 214 720 Q 232 720 242 746 L 212 746 Q 212 730 214 720 Z" fill="#F8F9FA" stroke="#E9ECEF" stroke-width="1.5"/>
            <!-- Sole -->
            <rect x="210" y="746" width="34" height="6" rx="2" fill="#FFFFFF" stroke="#DEE2E6"/>
            <!-- Laces -->
            <line x1="218" y1="728" x2="228" y2="728" stroke="#ADB5BD" stroke-width="1.5"/>
          </g>
        </svg>
      `);

    // === PHỤ KIỆN TRƯỚC / ACC FRONT (Z-70) ===
    case 'acc-tui-gam':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <filter id="bag-shadow">
              <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
            </filter>
          </defs>
          <g id="acc-tui-gam" filter="url(#bag-shadow)">
            <!-- Shoulder strap across chest from right shoulder to left hip -->
            <path d="M 230 185 Q 180 270 120 400" stroke="#7F4F24" stroke-width="3" fill="none"/>
            
            <!-- Brocade Bag on Left Hip -->
            <rect x="96" y="390" width="52" height="42" rx="6" fill="#9B2226" stroke="#D4AF37" stroke-width="2"/>
            <!-- Flap -->
            <path d="M 96 390 L 148 390 L 136 412 L 108 412 Z" fill="#6B0F1A"/>
            <!-- Gold Clasp -->
            <circle cx="122" cy="412" r="3.5" fill="#FFE6A7"/>
          </g>
        </svg>
      `);

    case 'acc-quat-tram':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <g id="acc-quat-tram">
            <!-- Fan held in right hand (around x=280, y=420) -->
            <!-- Fan ribs opened -->
            <path d="M 276 438 L 246 390 Q 284 365 316 394 L 276 438 Z" fill="#DDBEA9" stroke="#7F5539" stroke-width="1.5"/>
            <!-- Laser engraved bronze drum lines hint -->
            <circle cx="280" cy="390" r="14" fill="none" stroke="#9C6644" stroke-width="1" stroke-dasharray="2,2"/>
            <!-- Fan tassel hanging down -->
            <line x1="276" y1="438" x2="276" y2="475" stroke="#E63946" stroke-width="2"/>
            <circle cx="276" cy="477" r="3" fill="#FFE6A7"/>
          </g>
        </svg>
      `);

    case 'acc-vong-ngoc':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <filter id="necklace-glow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#52B788" flood-opacity="0.4"/>
            </filter>
          </defs>
          <g id="acc-vong-ngoc" filter="url(#necklace-glow)">
            <!-- Silver Chain draped over neck and chest -->
            <path d="M 186 182 Q 200 240 214 182" stroke="#E0E1DD" stroke-width="2" fill="none"/>
            <!-- Traditional Kim Khánh Pendant (Khánh Bạc Đính Ngọc Bích) -->
            <path d="M 190 220 Q 200 215 210 220 L 206 230 Q 200 234 194 230 Z" fill="#C0C0C0" stroke="#778DA9" stroke-width="1"/>
            <circle cx="200" cy="224" r="3" fill="#2D6A4F"/>
          </g>
        </svg>
      `);

    case 'acc-kinh-retro':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <g id="acc-kinh-retro">
            <!-- Retro Tortoiseshell Sunglasses over Eyes (x=175 to 225, y=124) -->
            <!-- Left Lens -->
            <rect x="174" y="120" width="18" height="14" rx="4" fill="#1C1917" stroke="#9A7B56" stroke-width="2"/>
            <!-- Bridge -->
            <line x1="192" y1="125" x2="208" y2="125" stroke="#9A7B56" stroke-width="2"/>
            <!-- Right Lens -->
            <rect x="208" y="120" width="18" height="14" rx="4" fill="#1C1917" stroke="#9A7B56" stroke-width="2"/>
          </g>
        </svg>
      `);

    // === PHỤ KIỆN SAU / ACC BACK (Z-50) ===
    case 'acc-khan-dong':
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <defs>
            <linearGradient id="kd-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1D3557"/>
              <stop offset="100%" stop-color="#0D1B2A"/>
            </linearGradient>
            <filter id="kd-shadow">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
            </filter>
          </defs>
          <g id="acc-khan-dong" filter="url(#kd-shadow)">
            <!-- Vietnamese Turban (Khăn Đóng / Khăn Xếp quấn nếp chữ Nhất hoặc chữ Nhân) -->
            <path d="M 160 105 Q 200 80 240 105 L 238 88 Q 200 68 162 88 Z" fill="url(#kd-grad)" stroke="#D4AF37" stroke-width="1"/>
            <!-- Inner wrapped fold folds -->
            <path d="M 163 100 Q 200 84 237 100" stroke="#457B9D" stroke-width="1.8" fill="none"/>
            <path d="M 165 94 Q 200 78 235 94" stroke="#457B9D" stroke-width="1.8" fill="none"/>
          </g>
        </svg>
      `);

    default:
      // Generic item fallback with subtle stylized garment shape
      return svgToDataUri(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" width="100%" height="100%">
          <g opacity="0.6">
            <rect x="150" y="240" width="100" height="200" rx="10" fill="${color}" opacity="0.25"/>
          </g>
        </svg>
      `);
  }
}

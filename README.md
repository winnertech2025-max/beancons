# Happy Farm – Nông trại tiếng Anh

Happy Farm là game học 5 từ vựng tiếng Anh về động vật cho trẻ mới bắt đầu: **cat, dog, cow, pig, duck**. Trẻ khám phá bản đồ, nghe phát âm, sau đó chơi mini-game “Who Am I?” để nhận sao.

## Công nghệ

- React 19 + TypeScript: app shell và responsive/orientation notice.
- Phaser 3.90: game world, scene, tween và input.
- Vite 8: development và production build.
- LocalStorage: tiến độ, từ đã học, điểm sao tốt nhất và cài đặt âm thanh.
- Web Speech API: phát âm en-US khi chưa có audio thu âm.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị trong terminal. Kiểm tra build production bằng `npm run build`.

Build static được sinh vào `dist/` và có thể deploy lên Vercel với Build Command `npm run build`, Output Directory `dist`.

## Luồng chơi

Loading → Welcome → Bản đồ 5 nông trại → Học từ vựng → Who Am I? → Kết quả → Bản đồ.

Tiến độ/sao được lưu tại LocalStorage. Nút `Reset tiến độ` nằm góc dưới trái của bản đồ cho development.

## Cấu trúc

- `src/game/config`: cấu hình game, asset manifest, toạ độ map.
- `src/game/scenes`: các scene Phaser.
- `src/game/objects`: thành phần tương tác tái sử dụng.
- `src/game/systems`: SpeechSynthesis và LocalStorage.
- `src/data/animals.ts`: dữ liệu từ vựng.

## Bảo trì nội dung

- Thêm animal: cập nhật `src/data/animals.ts`, thêm PNG vào `public/assets/animals/`, sau đó thêm vùng vào `src/game/config/farmZones.ts`.
- Thay background: cập nhật `public/assets/backgrounds/farm-map.png`; game giữ world 1536 × 1024 theo tỷ lệ 3:2.
- Chỉnh vị trí map marker: sửa giá trị tỷ lệ `x`, `y` trong `src/game/config/farmZones.ts`.
- Thêm audio thu âm: đặt MP3 vào `public/assets/audio/`, khai báo trong `src/game/config/assets.ts`, rồi mở rộng `AudioManager` để ưu tiên file đó thay Speech Synthesis.

Xem [asset inventory](docs/ASSET-INVENTORY.md) và [kiến trúc](docs/GAME-ARCHITECTURE.md) trước khi thay asset từ Drive.

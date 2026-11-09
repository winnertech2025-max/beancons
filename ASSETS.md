# Happy Farm assets

Tất cả đường dẫn được quản lý tại `src/game/config/assets.ts`; scene không chứa đường dẫn asset rải rác.

| Loại | Thư mục | Tên gợi ý |
|---|---|---|
| Bản đồ | `public/assets/backgrounds/` | `farm-map.png` |
| Con vật PNG/WebP | `public/assets/animals/` | `cat.png`, `dog.png`, `cow.png`, `pig.png`, `duck.png` |
| Âm thanh | `public/assets/audio/` | `correct.mp3`, `cat.mp3` |

Để thay minh họa placeholder, thêm file đúng tên rồi khai báo/preload ở manifest. Kích thước ảnh không làm thay đổi logic câu hỏi hay tiến độ. Ảnh bản đồ hiện tại lấy từ ảnh tham khảo do người dùng cung cấp.

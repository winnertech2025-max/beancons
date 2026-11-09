# MASTER TASK — COMPLETE HAPPY FARM GAME QUALITY OVERHAUL

Bạn đang tiếp tục phát triển dự án Happy Farm hiện tại.

Tôi không hài lòng với chất lượng giao diện và trải nghiệm hiện tại. Vấn đề không nằm ở một màn hình riêng lẻ. Nhiều màn hình trong toàn bộ game đang được triển khai sơ sài, thiếu tính nhất quán, thiếu tương tác và chưa đạt chất lượng của một sản phẩm game giáo dục dành cho trẻ em.

Tôi muốn bạn thực hiện một cuộc tổng kiểm tra và nâng cấp toàn diện dự án.

Đây không phải nhiệm vụ chỉnh sửa một vài CSS hoặc làm đẹp màn hình đang mở.

Bạn phải hành động như một đội ngũ phát triển game chuyên nghiệp gồm:

- Senior Game Designer.
- Senior Game UI/UX Designer.
- 2D Game Artist.
- Game Animation Designer.
- Gameplay Developer.
- Game QA Engineer.

## PHẦN 1 — HIỂU TOÀN BỘ DỰ ÁN

Trước khi chỉnh sửa:

1. Đọc toàn bộ source code hiện tại.
2. Kiểm tra tất cả scenes, components, routes, game objects, systems và gameplay logic.
3. Đọc kỹ tài liệu kịch bản game gốc.
4. Đọc tài liệu tổng quan dự án.
5. Kiểm tra tất cả assets hiện có trong public/assets và các thư mục liên quan.
6. Kiểm tra hệ thống điều hướng và trạng thái lưu tiến trình.
7. Kiểm tra những phần đã hoàn thiện, đang làm dở và chưa triển khai.

Không được chỉ dựa vào màn hình hiện tại để kết luận về toàn bộ dự án.

Không được bỏ qua bất kỳ màn hình hoặc hoạt động nào có trong kịch bản.

## PHẦN 2 — KIỂM KÊ TOÀN BỘ MÀN HÌNH

Lập danh sách tất cả màn hình và trạng thái gameplay đang tồn tại.

Đối chiếu với kịch bản Happy Farm, bao gồm:

- Welcome.
- Chọn NPC.
- Farm Map.
- Onboarding.
- Crop Farm.
- Cow Farm.
- Fishing Lake.
- Memory Card.
- Chicken Farm.
- Sheep Farm.
- Farm Delivery.
- Farm Shop.
- Các màn hình kết quả, phần thưởng, hướng dẫn, loading, pause và những trạng thái khác nếu có trong source hoặc kịch bản.

Đây là danh sách định hướng, không được coi là danh sách đầy đủ nếu source hoặc kịch bản có thêm màn hình.

Với từng màn hình, ghi nhận:

- Chức năng.
- Luồng người chơi đi vào và đi ra.
- UI hiện tại.
- Assets cần thiết.
- Assets đang sử dụng.
- Các tương tác.
- Animation.
- Các trạng thái.
- Lỗi UI/UX.
- Lỗi gameplay.
- Mức độ hoàn thiện.

Tạo file:

`docs/GAME-WIDE-QUALITY-AUDIT.md`

## PHẦN 3 — KIỂM TRA VÀ TÁI SỬ DỤNG ASSETS

Tôi đã chuẩn bị rất nhiều assets trong Google Drive và đã đưa các tài nguyên vào dự án.

Tôi không muốn bạn bỏ qua tài nguyên hiện có rồi tự dựng giao diện bằng các hình khối CSS đơn giản.

Hãy:

1. Quét toàn bộ thư mục assets.
2. Phân loại background, NPC, animals, vegetation, decorations, buildings, tools, items, UI, icons và effects.
3. Kiểm tra kích thước, định dạng và transparency.
4. Tạo bảng mapping asset → màn hình → mục đích sử dụng.
5. Tìm những assets phù hợp nhưng chưa được sử dụng.
6. Thay thế những thành phần placeholder bằng assets thật khi có tài nguyên phù hợp.
7. Không sửa hoặc ghi đè file gốc khi chưa cần thiết.

Tạo file:

`docs/GAME-ASSET-MAPPING.md`

Nếu asset thiếu, hãy ghi rõ thiếu gì, cần dùng ở đâu và đề xuất cách xử lý.

Không tự nhận rằng đã kiểm tra Google Drive nếu môi trường hiện tại không truy cập được Drive. Hãy kiểm tra các file thực tế có trong source.

## PHẦN 4 — THIẾT KẾ LẠI TOÀN BỘ GAME

Tôi muốn chất lượng của toàn bộ màn hình đạt cùng một tiêu chuẩn thiết kế.

### Art direction

Giữ phong cách:

- Cute cartoon farm.
- Colorful.
- Warm and friendly.
- High-quality illustrated 2D game.
- Child-friendly.
- Playful and immersive.

Không được biến game thành website thông thường.

### UI/UX

Mỗi màn hình phải được thiết kế có chủ đích:

- Background phù hợp.
- Composition hợp lý.
- Nhân vật được đặt đúng vị trí.
- UI hòa hợp với phong cách minh họa.
- Typography dễ đọc.
- Button lớn, dễ nhấn.
- Các khu vực tương tác rõ ràng.
- Khoảng cách và tỷ lệ cân đối.
- Không có khoảng trống vô nghĩa.
- Không để UI che mất nhân vật hoặc đối tượng quan trọng.

### Không dùng chung một template cho mọi màn hình

Mỗi minigame có đặc điểm gameplay riêng.

Ví dụ:

- Crop Farm cần tạo cảm giác đang làm vườn thực sự: luống đất, hạt giống, cây trồng, bình tưới, công cụ và hoạt động thu hoạch.
- Cow Farm cần có chuồng bò, thức ăn, bò, bình sữa và phương tiện vận chuyển.
- Fishing Lake cần có hồ nước, cần câu, vật thể dưới nước, hoạt ảnh câu cá và giao diện lựa chọn từ vựng.
- Memory Card cần có các thẻ hình ảnh đẹp, trạng thái úp/mở, hiệu ứng ghép đúng và sai.
- Chicken Farm cần có chuồng gà, gà mẹ, gà con, trứng và hoạt động tương ứng.
- Sheep Farm cần thể hiện rõ nhân vật, chỉ dẫn tiếng Anh và hành động của người chơi.
- Farm Delivery cần có đơn hàng, vật phẩm, thời hạn và phản hồi giao hàng.
- Farm Shop cần có sản phẩm, giá, sao và trạng thái mua sắm.

Đây là định hướng hình ảnh. Mọi chức năng và quy tắc gameplay cụ thể phải theo kịch bản gốc.

## PHẦN 5 — ANIMATION VÀ GAME FEEL

Game cần có cảm giác sống động, không phải một bộ ảnh tĩnh.

Hãy tận dụng assets hiện có để tạo animation phù hợp.

Ví dụ:

### Environment

- Cây cối đung đưa.
- Hoa chuyển động nhẹ.
- Mây trôi.
- Nước chuyển động.
- Thác nước có hiệu ứng.
- Cỏ lay nhẹ.
- Ánh sáng và môi trường có chuyển động phù hợp.

### Characters

- Chớp mắt.
- Hô hấp.
- Nhảy hoặc di chuyển.
- Phản ứng khi người chơi nhấn.
- Biểu cảm vui mừng khi hoàn thành nhiệm vụ.
- Biểu cảm phù hợp khi trả lời sai.

### Gameplay

- Drag and drop mượt.
- Object movement.
- Reward animations.
- Success effects.
- Transition effects.
- Feedback khi nhấn nút.

Không được chỉ áp dụng một animation giống nhau cho mọi đối tượng.

Tối ưu hiệu năng, tránh quá nhiều animation chạy đồng thời.

## PHẦN 6 — GAMEPLAY PHẢI ĐÚNG KỊCH BẢN

Kịch bản game gốc là nguồn sự thật.

Không được:

- Bỏ qua hoạt động.
- Thay thế minigame bằng màn hình giả lập.
- Dùng nút bấm thay cho hoạt động gameplay thực tế.
- Tự thay đổi luật chơi.
- Tự thay đổi thời gian hoặc phần thưởng.
- Tự đơn giản hóa các hoạt động phức tạp.

Mỗi hoạt động phải được kiểm tra:

- Người chơi hiểu mục tiêu không?
- Hành động thực tế có hoạt động không?
- Có validation đúng không?
- Có phản hồi ngay sau thao tác không?
- Có tiến trình không?
- Có phần thưởng đúng không?
- Có thể chơi lại không?
- Có thể tiếp tục sang bước tiếp theo không?

Nếu phát hiện mâu thuẫn trong kịch bản, ghi vào báo cáo và không tự ý giải quyết bằng cách thay đổi dữ liệu.

## PHẦN 7 — QA TOÀN DIỆN

Bạn đã có khả năng mở trình duyệt, chụp screenshot và tương tác với game.

Hãy tận dụng khả năng đó để kiểm tra tất cả màn hình.

Không chỉ test build.

Với từng màn hình:

1. Mở màn hình thực tế.
2. Chụp screenshot.
3. Kiểm tra bố cục.
4. Kiểm tra assets.
5. Kiểm tra typography.
6. Kiểm tra animation.
7. Thử toàn bộ thao tác.
8. Kiểm tra các trạng thái thành công và thất bại.
9. Kiểm tra điều hướng.
10. Kiểm tra responsive.
11. Ghi nhận lỗi.
12. Tự sửa lỗi.
13. Mở lại màn hình.
14. Chụp screenshot sau khi sửa.
15. Test lại luồng liên quan để đảm bảo không phát sinh lỗi mới.

Nếu một màn hình không thể test tự động, hãy thực hiện kiểm tra thủ công bằng trình duyệt và ghi rõ giới hạn.

## PHẦN 8 — TỰ ĐÁNH GIÁ THẨM MỸ

Không được đánh giá màn hình chỉ dựa trên việc code chạy được.

Hãy tự hỏi:

- Đây có thực sự giống một game dành cho trẻ em không?
- Hình ảnh có đủ đẹp và đồng nhất không?
- Có cảm giác sống động không?
- Trẻ có hiểu cần làm gì tiếp theo không?
- Các thao tác có tạo cảm giác thú vị không?
- Các màn hình có chất lượng đồng đều không?
- Nếu so sánh với một game giáo dục thương mại, màn hình này còn thiếu gì?

Nếu câu trả lời chưa đạt, tiếp tục cải thiện.

## PHẦN 9 — CÁCH TRIỂN KHAI

Không được sửa tất cả cùng lúc theo cách thiếu kiểm soát.

Thực hiện theo thứ tự:

### PHASE A — AUDIT

Kiểm tra source, kịch bản, scenes, assets và luồng game.

### PHASE B — DESIGN SYSTEM

Xây dựng hệ thống UI, typography, button, panel, feedback, animation và transition thống nhất.

### PHASE C — CORE EXPERIENCE

Hoàn thiện Welcome, NPC Selection, Farm Map và onboarding.

### PHASE D — MINIGAMES

Nâng cấp lần lượt từng minigame theo kịch bản.

### PHASE E — SHARED SYSTEMS

Kiểm tra inventory, rewards, progress, audio, navigation, save/load và các hệ thống dùng chung.

### PHASE F — QA

Kiểm thử toàn bộ game từ đầu đến cuối.

Sau mỗi phase:

- Chạy build.
- Kiểm tra console.
- Test browser.
- Chụp screenshot.
- Ghi báo cáo.
- Sửa các lỗi phát hiện được.

Không dừng lại sau khi tạo báo cáo audit. Hãy thực sự triển khai sửa chữa theo từng phase.

## PHẦN 10 — CÁC NGUYÊN TẮC BẮT BUỘC

1. Giữ nguyên source code và kiến trúc hiện tại nếu không có lý do kỹ thuật rõ ràng để thay đổi.
2. Không tạo dự án mới.
3. Không xóa các chức năng đang hoạt động.
4. Không tự ý thay đổi kịch bản gốc.
5. Ưu tiên assets đã có.
6. Không sử dụng placeholder để giả vờ hoàn thiện.
7. Không chỉ chỉnh sửa màn hình hiện tại.
8. Không dừng ở mức báo cáo.
9. Không đánh dấu hoàn thành nếu chưa test thực tế.
10. Mọi thay đổi phải có thể kiểm chứng.

## KẾT QUẢ CUỐI CÙNG

Tôi muốn có một game hoàn chỉnh với chất lượng hình ảnh đồng nhất, gameplay đúng kịch bản, assets được sử dụng hợp lý, animation sống động và tất cả màn hình đều được kiểm thử.

Bắt đầu bằng PHASE A. Sau khi audit, tiếp tục thực hiện các phase còn lại một cách có kiểm soát. Nếu gặp giới hạn về quyền truy cập, tài nguyên hoặc môi trường test, hãy ghi rõ thay vì giả vờ đã hoàn thành.

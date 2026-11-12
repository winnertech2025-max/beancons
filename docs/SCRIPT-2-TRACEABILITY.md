# Kịch bản 2 — đối chiếu luồng hiện tại

**Nguồn đã đọc:** `Kịch bản 2.docx`, các đoạn 1–331, kiểm tra ngày 12-11-2026.

Đây là bảng đối chiếu, không phải xác nhận hoàn thành. “Partial” nghĩa là có luồng thật nhưng còn thiếu một hay nhiều beat bắt buộc trong kịch bản; không được quảng bá thành hoàn chỉnh.

| Kịch bản | Hiện trạng thực tế | Kết luận / việc cần làm |
|---|---|---|
| Chờ → chọn bé trai/bé gái → NPC dẫn truyện → map; lời thoại Anh–Việt | Welcome, Avatar, Intro và Map chạy được. Intro mới có một board hội thoại và CTA. | **Partial.** Thiếu chuỗi thoại 1–3, NPC biến mất theo thoại 3 và hand hướng dẫn vào vườn từ asset thật. |
| Vườn: NPC hướng dẫn, hạt cho từng luống, tưới, bắt sâu, bón phân, 10 giây, kho | Có một chuỗi carrot: kéo hạt → tưới → bắt sâu → bón phân → đếm 10 giây → thu hoạch; có effect nước. | **Partial.** Bắt sâu vẫn là nút, chưa là hoạt động dùng vợt/asset sâu; chưa có luống/cây và timer riêng từng loại; balo/kho bán hàng chưa có. Cần asset pest/net và bag phiên bản mới đã đồng bộ. |
| Bò: ba thức ăn, lần chọn 1 đọc Anh/lần 2 đọc Việt; kéo cỏ; flashcard | Có drag đúng/sai; mỗi thẻ thức ăn chạm lẻ đọc tiếng Anh, chạm chẵn đọc tiếng Việt; board flashcard có Cow, Grass, Hay, Eat. | **Partial.** Chưa có NPC bò/hand asset mới. |
| Bò: chọn xô, TOUCH theo nhịp, sữa tăng, 2 bình | Có board chọn đồ, xô vào cảnh kế, 5 touch, cảnh xô đầy. | **Partial.** Cần thay control bằng hand-touch PNG khi file thật có mặt. Kịch bản mâu thuẫn: đoạn 2 bình, đoạn giao sau yêu cầu đếm 10. |
| Bò: xe vào/dừng, kéo 10 bình, one–ten, START, nhún/đèn/còi/chạy, Little Farmer | Có xe vào, 10 kéo thả thật, đếm Anh→Việt, START chỉ sau 10, nhún/đèn/còi/chạy, cập nhật kho và kết quả. | **Pass cho beat giao hàng.** Cần khách xác nhận tồn kho 10 hay 2 vì mâu thuẫn nêu trên. |
| Sau hai khu mở Hồ và Nhà | Lake, Home và toàn bộ các điểm đến hiện có đều mở từ đầu theo yêu cầu mới của client; phần thưởng/hoàn thành vẫn được lưu riêng. | **Intentional product override.** Không còn chặn trải nghiệm theo thứ tự. |
| Hồ: 40 level; 20 free/20 trả phí; cần di chuyển; vật bắt ngẫu nhiên; vật cản level 21–40 | Có 20 round free, cần di chuyển theo Level, cast/reel/đáp án, retry và sao. | **Partial.** Chưa có Level 21–40, paywall 39k, entitlement, obstacle; thiếu ảnh cô bé thuyền và thẻ Squid phù hợp Level 18. |
| Nhà: 4 chủ đề + tổng hợp, free/paid, Level 1/2… | Có Animals/Plants/Mixed, Level 1 4 thẻ và Level 2 6 thẻ. | **Partial.** Chưa đủ theme, phần paid và flashcard đồ vật trong nhà vì folder asset hiện rỗng. |
| Gà Level 1: làm quen → cho ăn/uống → thu trứng → tô màu | Có chạm Hen/Chick → chọn Chick đúng/sai → kéo ngô vào máng → chạm máng nước → thu 10 trứng, đếm Anh–Việt → chọn màu/tô trứng → thưởng. | **Pass.** Dùng các asset Gà cùng ngô/cỏ/rơm/hoa/trứng đã có trong asset set đã sync. |
| Gà Level 2: tìm trứng (kịch bản mâu thuẫn 16/10) | Có màn giới thiệu và 5 vị trí khám phá (đống rơm, bụi cây, chuồng, cây lớn, giỏ); mỗi vị trí mở hai trứng, tổng 10, rồi màn hoàn thành. | **Implemented with 10.** Đây là suy luận theo bảng nhiệm vụ lặp lại “Find 10 eggs”; đoạn “16 quả” mâu thuẫn vẫn cần khách xác nhận nếu muốn đổi mục tiêu. |
| Cừu: Jump N lần | Có scene Cừu dùng nền minh họa được cung cấp; yêu cầu “Jump three times”, ba lần bấm và phản hồi Great job/replay/home hoạt động. | **Partial.** Kịch bản chưa xác định các lượt sau nên không tự tạo thêm luật. |
| Kho giao hàng: orders, 5 phút, kéo hàng, reward | Chưa có scene. | **Chưa triển khai; chờ asset kho khách nói đang chuẩn bị.** |
| Farm Shop & Decor | Chưa có scene / economy loop. | **Chưa triển khai; cần asset catalog và giá/đơn vị nội dung.** |
| Map hover | Có hit area lớn để bấm trực tiếp từng khu. | **Không có highlight tạm.** Ellipse sai hình đã bị gỡ. Cần PNG silhouette từng khu từ Drive để tạo outline đúng hình. |

## Quy tắc triển khai từ đây

1. Không đánh dấu scene “xong” nếu chưa test initial, đúng, sai, thành công, exit và save/replay trong browser.
2. Luôn dùng asset Drive đã sync; không thay silhouette vùng map, con trỏ, hand hoặc vật dụng bằng CSS/shape tự dựng.
3. Lời thoại mới phải ghi và đọc **English trước, Vietnamese sau**. Từ vựng chạm lần 1/lần 2 giữ đúng nhịp riêng nếu kịch bản yêu cầu.
4. Mỗi minigame thay đổi sẽ có dòng QA evidence mới trong `docs/QA-REPORT.md`.

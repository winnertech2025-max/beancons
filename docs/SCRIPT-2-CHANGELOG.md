# Kịch bản 2 — đối chiếu triển khai

Nguồn đã đọc toàn văn: `/Users/thanglq/Documents/Kịch bản 2.docx`, ngày 2026-11-09. Kịch bản 2 là chuẩn mới khi khác với tài liệu cũ.

## Thay đổi đã áp dụng

- **Trang trại bò / Level 1:** thay vocabulary cuối từ `Eat` thành **Flower · Hoa**; nhập artwork Cow Farm mới từ Drive; thêm bảng chọn 5 vật phẩm.
- **Chọn xô:** ghế, nón, táo và bình sữa là lựa chọn sai có phản hồi; chọn **Bucket / Cái xô** chuyển sang đúng cảnh xô xuất hiện cạnh bò. Không còn xô dạng bảng chữ hoặc kéo một placeholder.
- **Vắt sữa và giao:** dùng cảnh xô rỗng, cảnh xô đầy và hai bình sữa PNG được khách cập nhật, thay toàn bộ hình chữ nhật/bình tạm.

## Chưa được thay đổi âm thầm — cần xử lý theo script mới

| Phần | Kịch bản 2 yêu cầu | Hiện trạng | Cần làm / vướng mắc |
|---|---|---|---|
| Vườn | Mỗi luống tương ứng loại hạt, thời gian tăng 5 giây cho từng loại và timer tiếp tục khi bé về Home | Chỉ có một luống cà rốt 10 giây; timer chưa persist khi rời scene | Cần xác định thứ tự loại cây/luống được duyệt, sau đó dùng artwork Vườn mới để xây hệ trồng nhiều luống. |
| Bò — đọc vật phẩm | Lần chạm 1 đọc English, lần 2 đọc Vietnamese cho mỗi vật phẩm | Vocabulary có bilingual; bảng chọn hiện đọc song song để tránh mất nghĩa | Cần chuyển từng hotspot sang bộ đếm 1/2 khi hoàn thiện voice Việt Nam trên thiết bị. |
| Bò — giao sữa | Một xô đổi 2 bình, nhưng đoạn sau yêu cầu đếm đến 10 | Hiện dùng đúng 2 bình theo câu “một xô tương đương 2 bình” | Đây là mâu thuẫn nội bộ; chưa tự nâng lên 10 bình. Cần khách xác nhận 2 hay 10 bình cho lượt giao này. |
| Hồ câu cá | 40 level: 20 free, 20 trả 39k; từ level 21 có chướng ngại ngẫu nhiên | 20 level free đã hoạt động; không triển khai thanh toán/chướng ngại | Drive có các thư mục level cập nhật; cần asset/điều khoản thanh toán và danh sách chướng ngại được duyệt trước khi mở pack trả phí. |
| Ngôi nhà | 4 chủ đề + 1 tổng hợp, 3 free và 2 paid | Có Animal, Plant, Mixed; Đồ vật trong nhà chờ asset và 1 pack khóa | Thư mục Đồ vật trong nhà đang trống khi kiểm tra Drive. |
| Gà, Cừu, Kho giao hàng, Shop | Có chuỗi gameplay chi tiết trong script mới | Chưa có scene hoàn chỉnh tương ứng trong game config | Cần triển khai theo thứ tự unlock sau khi asset và flow từng scene được QA. |

## Asset Drive đã xác minh trong đợt này

- `Trang trại bò`: bảng chọn vật phẩm, xô rỗng/xô sữa, bình sữa rỗng/bình sữa, ba cảnh vắt sữa.
- `Trò câu cá`: có thư mục Level 1–21 trở lên; chưa coi là “đã tích hợp” đến khi từng asset được xác minh và gắn với level đúng.
- `Vườn`: có nhiều cảnh luống đất theo trạng thái, hạt giống và công cụ. Chưa ghi đè background hiện tại trước khi xác định mapping chính xác giữa từng ảnh và từng bước kịch bản.

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.style import WD_STYLE_TYPE
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / 'Happy-Farm_Project-Overview.docx'

BLUE = '2E74B5'
DARK = '1F4D78'
INK = '183B56'
MUTED = '5B6B78'
PALE = 'E8EEF5'
MINT = 'E8F5ED'
GOLD = 'FFF4D6'

def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd'); shd.set(qn('w:fill'), fill); tc_pr.append(shd)

def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    mar = tc_pr.first_child_found_in('w:tcMar')
    if mar is None:
        mar = OxmlElement('w:tcMar'); tc_pr.append(mar)
    for side, value in [('top', top), ('start', start), ('bottom', bottom), ('end', end)]:
        node = mar.find(qn(f'w:{side}'))
        if node is None:
            node = OxmlElement(f'w:{side}'); mar.append(node)
        node.set(qn('w:w'), str(value)); node.set(qn('w:type'), 'dxa')

def set_table_widths(table, widths):
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_pr = table._tbl.tblPr
    tbl_w = tbl_pr.first_child_found_in('w:tblW')
    if tbl_w is None:
        tbl_w = OxmlElement('w:tblW'); tbl_pr.append(tbl_w)
    tbl_w.set(qn('w:w'), str(sum(widths))); tbl_w.set(qn('w:type'), 'dxa')
    ind = tbl_pr.first_child_found_in('w:tblInd')
    if ind is None:
        ind = OxmlElement('w:tblInd'); tbl_pr.append(ind)
    ind.set(qn('w:w'), '120'); ind.set(qn('w:type'), 'dxa')
    grid = table._tbl.tblGrid
    for col, width in zip(grid.gridCol_lst, widths): col.set(qn('w:w'), str(width))
    for row in table.rows:
        for cell, width in zip(row.cells, widths):
            tc_w = cell._tc.tcPr.tcW
            tc_w.set(qn('w:w'), str(width)); tc_w.set(qn('w:type'), 'dxa')

def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr(); node = OxmlElement('w:tblHeader'); node.set(qn('w:val'), 'true'); tr_pr.append(node)

def set_font(run, size=11, color=INK, bold=False, italic=False):
    run.font.name = 'Calibri'
    run._element.rPr.rFonts.set(qn('w:ascii'), 'Calibri')
    run._element.rPr.rFonts.set(qn('w:hAnsi'), 'Calibri')
    run.font.size = Pt(size); run.font.color.rgb = RGBColor.from_string(color)
    run.bold = bold; run.italic = italic

def set_para(p, before=0, after=6, line=1.25, align=None):
    f = p.paragraph_format
    f.space_before = Pt(before); f.space_after = Pt(after); f.line_spacing = line
    if align is not None: p.alignment = align

def add_text(doc, text, style=None, before=0, after=6, bold=False, color=INK, size=11, align=None, italic=False):
    p = doc.add_paragraph(style=style) if style else doc.add_paragraph()
    set_para(p, before, after, 1.25, align)
    r = p.add_run(text); set_font(r, size, color, bold, italic)
    return p

def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style='Bullet List')
        p.paragraph_format.left_indent = Inches(.375)
        p.paragraph_format.first_line_indent = Inches(-.188)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.25
        set_font(p.add_run(item))

def add_numbered(doc, items):
    for item in items:
        p = doc.add_paragraph(style='Numbered List')
        p.paragraph_format.left_indent = Inches(.375)
        p.paragraph_format.first_line_indent = Inches(-.188)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.25
        set_font(p.add_run(item))

def add_table(doc, headers, rows, widths, status_col=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Table Grid'
    set_table_widths(table, widths)
    header = table.rows[0]
    set_repeat_table_header(header)
    for i, text in enumerate(headers):
        c = header.cells[i]; set_cell_shading(c, PALE); set_cell_margins(c)
        c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = c.paragraphs[0]; set_para(p, 0, 0, 1.1)
        set_font(p.add_run(text), 10, DARK, True)
    for row in rows:
        cells = table.add_row().cells
        for i, value in enumerate(row):
            c = cells[i]; set_cell_margins(c); c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            if status_col == i and value in ('Có sẵn', 'Hoàn thiện'):
                set_cell_shading(c, MINT)
            elif status_col == i and value in ('Cần bổ sung', 'Khuyến nghị'):
                set_cell_shading(c, GOLD)
            p = c.paragraphs[0]; set_para(p, 0, 0, 1.15)
            set_font(p.add_run(value), 9.5, INK, i == 0)
    doc.add_paragraph().paragraph_format.space_after = Pt(3)
    return table

def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f'Heading {level}')
    set_para(p, 18 if level == 1 else 14 if level == 2 else 10, 10 if level == 1 else 7 if level == 2 else 5, 1.15)
    set_font(p.add_run(text), 16 if level == 1 else 13 if level == 2 else 12, BLUE if level < 3 else DARK, True)
    return p

doc = Document()
section = doc.sections[0]
section.top_margin = Inches(0.85); section.bottom_margin = Inches(0.8)
section.left_margin = Inches(1); section.right_margin = Inches(1)
section.header_distance = Inches(.492); section.footer_distance = Inches(.492)

styles = doc.styles
normal = styles['Normal']; normal.font.name = 'Calibri'; normal._element.rPr.rFonts.set(qn('w:ascii'), 'Calibri'); normal._element.rPr.rFonts.set(qn('w:hAnsi'), 'Calibri'); normal.font.size = Pt(11)
for name in ['Heading 1', 'Heading 2', 'Heading 3']:
    styles[name].font.name = 'Calibri'; styles[name]._element.rPr.rFonts.set(qn('w:ascii'), 'Calibri'); styles[name]._element.rPr.rFonts.set(qn('w:hAnsi'), 'Calibri')
for base, name in [('List Bullet', 'Bullet List'), ('List Number', 'Numbered List')]:
    s = styles.add_style(name, WD_STYLE_TYPE.PARAGRAPH); s.base_style = styles[base]

# Header/footer
hp = section.header.paragraphs[0]; set_para(hp, 0, 0, 1.0)
set_font(hp.add_run('HAPPY FARM  |  PROJECT OVERVIEW'), 8.5, MUTED, True)
fp = section.footer.paragraphs[0]; set_para(fp, 0, 0, 1.0, WD_ALIGN_PARAGRAPH.RIGHT)
set_font(fp.add_run('Tài liệu nội bộ • 28/10/2026'), 8.5, MUTED)

# Cover
add_text(doc, 'HAPPY FARM', before=8, after=2, bold=True, color=BLUE, size=26)
add_text(doc, 'Tài liệu tổng quan dự án web game học tiếng Anh', before=0, after=14, color=DARK, size=15)
add_text(doc, 'Phiên bản: 0.1 • Cập nhật: 28/10/2026 • Trạng thái: Prototype đang hoàn thiện', before=0, after=16, color=MUTED, size=10)

callout = doc.add_table(rows=1, cols=1); set_table_widths(callout, [9360]); c=callout.cell(0,0); set_cell_shading(c, PALE); set_cell_margins(c, 160, 200, 160, 200)
p=c.paragraphs[0]; set_para(p, 0, 0, 1.25); set_font(p.add_run('Mục tiêu: xây dựng trò chơi web trực quan cho trẻ em học 5 từ vựng tiếng Anh về động vật nông trại qua nghe, nhận biết hình ảnh và trả lời câu hỏi.'), 11, DARK, True)

heading(doc, '1. Phạm vi sản phẩm', 1)
add_text(doc, 'Happy Farm là game học từ vựng tiếng Anh chạy trên trình duyệt. Trải nghiệm tập trung vào một bản đồ nông trại, thẻ học từ vựng và mini-game “Who Am I?”.')
add_table(doc, ['Hạng mục', 'Nội dung bản hiện tại'], [
    ('Nhóm người dùng', 'Trẻ em mới bắt đầu học tiếng Anh; phụ huynh/giáo viên có thể hướng dẫn.'),
    ('Từ vựng', 'Cat, Dog, Cow, Pig, Duck — gồm tiếng Anh, phiên âm và nghĩa tiếng Việt.'),
    ('Màn hình', 'Welcome → Bản đồ → Học từ vựng → Quiz → Kết quả.'),
    ('Thiết bị', 'Desktop/tablet và điện thoại ngang; canvas thiết kế theo khung 1536 × 1024.'),
], [2200, 7160])

heading(doc, '2. Công nghệ & kiến trúc', 1)
add_table(doc, ['Lớp', 'Công nghệ', 'Vai trò'], [
    ('UI host', 'React 19 + TypeScript', 'Khởi tạo ứng dụng, khung hiển thị canvas và xử lý responsive.'),
    ('Game engine', 'Phaser 3.90', 'Scene, input, tương tác, animation, scale manager và rendering WebGL/Canvas.'),
    ('Build tool', 'Vite 8', 'Môi trường dev, HMR, build production.'),
    ('State cục bộ', 'Zustand + LocalStorage', 'Lưu sao/tiến độ trên thiết bị; không cần backend ở giai đoạn MVP.'),
    ('Âm thanh', 'Web Speech API (SpeechSynthesis)', 'Đọc từ tiếng Anh; có thể thay bằng file audio thu âm chuyên nghiệp.'),
    ('Triển khai', 'Static hosting', 'Build ra thư mục dist, có thể đưa lên Vercel, Netlify, Cloudflare Pages hoặc S3 + CDN.'),
], [1600, 2500, 5260])
add_text(doc, 'Kiến trúc mã nguồn', bold=True, color=DARK, size=11, before=5, after=3)
add_bullets(doc, [
    'src/game/scenes: các màn Boot, Welcome, Farm Map, Vocabulary, Quiz và Result.',
    'src/game/objects: thành phần Phaser tái sử dụng như GameButton và AnimalCard.',
    'src/game/config: cấu hình world 1536 × 1024, asset manifest và tọa độ khu vực bản đồ.',
    'src/game/systems: quản lý phát âm và lưu tiến độ.',
    'public/assets: tài nguyên tĩnh tải trực tiếp khi game khởi động.',
])

heading(doc, '3. Luồng trải nghiệm', 1)
add_numbered(doc, [
    'Boot/Loading: preload ảnh, audio và kiểm tra asset quan trọng.',
    'Welcome: giới thiệu Happy Farm, chọn Bắt đầu hoặc Hướng dẫn.',
    'Farm Map: người chơi chọn một trong 5 khu nông trại theo con vật.',
    'Vocabulary: xem ảnh con vật, tên tiếng Anh, phiên âm, nghĩa tiếng Việt và nghe phát âm.',
    'Quiz – Who Am I?: nghe từ, chọn một trong 5 con vật; phản hồi đúng/sai tức thì; chuyển câu tiếp theo.',
    'Result: hiển thị số câu đúng, sao đạt được, từ vừa học; chơi lại hoặc quay về bản đồ.',
])

heading(doc, '4. Asset cần chuẩn bị', 1)
add_text(doc, 'Nguyên tắc: dùng PNG/WebP nét, đồng nhất phong cách; ảnh nhân vật cần nền trong suốt. Không dùng ảnh screenshot có chữ hoặc nền caro bị bake vào ảnh.', before=0, after=8, color=DARK, bold=True)
add_table(doc, ['Nhóm asset', 'File/đầu vào cần có', 'Trạng thái'], [
    ('Nền chính', 'farm-map.png (bản sạch, không nhãn/marker), tối thiểu 3072 × 2048 px.', 'Có sẵn'),
    ('Lớp mây', 'cloud-layer-transparent.png, alpha thật, có thể lặp hoặc co giãn.', 'Có sẵn'),
    ('5 con vật', 'cat/dog/cow/pig/duck.png; PNG trong suốt, cùng khung hình, ≥ 1024 px chiều cao.', 'Có sẵn — cần chuẩn hoá'),
    ('Map marker', 'marker-*.png, badge-1…5.png, bảng tên nông trại và trạng thái khóa/mở.', 'Cần bổ sung'),
    ('Bộ UI', 'Nút blue/green/orange, khung card, progress bar, icon home/back/close/speaker.', 'Cần bổ sung'),
    ('Feedback', 'correct/wrong popup, sao rỗng/sao vàng, panel kết quả.', 'Cần bổ sung'),
    ('Audio', 'cat/dog/cow/pig/duck.mp3, click.mp3, correct.mp3, wrong.mp3, bgm.mp3.', 'Cần bổ sung'),
    ('Brand', 'Logo Happy Farm/Beacon, mascot và các phần trang trí nếu có quyền sử dụng.', 'Cần bổ sung'),
], [1750, 5900, 1710], 2)

heading(doc, '5. Hạ tầng & yêu cầu triển khai', 1)
add_table(doc, ['Hạng mục', 'Yêu cầu'], [
    ('Môi trường phát triển', 'Node.js LTS, npm, Git; chạy npm install và npm run dev.'),
    ('Build kiểm soát chất lượng', 'Mỗi thay đổi chạy npm run build; test desktop, tablet và điện thoại ngang.'),
    ('Hosting', 'Static hosting hỗ trợ HTTPS, cache asset và SPA fallback (nếu có routing về sau).'),
    ('Tên miền', 'Tên miền thương hiệu; DNS trỏ tới nền tảng hosting; SSL tự động.'),
    ('CDN/cache', 'Cache dài hạn cho file ảnh/audio có hash; có quy trình thay asset để tránh client dùng cache cũ.'),
    ('Phân tích sử dụng', 'Khuyến nghị GA4 hoặc PostHog: lượt mở game, chọn màn, hoàn thành quiz, tỷ lệ trả lời đúng.'),
    ('Quyền nội dung', 'Xác nhận quyền sử dụng toàn bộ hình minh hoạ, logo, âm thanh và font trước khi public.'),
], [2450, 6910])

heading(doc, '6. Tiêu chí nghiệm thu (MVP)', 1)
add_bullets(doc, [
    'Không có dải trống, crop sai hoặc canvas lệch khi thay đổi kích thước cửa sổ; toàn bộ đảo luôn thấy được ở chế độ FIT.',
    'Tất cả 5 animal choices đều click được ở mọi câu; trả lời đúng chuyển sang câu tiếp theo, trả lời sai cho phép thử lại.',
    'Có Back/Home rõ ràng ở Map, Vocabulary, Quiz và Result; không có ngõ cụt trong luồng chơi.',
    'Ảnh động vật hiển thị nền trong suốt, không có khung placeholder, nền đen hoặc checkerboard.',
    'Quiz đủ 5 câu; kết quả hiển thị điểm/sao chính xác và các CTA hoạt động.',
    'Không có lỗi console/blocking error; npm run build thành công trước khi bàn giao.',
])

heading(doc, '7. Kế hoạch hoàn thiện đề xuất', 1)
add_numbered(doc, [
    'Chốt bộ asset gốc và quy chuẩn tên/kích thước file.',
    'Thay UI primitive bằng các frame, button, marker và popup đúng thiết kế.',
    'Tích hợp audio thu âm, music và âm thanh phản hồi.',
    'Kiểm thử luồng end-to-end trên Chrome/Safari mobile, tablet và desktop.',
    'Triển khai staging, kiểm thử người dùng nhỏ, sau đó phát hành production.',
])

add_text(doc, 'Ghi chú bàn giao: tài liệu này mô tả MVP hiện tại. Để đạt độ khớp tuyệt đối với ảnh thiết kế, cần file thiết kế gốc hoặc bộ asset tách lớp có quyền sử dụng; ảnh tham chiếu không đủ để tái tạo chính xác từng pixel.', before=16, after=0, color=MUTED, size=9.5, italic=True)

doc.core_properties.title = 'Happy Farm – Tài liệu tổng quan dự án'
doc.core_properties.subject = 'Công nghệ, hạ tầng, asset, luồng và yêu cầu chuẩn bị'
doc.core_properties.author = 'Happy Farm Team'
doc.save(OUT)
print(OUT)

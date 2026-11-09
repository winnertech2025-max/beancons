from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / 'Bao-gia_Happy-Farm_4-trieu-VND.docx'
BLUE, DARK, INK, MUTED, PALE, GREEN, GOLD = '2E74B5', '1F4D78', '173A55', '5B6B78', 'E8EEF5', 'E8F5ED', 'FFF4D6'

def run_font(run, size=11, color=INK, bold=False, italic=False):
    run.font.name = 'Calibri'
    run._element.rPr.rFonts.set(qn('w:ascii'), 'Calibri')
    run._element.rPr.rFonts.set(qn('w:hAnsi'), 'Calibri')
    run.font.size = Pt(size); run.font.color.rgb = RGBColor.from_string(color)
    run.bold = bold; run.italic = italic

def para(p, before=0, after=6, line=1.1, align=None):
    pf = p.paragraph_format; pf.space_before = Pt(before); pf.space_after = Pt(after); pf.line_spacing = line
    if align is not None: p.alignment = align

def shade(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr(); e = OxmlElement('w:shd'); e.set(qn('w:fill'), color); tc_pr.append(e)

def margins(cell, top=80, start=120, bottom=80, end=120):
    tc_pr = cell._tc.get_or_add_tcPr(); e = tc_pr.first_child_found_in('w:tcMar')
    if e is None: e = OxmlElement('w:tcMar'); tc_pr.append(e)
    for side, value in [('top',top),('start',start),('bottom',bottom),('end',end)]:
        x=e.find(qn(f'w:{side}'))
        if x is None: x=OxmlElement(f'w:{side}'); e.append(x)
        x.set(qn('w:w'),str(value)); x.set(qn('w:type'),'dxa')

def table_width(table, widths):
    table.autofit = False; table.alignment = WD_TABLE_ALIGNMENT.LEFT
    pr=table._tbl.tblPr
    w=pr.first_child_found_in('w:tblW') or OxmlElement('w:tblW')
    if w.getparent() is None: pr.append(w)
    w.set(qn('w:w'),str(sum(widths))); w.set(qn('w:type'),'dxa')
    ind=pr.first_child_found_in('w:tblInd') or OxmlElement('w:tblInd')
    if ind.getparent() is None: pr.append(ind)
    ind.set(qn('w:w'),'120'); ind.set(qn('w:type'),'dxa')
    for col,val in zip(table._tbl.tblGrid.gridCol_lst,widths): col.set(qn('w:w'),str(val))
    for row in table.rows:
        for cell,val in zip(row.cells,widths):
            tcw=cell._tc.get_or_add_tcPr().tcW; tcw.set(qn('w:w'),str(val)); tcw.set(qn('w:type'),'dxa')

def heading(doc, text, level=1):
    p=doc.add_paragraph(style=f'Heading {level}')
    para(p, 16 if level==1 else 10, 8 if level==1 else 5, 1.1)
    run_font(p.add_run(text), 16 if level==1 else 12.5, BLUE if level==1 else DARK, True)
    return p

def text(doc, value, **kwargs):
    p=doc.add_paragraph(); para(p, kwargs.pop('before',0), kwargs.pop('after',6), kwargs.pop('line',1.1), kwargs.pop('align',None))
    run_font(p.add_run(value), **kwargs); return p

def bullet(doc, items):
    for item in items:
        p=doc.add_paragraph(style='Quote Bullet')
        p.paragraph_format.left_indent=Inches(.5); p.paragraph_format.first_line_indent=Inches(-.25)
        p.paragraph_format.space_after=Pt(5); p.paragraph_format.line_spacing=1.1
        run_font(p.add_run(item), 10.5)

def simple_table(doc, headers, rows, widths, total=False):
    t=doc.add_table(rows=1, cols=len(headers)); t.style='Table Grid'; table_width(t,widths)
    hdr=t.rows[0]
    for c, value in zip(hdr.cells,headers):
        shade(c, PALE); margins(c); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p=c.paragraphs[0]; para(p,0,0,1.0); run_font(p.add_run(value),10,DARK,True)
    for idx,row in enumerate(rows):
        cells=t.add_row().cells
        is_total=total and idx==len(rows)-1
        for i,(c,value) in enumerate(zip(cells,row)):
            margins(c); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            if is_total: shade(c,GREEN)
            p=c.paragraphs[0]; para(p,0,0,1.05, WD_ALIGN_PARAGRAPH.RIGHT if i==len(row)-1 else None)
            run_font(p.add_run(value),10, DARK if is_total else INK, is_total or i==0)
    p=doc.add_paragraph(); para(p,0,2,1)
    return t

doc=Document(); sec=doc.sections[0]
sec.top_margin=Inches(.8); sec.bottom_margin=Inches(.8); sec.left_margin=Inches(1); sec.right_margin=Inches(1)
sec.header_distance=Inches(.45); sec.footer_distance=Inches(.45)
styles=doc.styles
styles['Normal'].font.name='Calibri'; styles['Normal']._element.rPr.rFonts.set(qn('w:ascii'),'Calibri'); styles['Normal']._element.rPr.rFonts.set(qn('w:hAnsi'),'Calibri'); styles['Normal'].font.size=Pt(11)
for name in ['Heading 1','Heading 2']:
    styles[name].font.name='Calibri'; styles[name]._element.rPr.rFonts.set(qn('w:ascii'),'Calibri'); styles[name]._element.rPr.rFonts.set(qn('w:hAnsi'),'Calibri')
s=styles.add_style('Quote Bullet',WD_STYLE_TYPE.PARAGRAPH); s.base_style=styles['List Bullet']
hp=sec.header.paragraphs[0]; para(hp,0,0,1); run_font(hp.add_run('HAPPY FARM  |  BÁO GIÁ SẢN PHẨM WEB GAME'),8.5,MUTED,True)
fp=sec.footer.paragraphs[0]; para(fp,0,0,1,WD_ALIGN_PARAGRAPH.RIGHT); run_font(fp.add_run('Báo giá tham khảo • 29/10/2026'),8.5,MUTED)

text(doc,'BÁO GIÁ PHÁT TRIỂN',size=25,color=BLUE,bold=True,before=8,after=1)
text(doc,'Happy Farm – Web game học tiếng Anh cho trẻ em',size=15,color=DARK,bold=True,after=10)
text(doc,'Ngày báo giá: 29/10/2026  |  Hiệu lực báo giá: 15 ngày',size=10,color=MUTED,after=14)

box=doc.add_table(rows=1,cols=1); table_width(box,[9360]); c=box.cell(0,0); shade(c,GREEN); margins(c,160,200,160,200)
p=c.paragraphs[0]; para(p,0,0,1.15); run_font(p.add_run('TỔNG GIÁ TRỌN GÓI: 4.000.000 VND'),16,DARK,True)
p=c.add_paragraph(); para(p,2,0,1.1); run_font(p.add_run('Đã bao gồm hosting MaxSpeed 03 tháng: 1.470.000 VND. Chưa bao gồm domain; khách hàng tự mua và đứng tên sở hữu domain.'),10.5,INK)

heading(doc,'1. Giới thiệu sản phẩm',1)
text(doc,'Happy Farm là web game giáo dục dành cho trẻ em, tập trung vào việc kiểm tra trình độ và học tiếng Anh qua bối cảnh nông trại trực quan. Sau buổi trao đổi với khách hàng, sản phẩm sẽ được phát triển theo hướng có khoảng 6–7 trang trại/chủ đề; mỗi trang trại có một số trò chơi học tập ngắn, dễ tiếp cận và có phản hồi ngay.')
text(doc,'Điểm nhấn của sản phẩm',size=11,color=DARK,bold=True,before=3,after=4)
bullet(doc,[
    'Bản đồ nông trại sinh động, điều hướng trẻ em trực quan theo từng khu vực học.',
    'Khoảng 6–7 trang trại/chủ đề; mỗi trại có nội dung từ vựng và hoạt động tương tác riêng.',
    '02 trang trại là trò chơi lớn với luồng chơi/phần thưởng rõ ràng.',
    'Các dạng game dự kiến: Quiz Card, học từ vựng, nối từ vựng, chọn đồ vật sau khi nghe, nhận diện hình ảnh và hoạt động ôn tập.',
    'Lưu tiến độ, điểm/sao; hiển thị kết quả để phụ huynh hoặc giáo viên dễ theo dõi.',
])

heading(doc,'2. Phạm vi triển khai bao gồm',1)
simple_table(doc,['Nhóm công việc','Nội dung thực hiện'],[
 ('Tư vấn & luồng sản phẩm','Chốt cấu trúc 6–7 trang trại, luồng học, cơ chế điểm/sao, danh sách game và hành trình người dùng.'),
 ('Thiết kế giao diện','Thiết kế giao diện web game đồng bộ: trang chào, bản đồ, trang học, trang game, phản hồi đúng/sai và kết quả.'),
 ('Phát triển web game','Xây dựng frontend/gameplay, điều hướng giữa trang trại, tương tác click/touch, hiển thị responsive và lưu tiến độ cục bộ.'),
 ('Trò chơi học tập','Tích hợp các dạng Quiz Card, học từ vựng, nối từ vựng, nghe–chọn đồ vật và các biến thể phù hợp với từng trang trại.'),
 ('Kiểm thử & bàn giao','Kiểm thử luồng chơi, sửa lỗi chức năng, build production, đưa website lên hosting và bàn giao mã nguồn/hướng dẫn cơ bản.'),
],[2600,6760])

heading(doc,'3. Bảng báo giá chi tiết',1)
simple_table(doc,['STT','Hạng mục','Chi phí (VND)'],[
 ('1','Hosting MaxSpeed 03 tháng','1.470.000'),
 ('2','Phân tích yêu cầu, xây dựng luồng sản phẩm và kịch bản học','300.000'),
 ('3','Thiết kế UX/UI: bản đồ, trang trại, trang học, game và kết quả','500.000'),
 ('4','Lập trình nền tảng web game, 6–7 trang trại và cơ chế tiến độ/điểm','900.000'),
 ('5','Lập trình các dạng trò chơi, tích hợp nội dung và tương tác nghe/chọn/nối','500.000'),
 ('6','Kiểm thử, tối ưu hiển thị, triển khai hosting và bàn giao','330.000'),
 ('','TỔNG CỘNG','4.000.000'),
],[700,6500,2160],True)
text(doc,'Chi phí domain không nằm trong báo giá. Khách hàng tự chọn, tự thanh toán và sở hữu domain; bên triển khai hỗ trợ cấu hình trỏ domain vào hosting khi khách hàng cung cấp quyền truy cập cần thiết.',size=10,color=MUTED,italic=True,before=2,after=8)

heading(doc,'4. Hạ tầng & bàn giao',1)
bullet(doc,[
    'Hosting MaxSpeed sử dụng trong 03 tháng, đã tính trong tổng giá trị báo giá.',
    'Tên miền/domain: khách hàng tự mua; chi phí gia hạn domain các năm sau do khách hàng thanh toán.',
    'Website triển khai dạng web game, truy cập bằng trình duyệt trên máy tính, tablet và điện thoại ngang.',
    'Bàn giao mã nguồn website, thông tin triển khai và hướng dẫn vận hành cơ bản sau khi nghiệm thu.',
])

heading(doc,'5. Điều kiện thực hiện',1)
bullet(doc,[
    'Khách hàng cung cấp logo, nội dung bài học, hình ảnh/âm thanh có quyền sử dụng và phản hồi duyệt nội dung theo từng giai đoạn.',
    'Báo giá áp dụng cho phạm vi 6–7 trang trại và các nhóm trò chơi nêu trên; yêu cầu phát sinh ngoài phạm vi sẽ được thống nhất bổ sung trước khi thực hiện.',
    'Đề xuất thanh toán: 50% khi bắt đầu triển khai và 50% sau khi nghiệm thu/bàn giao.',
    'Thời gian triển khai cụ thể được chốt sau khi duyệt nội dung, asset và kịch bản của từng trang trại.',
])

text(doc,'Xác nhận báo giá',size=12,color=DARK,bold=True,before=18,after=8)
sign=doc.add_table(rows=1,cols=2); table_width(sign,[4680,4680])
for c,label in zip(sign.rows[0].cells,['ĐẠI DIỆN KHÁCH HÀNG','ĐẠI DIỆN ĐƠN VỊ TRIỂN KHAI']):
    margins(c,120,120,120,120); p=c.paragraphs[0]; para(p,0,40,1.0,WD_ALIGN_PARAGRAPH.CENTER); run_font(p.add_run(label),10,DARK,True)
    p=c.add_paragraph(); para(p,0,0,1.0,WD_ALIGN_PARAGRAPH.CENTER); run_font(p.add_run('(Ký và ghi rõ họ tên)'),9,MUTED,False,True)

doc.core_properties.title='Báo giá Happy Farm – 4.000.000 VND'
doc.core_properties.subject='Báo giá phát triển web game học tiếng Anh'
doc.core_properties.author='Happy Farm'
doc.save(OUT)
print(OUT)

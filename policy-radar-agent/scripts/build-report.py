from __future__ import annotations

from copy import deepcopy
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION_START
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "submission/template/百景大赛项目报告模板.docx"
TEMPLATE_URL = "https://file.100aicv.com/baijing/content_cover/2026-04/13d4ac84-b1b5-444f-9dd6-a42c7469b260.docx"
OUT = ROOT / "submission/final/AI政策搜索智能体+siuser小伟+项目报告.docx"
SCREENSHOTS = ROOT / "submission/work/screenshots"

INK = "16323C"
RED = "B63B2F"
PALE = "F2EFE7"
PALE_RED = "F4E4E0"
GREEN = "E2F0E7"
WHITE = "FFFFFF"


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=90, start=110, bottom=90, end=110) -> None:
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{margin}"))
        if node is None:
            node = OxmlElement(f"w:{margin}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_cell_width(cell, width_cm: float) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:w"), str(round(width_cm * 567)))
    tc_w.set(qn("w:type"), "dxa")


def set_repeat_table_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_run_font(run, name="Noto Sans CJK SC", size=10.5, bold=None, color=INK) -> None:
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if color:
        run.font.color.rgb = RGBColor.from_string(color)


def set_para_format(paragraph, before=0, after=5, line=1.45, keep=False) -> None:
    fmt = paragraph.paragraph_format
    fmt.space_before = Pt(before)
    fmt.space_after = Pt(after)
    fmt.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
    fmt.line_spacing = line
    fmt.keep_with_next = keep


def apply_pending_page_break(doc, paragraph) -> None:
    if getattr(doc, "_pending_page_break", False):
        paragraph.paragraph_format.page_break_before = True
        doc._pending_page_break = False


def add_text(doc, text: str, *, bold=False, color=INK, size=10.5, align=None, before=0, after=5):
    p = doc.add_paragraph()
    apply_pending_page_break(doc, p)
    if align is not None:
        p.alignment = align
    r = p.add_run(text)
    set_run_font(r, size=size, bold=bold, color=color)
    set_para_format(p, before=before, after=after)
    return p


def add_rich_paragraph(doc, parts, *, before=0, after=5, align=None):
    p = doc.add_paragraph()
    if align is not None:
        p.alignment = align
    for text, bold, color in parts:
        r = p.add_run(text)
        set_run_font(r, bold=bold, color=color)
    set_para_format(p, before=before, after=after)
    return p


def add_heading(doc, text: str, level=1, kicker: str | None = None):
    if kicker:
        p = doc.add_paragraph()
        apply_pending_page_break(doc, p)
        r = p.add_run(kicker.upper())
        set_run_font(r, name="Arial", size=8.5, bold=True, color=RED)
        p.paragraph_format.space_after = Pt(2)
    p = doc.add_paragraph(style=f"Heading {level}")
    apply_pending_page_break(doc, p)
    r = p.add_run(text)
    set_run_font(r, size=16 if level == 1 else 13, bold=True, color=INK)
    p.paragraph_format.space_before = Pt(4 if level == 1 else 7)
    p.paragraph_format.space_after = Pt(8 if level == 1 else 5)
    p.paragraph_format.keep_with_next = True
    return p


def add_bullets(doc, items, *, color=INK, size=10.2):
    for item in items:
        p = doc.add_paragraph()
        r = p.add_run("•  " + item)
        set_run_font(r, size=size, color=color)
        p.paragraph_format.left_indent = Cm(0.6)
        p.paragraph_format.first_line_indent = Cm(-0.25)
        set_para_format(p, after=3, line=1.35)


def add_numbered(doc, items):
    for index, item in enumerate(items, start=1):
        p = doc.add_paragraph()
        r = p.add_run(f"{index}.  {item}")
        set_run_font(r, size=10.2)
        p.paragraph_format.left_indent = Cm(0.65)
        p.paragraph_format.first_line_indent = Cm(-0.25)
        set_para_format(p, after=3, line=1.35)


def add_callout(doc, title: str, body: str, fill=PALE_RED, accent=RED):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    cell = table.cell(0, 0)
    set_cell_shading(cell, fill)
    set_cell_margins(cell, top=150, start=170, bottom=150, end=170)
    p = cell.paragraphs[0]
    r = p.add_run(title + "\n")
    set_run_font(r, size=10.5, bold=True, color=accent)
    r = p.add_run(body)
    set_run_font(r, size=9.8, color=INK)
    set_para_format(p, after=0, line=1.35)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)


def add_matrix(doc, headers, rows, widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False if widths else True
    hdr = table.rows[0]
    set_repeat_table_header(hdr)
    for idx, text in enumerate(headers):
        cell = hdr.cells[idx]
        set_cell_shading(cell, INK)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text)
        set_run_font(r, size=9.5, bold=True, color=WHITE)
        if widths:
            cell.width = Cm(widths[idx])
    for row_index, row in enumerate(rows):
        cells = table.add_row().cells
        for idx, text in enumerate(row):
            if row_index % 2 == 0:
                set_cell_shading(cells[idx], PALE)
            set_cell_margins(cells[idx])
            cells[idx].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cells[idx].paragraphs[0]
            r = p.add_run(str(text))
            set_run_font(r, size=9.2, bold=(idx == 0), color=INK)
            set_para_format(p, after=0, line=1.25)
            if widths:
                cells[idx].width = Cm(widths[idx])
    doc.add_paragraph().paragraph_format.space_after = Pt(1)
    return table


def add_picture(doc, path: Path, width_cm: float, caption: str):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    picture = p.add_run().add_picture(str(path), width=Cm(width_cm))
    picture._inline.docPr.set("title", caption)
    picture._inline.docPr.set("descr", caption)
    p.paragraph_format.space_after = Pt(3)
    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = c.add_run(caption)
    set_run_font(r, size=8.5, color="65747A")
    c.paragraph_format.space_after = Pt(6)


def add_hyperlink(paragraph, text: str, url: str):
    part = paragraph.part
    rel = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), rel)
    run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), RED)
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    r_pr.append(color)
    r_pr.append(underline)
    r_fonts = OxmlElement("w:rFonts")
    r_fonts.set(qn("w:eastAsia"), "Noto Sans CJK SC")
    r_fonts.set(qn("w:ascii"), "Arial")
    r_pr.append(r_fonts)
    run.append(r_pr)
    text_node = OxmlElement("w:t")
    text_node.text = text
    run.append(text_node)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def add_page_break(doc):
    doc._pending_page_break = True


def add_page_number(section) -> None:
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("— ")
    set_run_font(r, size=8, color="7B888C")
    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), "PAGE")
    p._p.append(fld)
    r = p.add_run(" —")
    set_run_font(r, size=8, color="7B888C")


def configure_styles(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Noto Sans CJK SC")
    normal.font.size = Pt(10.5)
    for level, size in ((1, 16), (2, 13), (3, 11.5)):
        style_name = f"Heading {level}"
        try:
            style = doc.styles[style_name]
        except KeyError:
            style = doc.styles.add_style(style_name, WD_STYLE_TYPE.PARAGRAPH)
            style.base_style = normal
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:eastAsia"), "Noto Sans CJK SC")
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(INK if level != 3 else RED)
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            run.font.name = "Noto Sans CJK SC"
            run._element.rPr.rFonts.set(qn("w:eastAsia"), "Noto Sans CJK SC")
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    for run in paragraph.runs:
                        run.font.name = "Noto Sans CJK SC"
                        run._element.rPr.rFonts.set(qn("w:eastAsia"), "Noto Sans CJK SC")


def fill_cover(doc):
    body = doc.element.body
    title_paragraph = next(p for p in doc.paragraphs if "百景大赛”项目报告" in p.text)
    table_element = doc.tables[0]._tbl
    for child in list(body):
        if child is table_element:
            break
        if child is not title_paragraph._p:
            body.remove(child)
    title_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_paragraph.paragraph_format.space_before = Pt(82)
    title_paragraph.paragraph_format.space_after = Pt(48)
    for run in title_paragraph.runs:
        set_run_font(run, size=24, bold=True, color=INK)

    table = doc.tables[0]
    values = [
        "智策雷达：AI 政策搜索与申报助手",
        "AI政策搜索智能体",
        "siuser小伟",
        "无",
        "个人参赛",
    ]
    for row, value in zip(table.rows, values):
        left, right = row.cells
        set_cell_shading(left, PALE)
        set_cell_margins(left, top=105, bottom=105)
        set_cell_margins(right, top=105, bottom=105)
        left.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        right.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        for run in left.paragraphs[0].runs:
            set_run_font(run, size=11, bold=True, color=INK)
        right.text = ""
        p = right.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(value)
        set_run_font(r, size=11.2, bold=(row is table.rows[0]), color=INK)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER


def remove_template_body_after_cover(doc):
    body = doc.element.body
    table_element = doc.tables[0]._tbl
    seen = False
    for child in list(body):
        if child is table_element:
            seen = True
            continue
        if seen and child.tag != qn("w:sectPr"):
            body.remove(child)


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if not TEMPLATE.exists():
        raise SystemExit(f"缺少大赛官方模板：{TEMPLATE}\n请从 {TEMPLATE_URL} 下载后再运行。")
    doc = Document(TEMPLATE)
    configure_styles(doc)
    fill_cover(doc)
    remove_template_body_after_cover(doc)
    section = doc.sections[0]
    add_page_number(section)

    add_text(doc, "作品口号：从政策海洋里，找出与你有关的那一条。", bold=True, color=RED, size=11, align=WD_ALIGN_PARAGRAPH.CENTER, before=10, after=2)
    add_text(doc, "在线演示与源码均已公开，所有政策结论可回到政府原文复核。", color="65747A", size=9.2, align=WD_ALIGN_PARAGRAPH.CENTER)

    # 第 2 页：目录
    add_page_break(doc)
    toc_title = add_text(doc, "目   录", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER, after=15)
    toc_title.paragraph_format.keep_with_next = True
    toc_rows = [
        ("01", "项目背景", "03"),
        ("02", "项目方案与技术路线", "05"),
        ("03", "作品效果", "09"),
        ("04", "作品的主要亮点", "13"),
        ("05", "项目前景与推广建议", "14"),
    ]
    table = doc.add_table(rows=0, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    for idx, (num, title, page) in enumerate(toc_rows):
        cells = table.add_row().cells
        set_cell_width(cells[0], 2.0)
        set_cell_width(cells[1], 10.2)
        set_cell_width(cells[2], 2.2)
        set_cell_shading(cells[0], RED if idx == 0 else INK)
        for c in cells:
            set_cell_margins(c, top=190, bottom=190)
        set_cell_margins(cells[2], top=190, start=30, bottom=190, end=30)
        p = cells[0].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(num)
        set_run_font(r, size=11, bold=True, color=WHITE)
        p = cells[1].paragraphs[0]
        r = p.add_run(title)
        set_run_font(r, size=12.5, bold=True, color=INK)
        p = cells[2].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(page)
        set_run_font(r, size=10, color=RED)
    for column, width in zip(table.columns, (2.0, 10.2, 2.2)):
        column.width = Cm(width)
    add_text(doc, "交付入口", bold=True, color=RED, size=11, before=18, after=5)
    p = add_text(doc, "在线演示：", bold=True, size=9.8, after=2)
    add_hyperlink(p, "打开智策雷达在线演示", "https://siuserxiaowei.github.io/policy-radar-agent/")
    p = add_text(doc, "GitHub 源码：", bold=True, size=9.8, after=2)
    add_hyperlink(p, "查看智策雷达 GitHub 源码仓库", "https://github.com/siuserxiaowei/policy-radar-agent")
    add_callout(doc, "报告阅读提示", "本报告按官方提纲组织，覆盖背景、方案、技术路线、作品效果、亮点与推广建议。演示样本已在 2026 年 8 月 4 日复核。")

    # 第 3 页：项目背景
    add_page_break(doc)
    add_heading(doc, "项目背景", 1, "01 / PROJECT BACKGROUND")
    add_rich_paragraph(doc, [
        ("智策雷达", True, RED),
        ("是一款面向制造业与中小企业的 AI 政策搜索与申报助手。它把分散的政府政策转化为“可搜索、可匹配、可解释、可追溯”的企业机会清单。", False, INK),
    ], after=8)
    add_heading(doc, "1.1 真实问题", 2)
    add_matrix(doc, ["企业痛点", "常见后果", "智策雷达应对"], [
        ["渠道分散", "需要逐个网站检索，容易漏掉地方政策", "机构白名单聚合与统一字段"],
        ["口径不一", "地区、对象、时限和支持方式难比较", "结构化地区/行业/规模/诉求"],
        ["适配难判", "看到政策但不知道是否与企业有关", "企业画像与多维匹配评分"],
        ["结论难证", "推荐理由不透明，难向团队解释", "命中依据与官方原文证据链"],
        ["窗口易错", "申报结束后才发现机会", "有效/已截止状态与复开提醒建议"],
    ], widths=[3.2, 5.4, 6.2])
    add_heading(doc, "1.2 目标用户与核心场景", 2)
    add_bullets(doc, [
        "制造业中小企业、专精特新企业、产业园区服务人员和政策顾问。",
        "企业输入地区、行业、规模与发展诉求，系统按匹配度输出优先政策。",
        "用户查看每条结果的命中依据、发布时间、状态和官方原文，再导出行动简报。",
    ])
    add_callout(doc, "项目定位", "不是通用聊天机器人，而是围绕政策检索、企业适配与证据追溯构建的垂直任务智能体。")

    # 第 4 页：总体方案
    add_page_break(doc)
    add_heading(doc, "项目方案与技术路线", 1, "02 / SOLUTION & TECHNOLOGY")
    add_heading(doc, "2.1 总体方案", 2)
    add_text(doc, "系统将一次政策研判拆成四个可验证阶段，每个阶段都保留结构化中间结果，避免“只给答案、不说明依据”。")
    add_matrix(doc, ["阶段", "输入", "处理", "输出"], [
        ["01 权威采集", "政府网站/政府公报", "来源白名单、HTTPS 与版本核验", "可信政策记录"],
        ["02 结构抽取", "政策原文", "抽取地区、对象、时限、支持方向", "统一政策字段"],
        ["03 画像匹配", "查询 + 企业画像", "同义概念扩展、多维加权排序", "匹配分与原因"],
        ["04 简报生成", "优先政策与证据", "组合机会、风险和行动建议", "Markdown 研判简报"],
    ], widths=[2.7, 3.6, 5.6, 3.3])
    add_heading(doc, "2.2 系统组件", 2)
    add_matrix(doc, ["组件", "当前实现", "生产扩展"], [
        ["政策数据层", "9 条经人工复核的政府政策样本", "定时采集、正文哈希与版本差异"],
        ["查询理解层", "中文规范化与同义概念扩展", "向量检索与重排序模型"],
        ["画像匹配层", "地区/行业/规模/诉求/状态加权", "行业规则库与可学习权重"],
        ["生成解释层", "确定性简报与证据引用", "授权大模型做结构化抽取与表述"],
        ["交互层", "响应式单页工作台", "账号、提醒、材料清单与协同"],
    ], widths=[3.1, 6.3, 5.8])
    add_callout(doc, "架构原则", "演示版本零运行依赖、离线可用；生产版本再按授权接入大模型与数据服务，降低比赛验收和后续迁移成本。", fill=GREEN, accent="2E7150")

    # 第 5 页：匹配与模型算力
    add_heading(doc, "技术路线细化", 1, "02.3 / MATCHING & COMPUTE")
    add_heading(doc, "2.3 可解释匹配", 2)
    add_text(doc, "查询理解先识别“人工智能、制造业、数字化、企业类型、申报、质量品牌、地区”等概念组，再按字段命中和企业画像计算分数。最终分数限制在 1—99，并输出最多四条直接原因。")
    add_matrix(doc, ["信号", "作用", "可见解释"], [
        ["标题/标签/摘要/支持方向", "判断政策主题与查询意图的相关性", "标题命中、主题标签吻合、政策内容相关"],
        ["地区覆盖", "优先本地政策，同时保留全国政策", "地区精准覆盖、全国政策覆盖"],
        ["行业与规模", "识别制造业、专精特新等适用对象", "行业匹配、企业规模匹配"],
        ["发展诉求", "连接数字化、AI 应用、资金、品牌诉求", "发展诉求匹配"],
        ["状态与时效", "有效政策加权、截止政策保留复开价值", "当前有效、已截止"],
    ], widths=[3.4, 6.3, 5.5])
    add_heading(doc, "2.4 大模型策略与算力评估", 2)
    add_bullets(doc, [
        "当前演示：使用确定性查询扩展、画像匹配和模板生成，不依赖外部模型，普通浏览器即可运行。",
        "生产抽取：可接入经过授权的通用大模型，以 JSON Schema 输出字段候选，再由规则与人工抽检复核。",
        "生产问答：采用检索增强生成，只允许基于已召回政策片段回答，并强制附官方来源。",
        "算力估算：演示端近似零服务端推理成本；生产端可用 7B—14B 量化模型或兼容 API，单次抽取按政策长度弹性调用。",
    ])
    add_callout(doc, "安全边界", "企业画像只在浏览器内存中计算；页面不使用 Cookie、分析脚本、广告脚本或第三方字体，也不上传企业名称、联系人、文件和搜索历史。")

    # 第 6 页：效果首屏
    add_page_break(doc)
    add_heading(doc, "作品效果", 1, "03 / PRODUCT RESULT")
    add_heading(doc, "3.1 首屏与检索入口", 2)
    add_text(doc, "页面以“政策雷达”为视觉隐喻，首页直接给出问题、搜索框、政策数量、有效机会、画像匹配数量和来源可信度，降低首次使用成本。")
    add_picture(doc, SCREENSHOTS / "01-dashboard-top.png", 15.7, "图 1  智策雷达首屏：检索入口、关键指标与政策雷达视觉")
    add_bullets(doc, [
        "默认示例问题为“东莞制造企业人工智能支持政策”，用户可直接按 Enter 开始研判。",
        "所有政策样本附政府官方网站链接，页面明确提示以官方最新通知为准。",
        "桌面端与移动端使用同一信息架构，避免演示环境切换造成流程差异。",
    ], size=9.7)

    # 第 7 页：画像与结果
    add_page_break(doc)
    add_heading(doc, "画像匹配与行动简报", 1, "03.2 / PROFILE MATCH")
    add_text(doc, "企业画像包含地区、行业、企业规模、发展诉求和现有能力。结果区按解释性分数排序，右侧同步生成三条优先机会与下一步动作。")
    add_picture(doc, SCREENSHOTS / "03-profile-match.png", 13.2, "图 2  专精特新 + 人工智能应用画像：政策排序与行动简报同步更新")
    add_matrix(doc, ["演示动作", "系统反馈"], [
        ["把企业规模切换为“专精特新”", "专精特新相关政策获得规模匹配权重"],
        ["把诉求切换为“人工智能应用”", "工业 AI、场景与算力政策优先"],
        ["点击“更新画像匹配”", "结果、命中理由、简报和匹配数量同步刷新"],
        ["点击“导出 Markdown 简报”", "生成包含作者、官方链接和行动建议的本地文件"],
    ], widths=[5.2, 10])

    # 第 8 页：证据与测试
    add_page_break(doc)
    add_heading(doc, "证据追溯与验证", 1, "03.3 / EVIDENCE & QA")
    add_text(doc, "每条政策卡片都可以打开证据详情，展示发布机构、政策状态、发布时间、匹配依据和原文证据，并提供政府原文入口。")
    add_picture(doc, SCREENSHOTS / "02-policy-evidence.png", 12.5, "图 3  东莞人工智能赋能制造业政策证据弹窗")
    add_heading(doc, "3.4 验证结果", 2)
    add_matrix(doc, ["验证项", "结果", "证据"], [
        ["核心引擎测试", "5/5 通过", "查询扩展、排序、状态、边界、简报"],
        ["源码完整性", "通过", "17 个源码文件、9 条政策样本"],
        ["浏览器交互", "通过", "证据弹窗、画像更新、简报导出均成功"],
        ["运行日志", "0 条错误/警告", "真实浏览器控制台检查"],
        ["移动端布局", "通过", "390×844 视口无横向溢出"],
        ["身份与隐私", "通过", "公开署名仅保留 siuser小伟"],
    ], widths=[4.0, 3.3, 7.9])

    # 第 9 页：亮点
    add_page_break(doc)
    add_heading(doc, "作品的主要亮点", 1, "04 / KEY HIGHLIGHTS")
    highlights = [
        ("01", "从“找政策”升级为“找适合我的政策”", "检索结果结合企业画像，输出可排序的机会清单，而非堆叠搜索链接。"),
        ("02", "每个分数都有原因", "标题、主题、地区、行业、规模、诉求和状态都能转化为用户可见解释。"),
        ("03", "官方原文证据链", "每条结论都保留政府来源，避免智能体生成内容脱离原文。"),
        ("04", "过期政策仍有价值", "已截止项目不简单删除，而是提示建立复开提醒并提前准备材料。"),
        ("05", "隐私优先的本地画像", "演示版不采集企业名称、联系人、文件和搜索历史，降低试用门槛。"),
        ("06", "零依赖可部署", "浏览器原生前端 + Node.js 标准库，源码可审、部署轻、GitHub Pages 可直接演示。"),
    ]
    table = doc.add_table(rows=0, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for num, title, body in highlights:
        cells = table.add_row().cells
        cells[0].width = Cm(1.6)
        cells[1].width = Cm(13.6)
        set_cell_shading(cells[0], RED)
        set_cell_shading(cells[1], PALE)
        for c in cells:
            set_cell_margins(c, top=55, bottom=55, start=135, end=135)
            c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cells[0].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(num)
        set_run_font(r, size=13, bold=True, color=WHITE)
        p = cells[1].paragraphs[0]
        r = p.add_run(title + "\n")
        set_run_font(r, size=9.8, bold=True, color=INK)
        r = p.add_run(body)
        set_run_font(r, size=8.5, color="52656C")
        set_para_format(p, after=0, line=1.18)
    add_callout(doc, "难点突破", "项目把“语义相关、企业适用、政策时效、证据可信”四个不同问题放进同一条可验证流程，并通过真实政策样本和浏览器验收闭环。", fill=GREEN, accent="2E7150")

    # 第 10 页：前景
    add_page_break(doc)
    add_heading(doc, "项目前景与推广建议", 1, "05 / ROADMAP")
    add_heading(doc, "5.1 落地路径", 2)
    add_matrix(doc, ["阶段", "周期", "目标", "关键指标"], [
        ["试点", "0—3 个月", "东莞制造业政策库与 10 家企业共创", "Top-5 召回率、引用正确率、节省检索时间"],
        ["扩展", "3—6 个月", "接入政策更新、提醒与材料清单", "更新时延、提醒触达率、材料完整率"],
        ["规模化", "6—12 个月", "面向园区/服务机构提供多租户能力", "活跃企业数、政策转化率、续用率"],
    ], widths=[2.3, 2.5, 6.2, 4.2])
    add_heading(doc, "5.2 希望获得的赛事支持", 2)
    add_bullets(doc, [
        "提供东莞政策目录、历史申报样本和字段口径，建立高质量评测集。",
        "对接园区、镇街和制造企业开展真实用户试点，验证节省时间与机会发现率。",
        "邀请主管部门和政策服务机构参与引用正确性、适用性与合规性评审。",
        "支持接入可控算力和大模型服务，用于结构化抽取、政策差异检测与材料核验。",
    ])
    add_heading(doc, "5.3 持续治理", 2)
    add_numbered(doc, [
        "政策版本治理：保存发布日期、正文哈希、失效状态和核验日期。",
        "模型效果治理：跟踪抽取准确率、召回率、引用正确率和更新时延。",
        "隐私治理：最小化采集、权限隔离、加密存储、可删除和操作审计。",
        "人工复核：资金、资格、时限等高影响结论必须回到官方原文确认。",
    ])
    add_callout(doc, "结语", "智策雷达的目标不是替企业做决定，而是让企业更早发现机会、更快理解适配理由，并始终能够回到权威原文。")
    add_text(doc, "项目成员：siuser小伟  ·  项目名称：智策雷达：AI 政策搜索与申报助手", bold=True, color=RED, size=9.4, align=WD_ALIGN_PARAGRAPH.CENTER, before=9)

    doc.core_properties.title = "智策雷达：AI 政策搜索与申报助手—百景大赛项目报告"
    doc.core_properties.subject = "AI政策搜索智能体"
    doc.core_properties.author = "siuser小伟"
    doc.core_properties.last_modified_by = "siuser小伟"
    doc.core_properties.keywords = "智策雷达, AI政策搜索智能体, 百景大赛"
    doc.core_properties.comments = ""
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    build()

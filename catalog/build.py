"""Render the reviewed public catalog. Does not fetch repositories or publish changes."""
import csv
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT=Path(__file__).parent
data=json.loads((ROOT/'catalog.json').read_text())
assert data['scope']=='公开目录'
for key,count in [('projects','projectCount'),('materials','materialCount')]:
    rows=data[key]
    assert len(rows)==data[count]
    assert len({r['id'] for r in rows})==len(rows)
    for row in rows:
        assert row['isPublic'] is True and row['visibility']=='公开',row['id']
        for field in ['title','purpose','status','sourceBasis','name']:
            assert isinstance(row[field],str) and row[field].strip(),(row['id'],field)
        for field in ['entryUrl','repoUrl','sourceUrl']:
            parsed=urlsplit(row[field])
            assert parsed.scheme=='https' and parsed.netloc and not parsed.username,(row['id'],field)
        assert row['topics'],row['id']

encoded=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('\u2028','\\u2028').replace('\u2029','\\u2029')
(ROOT/'catalog-data.js').write_text('window.CATALOG_DATA='+encoded+';\n')

def safe_cell(value):
    value=str(value)
    return "'"+value if value.startswith(('=','+','-','@','\t','\r')) else value

for key,filename in [('projects','项目清单.csv'),('materials','会议主题清单.csv')]:
    with (ROOT/filename).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.writer(f)
        w.writerow(['名称','用途','分类','主题','状态','维护状态','入口','仓库','原始标题','依据','日期'])
        for p in data[key]:
            w.writerow(map(safe_cell,[p['title'],p['purpose'],p['category'],' / '.join(p['topics']),p['status'],p['maintenance'],p['entryUrl'],p['repoUrl'],p['originalTitle'],p['sourceBasis'],p['archiveDate'] or p['updated']]))

lines=['# 项目与会议资料目录','',f'核对日期：{data["checkedAt"]}。公开目录。','',f'{data["projectCount"]} 个项目，{data["materialCount"]} 条资料入口；包含不同分段和整理版本，不等于独立会议场数。','', '[搜索与筛选目录](https://siuserxiaowei.github.io/catalog/) · [会议主题目录](https://siuserxiaowei.github.io/catalog/#view=meetings)','']
for cat in ['项目与网站','Skills 与自动化工具','会议与学习资料','实验、占位与历史','Fork 与上游参考']:
    lines+=['',f'## {cat}','']
    for p in data['projects']:
        if p['category']!=cat:continue
        lines += [f'### {p["title"]}','',f'- 用途：{p["purpose"]}',f'- 入口：[{p["entryLabel"]}]({p["entryUrl"]}) · [仓库]({p["repoUrl"]})',f'- 状态：{p["status"]}；维护状态：{p["maintenance"]}；最近推送：{p["updated"]}',f'- 核对：{p["sourceBasis"]}。{p["note"]}','']
(ROOT/'项目说明.md').write_text('\n'.join(lines))
print(f'校验及生成通过：{data["projectCount"]} 个公开项目，{data["materialCount"]} 条资料。')

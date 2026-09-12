(() => {
  'use strict';
  const data=window.CATALOG_DATA;
  const $=s=>document.querySelector(s);
  if(!data){$('#results').textContent='目录暂时无法读取，请刷新，或下载 CSV 清单。';return;}
  const categories=[...new Set(data.projects.map(p=>p.category))];
  const topicOrder=['AI 编程与 Agent','出海、增长与商业化','智能硬件与产品交付','创业、经营与合作','内容创作与社群','行业访谈与趋势','综合交流与学习'];
  const state={mode:'projects',facet:'',status:'',q:'',sort:'date',page:1};
  const size=20;
  function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function link(label,url,cls){const a=el('a',cls,label);if(/^https:\/\//.test(url)||!url.includes(':'))a.href=url;return a;}
  function urlState(){const p=new URLSearchParams(location.hash.slice(1));state.mode=p.get('view')==='meetings'?'materials':'projects';state.q=p.get('q')||'';state.facet=p.get('category')||'';state.status=p.get('status')||'';state.sort=p.get('sort')==='title'?'title':'date';state.page=1;}
  function save(){const p=new URLSearchParams();if(state.mode==='materials')p.set('view','meetings');if(state.q)p.set('q',state.q);if(state.facet)p.set('category',state.facet);if(state.status)p.set('status',state.status);if(state.sort==='title')p.set('sort','title');try{history.replaceState(null,'','#'+p);}catch{/* Local file previews can restrict history updates. */}}
  function base(){return data[state.mode];}
  function filtered(){const words=state.q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);return base().filter(p=>{
    const facet=state.mode==='projects'?p.category===state.facet:p.topics.includes(state.facet);
    const hay=[p.title,p.name,p.originalTitle,p.purpose,...p.topics].join(' ').toLocaleLowerCase();
    return (!state.facet||facet)&&(!state.status||p.status===state.status)&&words.every(w=>hay.includes(w));
  }).sort((a,b)=>state.sort==='title'?a.title.localeCompare(b.title,'zh-CN'):(state.mode==='projects'?b.updated:(b.archiveDate||b.updated||'')).localeCompare(state.mode==='projects'?a.updated:(a.archiveDate||a.updated||''))||(a.group||a.title).localeCompare(b.group||b.title,'zh-CN')||a.title.localeCompare(b.title,'zh-CN'));}
  function controls(){
    if($('#search').value!==state.q)$('#search').value=state.q;$('#sort').value=state.sort;
    document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
    $('#filter-title').textContent=state.mode==='projects'?'按项目类型':'按真实主题';
    const all=base(),facets=state.mode==='projects'?categories:topicOrder;
    const box=$('#facets');box.replaceChildren();
    for(const name of ['',...facets]){const count=all.filter(p=>!name||(state.mode==='projects'?p.category===name:p.topics.includes(name))).length;if(!count&&name)continue;const b=el('button','facet');b.type='button';b.setAttribute('aria-pressed',String(name===state.facet));b.append(el('span','',name||'全部'),el('span','',String(count)));b.addEventListener('click',()=>{state.facet=name;state.page=1;render();});box.append(b);}
    const select=$('#status-filter');select.replaceChildren(new Option('全部状态',''));for(const s of [...new Set(all.map(p=>p.status))])select.add(new Option(s,s));select.value=state.status;
    $('#csv-link').href=state.mode==='projects'?'项目清单.csv':'会议主题清单.csv';
    $('#context').textContent=state.mode==='projects'?'每个项目说明用途与入口；点开“原始信息与关联”可以核对来源和维护状态。':'包含独立会议仓库及合集内部条目；同场分段和不同整理版本保留，条目数不等于会议场数。';
  }
  function card(p,i){
    const article=el('article','item');article.dataset.id=p.id;
    const content=el('div','item-main'),top=el('div','item-top');
    top.append(el('span','ordinal',String(i+1).padStart(3,'0')),el('span','',state.mode==='projects'?p.category:p.name));
    const date=state.mode==='projects'?p.updated:(p.archiveDate||p.updated);
    if(date)top.append(el('time','',(state.mode==='projects'||!p.archiveDate?'最近推送 ':'资料标注日期 ')+date));
    const h=el('h3');h.append(link(p.title,p.entryUrl));content.append(top,h,el('p','purpose',p.purpose));
    const tags=el('div','tags');p.topics.forEach(t=>tags.append(el('span','tag',t)));content.append(tags);
    const side=el('div','item-side');side.append(el('span','state',p.status),link(p.entryLabel+' ↗',p.entryUrl,'entry'),link('GitHub 仓库 ↗',p.repoUrl,'repo-link'));
    const details=el('details');details.append(el('summary','', '原始信息与关联'));
    const original=el('div','original');original.append(el('p','', '原始标题：'+p.originalTitle),el('p','', '仓库：'+p.name),el('p','', '依据：'+p.sourceBasis));
    original.append(link('查看依据 ↗',p.sourceUrl));
    if(state.mode==='projects')original.append(el('p','', '维护状态：'+p.maintenance+'。'+p.note));
    if(p.related?.length){const rel=el('div','related');p.related.forEach(r=>rel.append(link(r.relation+'：'+r.name,r.url)));original.append(rel);}
    details.append(original);article.append(content,side,details);return article;
  }
  function render(){
    controls();const rows=filtered(),pages=Math.max(1,Math.ceil(rows.length/size));state.page=Math.min(state.page,pages);
    $('#result-heading').textContent=state.facet||(state.mode==='projects'?'全部项目':'全部会议主题');
    $('#result-count').textContent=`找到 ${rows.length} ${state.mode==='projects'?'个项目':'条资料'} · ${data.scope}`;
    const target=$('#results');target.replaceChildren();
    const offset=(state.page-1)*size;
    rows.slice(offset,offset+size).forEach((p,i)=>target.append(card(p,offset+i)));
    if(!rows.length){const empty=el('div','empty');empty.append(el('strong','','没有找到匹配内容'),el('span','','试试更短的关键词，或清除主题和状态筛选。'));target.append(empty);}
    $('#page-info').textContent=`${state.page} / ${pages}`;$('#previous').disabled=state.page<=1;$('#next').disabled=state.page>=pages;
    save();
  }
  $('#project-count').textContent=data.projectCount;$('#material-count').textContent=data.materialCount;$('#checked-date').textContent=data.checkedAt;$('#scope').textContent=data.scope;
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;state.facet='';state.status='';state.page=1;render();}));
  $('#search-form').addEventListener('submit',e=>e.preventDefault());
  $('#search').addEventListener('input',e=>{state.q=e.target.value;state.page=1;render();$('#search').focus();});
  $('#status-filter').addEventListener('change',e=>{state.status=e.target.value;state.page=1;render();});
  $('#sort').addEventListener('change',e=>{state.sort=e.target.value;state.page=1;render();});
  $('#reset').addEventListener('click',()=>{state.q='';state.facet='';state.status='';state.page=1;render();});
  for(const [id,delta] of [['previous',-1],['next',1]])$('#'+id).addEventListener('click',()=>{state.page+=delta;render();$('#results').focus();$('#result-heading').scrollIntoView({block:'start',behavior:'auto'});});
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('#search').focus();}});
  window.addEventListener('hashchange',()=>{urlState();render();});
  urlState();render();
})();

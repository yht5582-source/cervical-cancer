const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const form=$('#path-form'), result=$('#result');

function readForm(){const d=Object.fromEntries(new FormData(form));d.pregnant=!!d.pregnant;return d;}
function syncFields(d){
  const meta=d.stage==='metastatic'||d.nodes==='distant';
  $('#pdl1-field').hidden=!meta;
  $('#lvsi-field').hidden=!['ia1','ia2','ib1','ib2'].includes(d.stage);
}
function renderPath(){
  const d=readForm();syncFields(d);
  const r=CC.pathway(d);
  result.innerHTML=`<p class="eyebrow">TEACHING PATHWAY · ${esc(r.stageLabel)}</p><h3>${esc(r.title)}</h3><ul>${r.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${r.warnings.map(w=>`<p class="warn">⚠ ${esc(w)}</p>`).join('')}<p class="small">依 ESGO/ESTRO/ESP 2023 與 FDA 核准範圍整理；具體處置請以原始指引與多專科會議核對。</p>`;
}
form.addEventListener('change',renderPath);
form.addEventListener('submit',e=>{e.preventDefault();renderPath();if(matchMedia('(max-width:850px)').matches)result.scrollIntoView({behavior:'smooth',block:'start'});});
form.addEventListener('reset',()=>setTimeout(renderPath));

function shuffle(n){const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function renderSet(items,target,kind){
  const box=$(target),isCase=kind==='病例';
  let answered=0,correct=0;
  const score=isCase?null:$('#quiz-score');
  const updateScore=()=>{if(score)score.textContent=answered?`得分 ${correct} / ${answered}（共 ${items.length} 題）`:`共 ${items.length} 題，首次作答計分`;};
  box.innerHTML=items.map((x,i)=>{
    const order=shuffle(x.options.length);
    return `<article class="${isCase?'case':'quiz-item'}"><small>${kind} ${String(i+1).padStart(2,'0')}</small><h3>${esc(isCase?x.title:x.q)}</h3>${isCase?`<p>${esc(x.stem)}</p>`:''}<div class="options">${order.map((k,j)=>`<button class="choice" type="button" data-k="${k}">${String.fromCharCode(65+j)}　${esc(x.options[k])}</button>`).join('')}</div><div class="feedback" hidden aria-live="polite"></div></article>`;
  }).join('');
  box.querySelectorAll('article').forEach((card,i)=>{
    const x=items[i];let done=false;
    card.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
      const ok=Number(btn.dataset.k)===x.answer;
      if(!done){done=true;answered++;if(ok)correct++;updateScore();}
      card.querySelectorAll('.choice').forEach(b=>{b.classList.toggle('selected',b===btn);b.classList.toggle('right',Number(b.dataset.k)===x.answer);b.classList.toggle('wrong',b===btn&&!ok);});
      const fb=card.querySelector('.feedback');fb.hidden=false;fb.className='feedback '+(ok?'ok':'no');
      fb.textContent=`${ok?'答對了':'再核對指引'}。${x.explain}`;
    }));
  });
  updateScore();
}

renderPath();
renderSet(CC.cases,'#case-list','病例');
renderSet(CC.quiz,'#quiz-list','考題');
$('#reset-quiz').addEventListener('click',()=>{renderSet(CC.quiz,'#quiz-list','考題');$('#quiz').scrollIntoView({behavior:'smooth'});});

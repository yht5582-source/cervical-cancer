const test=require('node:test');
const assert=require('node:assert/strict');
require('../clinical.js');
const {pathway,cases,quiz}=globalThis.CC;
const txt=r=>r.points.concat(r.warnings).join(' ');

test('pregnancy overrides every stage',()=>{
  assert.equal(pathway({stage:'metastatic',pregnant:true}).code,'pregnancy');
  assert.equal(pathway({stage:'ib1',pregnant:'on'}).code,'pregnancy');
});

test('metastatic: PD-L1 drives pembrolizumab text',()=>{
  assert.match(txt(pathway({stage:'metastatic',pdl1:'positive'})),/加 pembrolizumab/);
  const neg=txt(pathway({stage:'metastatic',pdl1:'negative'}));
  assert.match(neg,/CPS <1：建議含鉑化療 ± bevacizumab/);
  assert.match(txt(pathway({stage:'metastatic'})),/先檢驗 PD-L1/);
  assert.match(txt(pathway({stage:'metastatic'})),/cemiplimab/);
});

test('distant disease on any stage routes to metastatic',()=>{
  assert.equal(pathway({stage:'ib1',nodes:'distant'}).code,'metastatic');
});

test('nodal disease = IIIC, warns on fertility and early-stage label',()=>{
  const r=pathway({stage:'ib1',nodes:'pelvic',fertility:'yes'});
  assert.equal(r.code,'iiic1');
  assert.equal(r.warnings.length,2);
  assert.match(txt(r),/FIGO 2014 III–IVA/);
  assert.equal(pathway({stage:'locally',nodes:'para'}).code,'iiic2');
  assert.match(txt(pathway({stage:'locally',nodes:'para'})),/主動脈旁。/);
});

test('IA1: LN staging per LVSI, radical surgery is overtreatment',()=>{
  assert.match(txt(pathway({stage:'ia1',lvsi:'negative'})),/不需淋巴結分期/);
  assert.match(txt(pathway({stage:'ia1',lvsi:'positive'})),/可考慮前哨淋巴結/);
  assert.match(txt(pathway({stage:'ia1'})),/過度治療/);
  assert.match(txt(pathway({stage:'ia1',histology:'adeno'})),/單純子宮切除/);
  assert.ok(pathway({stage:'ia1',nodes:'unknown',lvsi:'negative'}).warnings.length);
  assert.equal(pathway({stage:'ia1',nodes:'unknown',lvsi:'positive'}).warnings.length,0);
});

test('IA2: SLN should be done if LVSI positive',()=>{
  assert.match(txt(pathway({stage:'ia2',lvsi:'positive'})),/應做前哨/);
  assert.match(txt(pathway({stage:'ia2',fertility:'yes'})),/保留生育手術/);
});

test('IB1 fertility sparing only for <2 cm HPV-associated histology',()=>{
  assert.match(txt(pathway({stage:'ib1',fertility:'yes'})),/可評估保留生育/);
  const other=pathway({stage:'ib1',fertility:'yes',histology:'other'});
  assert.doesNotMatch(txt(other),/可評估保留生育/);
  assert.equal(other.warnings.length,1);
  const big=pathway({stage:'ib2',fertility:'yes'});
  assert.doesNotMatch(txt(big),/可評估保留生育/);
  assert.match(big.warnings[0],/實驗性質/);
});

test('IB1 mentions SHAPE, IB2 does not',()=>{
  assert.match(txt(pathway({stage:'ib1'})),/SHAPE/);
  assert.doesNotMatch(txt(pathway({stage:'ib2'})),/SHAPE/);
  assert.match(txt(pathway({stage:'ib2'})),/輔助放化療/);
});

test('locally advanced: brachytherapy, FIGO 2014 caveat, nodes unknown warning',()=>{
  const r=pathway({stage:'locally',nodes:'unknown',fertility:'yes'});
  assert.equal(r.code,'locally');
  assert.match(txt(r),/近接治療/);
  assert.match(txt(r),/FIGO 2014 III–IVA/);
  assert.equal(r.warnings.length,2);
});

test('every input combination returns content',()=>{
  for(const stage of ['ia1','ia2','ib1','ib2','locally','metastatic'])
  for(const nodes of ['negative','pelvic','para','distant','unknown'])
  for(const lvsi of ['unknown','negative','positive'])
  for(const fertility of ['no','yes'])
  for(const histology of ['scc','adeno','other']){
    const r=pathway({stage,nodes,lvsi,fertility,histology});
    assert.ok(r.title&&r.points.length>=2&&r.points.every(Boolean),`${stage}/${nodes}/${lvsi}/${fertility}/${histology}`);
  }
});

test('case and quiz banks are well-formed',()=>{
  assert.equal(cases.length,6);assert.equal(quiz.length,10);
  for(const x of [...cases,...quiz]){
    assert.equal(x.options.length,3);
    assert.ok(x.answer>=0&&x.answer<3);
    assert.ok(x.explain);
  }
});

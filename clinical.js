/* 子宮頸癌教學分流引擎：純函式，瀏覽器與 node 測試共用。依據 ESGO/ESTRO/ESP 2023、FIGO 2018、FDA 核准範圍。 */
(function(root){
const STAGES={
  ia1:'IA1（侵襲 <3 mm）',
  ia2:'IA2（侵襲 3–<5 mm）',
  ib1:'IB1（≥5 mm 侵襲、<2 cm）',
  ib2:'IB2／IIA1（2–<4 cm）',
  locally:'IB3／IIA2／IIB–IVA 局部晚期',
  metastatic:'IVB 或無法根治的復發'
};

function pathway(input){
  const d=Object.assign({stage:'ib1',nodes:'negative',lvsi:'unknown',fertility:'no',histology:'scc',pdl1:'unknown',pregnant:false},input||{});
  const pregnant=d.pregnant===true||d.pregnant==='on'||d.pregnant==='true';
  const early=['ia1','ia2','ib1','ib2'].includes(d.stage);
  const warnings=[];
  let code,title,points;

  if(pregnant){
    code='pregnancy';
    title='懷孕中的子宮頸癌：轉介具經驗的專家中心';
    points=['確認組織診斷、孕週、病灶範圍與母胎目標；治療應在具婦癌與母胎醫學經驗的中心進行。',
      '分期影像以骨盆 MRI 或專家超音波為主，避免釓顯影劑與 PET-CT；淋巴結與遠端評估優先全身 DWI-MRI，無法取得時用胸部 CT 加腹部遮蔽。',
      '依期別、孕週與意願，可討論延後治療、孕期化療（14 週後）或依非懷孕標準處置；建議剖腹生產。'];
  }else if(d.stage==='metastatic'||d.nodes==='distant'){
    code='metastatic';
    title='遠端轉移／無法根治復發';
    const first=d.pdl1==='positive'
      ?'PD-L1 CPS ≥1：建議含鉑化療（carboplatin 或 cisplatin + paclitaxel）加 pembrolizumab，評估腸胃道／泌尿道瘻管風險後可加 bevacizumab。'
      :d.pdl1==='negative'
        ?'PD-L1 CPS <1：建議含鉑化療 ± bevacizumab；pembrolizumab 合併化療的核准與 ESGO 建議限 CPS ≥1。'
        :'先檢驗 PD-L1（CPS）：CPS ≥1 可加 pembrolizumab；未知時不能預設適用。';
    points=['完整評估病灶範圍、既往放療野與鉑類治療史；寡轉移或照射野外復發可討論局部根治性治療。',
      first,
      '一線鉑類後進展：ESGO 2023 建議未用過免疫治療者可用 cemiplimab（不論 PD-L1）；FDA 另核准 tisotumab vedotin（注意眼毒性）。核准與給付依所在地核對。',
      '強烈建議評估臨床試驗並同步安寧緩和照護。'];
  }else if(d.nodes==='pelvic'||d.nodes==='para'){
    code=d.nodes==='pelvic'?'iiic1':'iiic2';
    title=d.nodes==='pelvic'?'骨盆淋巴結陽性：FIGO IIIC1':'主動脈旁淋巴結陽性：FIGO IIIC2';
    points=['註明 r（影像）或 p（病理），並保留原始局部腫瘤範圍資訊。',
      '以根治性外照射合併每週 cisplatin 與影像導引近接治療為主；陽性淋巴結加量，'+(d.nodes==='para'?'照射野延伸至主動脈旁。':'依淋巴結位置與數目決定是否預防性照射主動脈旁。'),
      '避免根治性手術合併術後放療；術中發現淋巴結轉移應中止子宮切除、改行放化療。',
      'Pembrolizumab 合併放化療的 FDA 核准使用 FIGO 2014 III–IVA；不能只以 FIGO 2018 IIIC 判定適用。'];
    if(early) warnings.push('淋巴結陽性即為 FIGO 2018 IIIC，原局部期別僅作腫瘤範圍描述。');
    if(d.fertility==='yes') warnings.push('淋巴結陰性是保留生育的前提；淋巴結陽性不適合保留生育治療。');
  }else if(d.stage==='ia1'){
    code='ia1';
    title='IA1：錐狀切除為主的局部治療';
    points=['診斷需依完整錐切標本：侵襲深度、切緣、LVSI 由專家病理判讀；切緣陽性（陰道部 LSIL 除外）應再次錐切。',
      d.lvsi==='positive'?'LVSI 陽性：可考慮前哨淋巴結切片（不需額外骨盆淋巴結廓清）。':d.lvsi==='negative'?'LVSI 陰性：不需淋巴結分期。':'先確認 LVSI：陰性者不需淋巴結分期，陽性者可考慮前哨淋巴結。',
      d.fertility==='yes'?'切緣乾淨的錐切可作為最終治療，並嚴謹追蹤 HPV 與細胞學。':'錐切即可作為最終治療（子宮切除不改善預後）'+(d.histology!=='scc'?'；腺癌且已完成生育者建議單純子宮切除。':'；亦可依個人狀況選擇單純子宮切除。'),
      '根治性子宮切除、子宮頸根除或子宮旁切除屬過度治療。'];
  }else if(d.stage==='ia2'){
    code='ia2';
    title='IA2：錐切或單純子宮切除';
    points=['切緣乾淨的錐切，或單純子宮切除，即為適當治療；不需子宮旁切除。',
      d.lvsi==='positive'?'LVSI 陽性：應做前哨淋巴結切片。':d.lvsi==='negative'?'LVSI 陰性：可考慮前哨淋巴結切片。':'先確認 LVSI：陰性可考慮、陽性應做前哨淋巴結切片。',
      d.fertility==='yes'?'希望生育：錐切或單純子宮頸切除皆為適當的保留生育手術（不論 LVSI）。':d.histology!=='scc'?'腺癌且已完成生育者建議單純子宮切除。':'無生育需求可選單純子宮切除。'];
  }else if(d.stage==='ib1'||d.stage==='ib2'){
    const small=d.stage==='ib1';
    code=small?'ib1':'ib2';
    title=small?'IB1（<2 cm）：手術為優先':'IB2／IIA1（2–<4 cm）：手術為優先';
    points=[d.nodes==='unknown'?'淋巴結狀態未定：先完成骨盆 MRI；影像可疑淋巴結時加做 PET-CT 或胸腹 CT，手術時以淋巴結評估為第一步。':'淋巴結評估是手術第一步：前哨淋巴結（ICG）加術中冰凍切片；術中發現轉移即中止子宮切除、改行根治性放化療。',
      '根治性子宮切除以開腹為標準；微創僅限 <2 cm 且錐切切緣乾淨的低風險腫瘤、於高量中心。',
      small?'低風險（IA2–IB1、≤2 cm、間質侵襲 <10 mm、影像無淋巴結轉移）可依 SHAPE 試驗討論單純子宮切除加淋巴結評估。':'術前已知多項風險因子（需輔助治療）時，直接選擇根治性放化療＋近接治療，避免手術合併放療。',
      '術後高風險（淋巴結轉移、切緣陽性、子宮旁侵犯）→ 輔助放化療；中風險（腫瘤大小、LVSI、間質侵襲深度組合）→ 考慮輔助放療或觀察。'];
    if(d.fertility==='yes'){
      if(small&&d.histology!=='other') points.splice(1,0,'可評估保留生育（鱗狀細胞癌或 HPV 相關腺癌、<2 cm、淋巴結陰性）：先做前哨淋巴結；LVSI 陰性可錐切或單純子宮頸切除，LVSI 陽性以根治性子宮頸切除為主。需轉介生育腫瘤諮詢並經多專科會議。');
      else warnings.push(small?'少見或非 HPV 相關組織型不建議保留生育治療。':'腫瘤 >2 cm 保留生育的復發風險顯著較高，屬實驗性質，僅限專家中心或試驗；可先討論卵巢移位、卵子／胚胎冷凍。');
    }
  }else{
    code='locally';
    title='局部晚期：根治性同步放化療＋近接治療';
    points=['分期：骨盆 MRI 加 PET-CT（無則胸腹 CT）；影像主動脈旁陰性時可考慮主動脈旁淋巴結廓清分期。',
      '外照射 45 Gy/25 次或 46 Gy/23 次（IMRT/VMAT）合併每週 cisplatin；不適用 cisplatin 可考慮 carboplatin。',
      '必須有影像導引近接治療（優先 MRI），總治療時間以 ≤7 週為目標；不可用外照射加量取代近接治療。',
      '放化療後不建議常規輔助化療或補做子宮切除；ESGO 2023 不建議試驗外的前導化療，但 2024 INTERLACE 試驗顯示 6 週誘導 carboplatin/paclitaxel 改善存活，是否採用由團隊討論。',
      'Pembrolizumab 合併放化療：FDA 核准範圍為 FIGO 2014 III–IVA；IB3／IIA2／IIB 淋巴結陰性者不在此範圍。'];
    if(d.nodes==='unknown') warnings.push('尚未完成淋巴結／遠端評估：放化療前建議 PET-CT 以決定照射野。');
    if(d.fertility==='yes') warnings.push('局部晚期不適合保留生育手術；可在治療前討論卵巢移位與生育保存。');
  }
  if(d.nodes==='unknown'&&(d.stage==='ia1'||d.stage==='ia2')&&d.lvsi!=='positive'&&code===d.stage){
    warnings.push('IA 期 LVSI 陰性不需常規淋巴結分期；淋巴結選項可維持「尚未完成」。');
  }
  return {code,title,points,warnings,stageLabel:STAGES[d.stage]||''};
}

const cases=[
  {title:'接觸性出血與異常抹片',stem:'42 歲接觸性出血，HSIL 抹片且子宮頸可見病灶。',options:['安排子宮頸活檢確認病理','直接以抹片判定侵襲癌','五年後追蹤'],answer:0,explain:'侵襲癌需組織病理確診；有症狀且可見病灶須立即切片，抹片或 HPV 陽性不等於癌症。'},
  {title:'IA1 與生育意願',stem:'29 歲，錐切病理 IA1、切緣陰性、無 LVSI，希望懷孕。',options:['錐切即為最終治療並追蹤，不需淋巴結分期','所有病人都必須根治性子宮切除','先給同步放化療'],answer:0,explain:'ESGO 2023：IA1 錐切可為最終治療，LVSI 陰性不需淋巴結分期，根治性手術屬過度治療。'},
  {title:'IB1 低風險病灶',stem:'43 歲、1.5 cm 鱗狀細胞癌、錐切間質侵襲 6 mm，無生育需求；影像無淋巴結轉移。',options:['核對低風險條件後，討論單純子宮切除加淋巴結評估','一律視為 IVB','省略淋巴結評估'],answer:0,explain:'SHAPE 試驗（IA2–IB1、≤2 cm、侵襲 <10 mm）：單純子宮切除 3 年骨盆復發率 2.52% vs 根治性 2.17%，不劣於且併發症較少；淋巴結評估仍不可省略。'},
  {title:'骨盆淋巴結陽性',stem:'3 cm 子宮頸病灶，PET 顯示骨盆淋巴結陽性，無遠端病灶。',options:['記錄 IIIC1r，並討論根治性放化療加近接治療','依 3 cm 直接判為 IB2，忽略淋巴結','省略近接治療'],answer:0,explain:'FIGO 2018 淋巴結陽性為 IIIC1r；治療以放化療為主，陽性淋巴結加量，避免手術合併放療。'},
  {title:'局部晚期與免疫治療',stem:'FIGO 2014 IIIB，擬接受含鉑同步放化療。',options:['核對適應症並討論 pembrolizumab 合併放化療','僅做全身免疫治療而省略放射治療','FIGO 2018 IIIC 等同 FDA 的 2014 III–IVA'],answer:0,explain:'FDA 核准 pembrolizumab 合併放化療的範圍以 FIGO 2014 III–IVA 描述，分期版本需核對。'},
  {title:'遠端復發與 PD-L1',stem:'根治治療後肺多處轉移，PD-L1 CPS 5，轉移病程尚未化療。',options:['含鉑／paclitaxel 加 pembrolizumab，評估後可加 bevacizumab','依 HPV 陽性直接給藥，不看 PD-L1','只做子宮頸錐切'],answer:0,explain:'CPS ≥1 的一線治療為含鉑化療加 pembrolizumab ± bevacizumab；bevacizumab 前需評估瘻管風險。'}
];

const quiz=[
  {q:'FIGO 2018 IIIC2 指何種轉移？',options:['主動脈旁淋巴結','僅骨盆淋巴結','肝臟'],answer:0,explain:'IIIC1 為骨盆、IIIC2 為主動脈旁淋巴結，附記 r（影像）或 p（病理）。'},
  {q:'IA1 的間質侵襲深度？','options':['<3 mm','3–<5 mm','≥5 mm'],answer:0,explain:'IA1 <3 mm、IA2 3–<5 mm；≥5 mm 即為 IB。'},
  {q:'抹片 HSIL 且可見病灶的下一步？',options:['組織活檢','直接判定分期','常規五年追蹤'],answer:0,explain:'組織病理是侵襲癌診斷基礎。'},
  {q:'IIB 主要代表？',options:['子宮旁侵犯，未達骨盆壁','僅限子宮頸','遠端轉移'],answer:0,explain:'IIB 為子宮旁（parametrium）侵犯但未達骨盆壁。'},
  {q:'局部晚期根治性放射治療不可缺少的組成？',options:['外照射加影像導引近接治療','僅外照射加量即可','術後補做子宮切除'],answer:0,explain:'近接治療是根治策略關鍵；放化療後補做子宮切除不改善存活。'},
  {q:'FIGO IIIC1r 中 r 代表？',options:['影像證實','病理證實','復發'],answer:0,explain:'r 為 imaging，p 為 pathology。'},
  {q:'保留生育治療的必要前提？',options:['淋巴結陰性（先做前哨淋巴結）','腫瘤可大於 4 cm','任何組織型皆可'],answer:0,explain:'ESGO 2023：淋巴結陰性是任何保留生育治療的前提，限 <2 cm 鱗狀細胞癌或 HPV 相關腺癌。'},
  {q:'FDA pembrolizumab 加放化療核准期別採？',options:['FIGO 2014 III–IVA','FIGO 2018 所有 IIIC','所有 IA1'],answer:0,explain:'核准描述使用 FIGO 2014，不能直接對照新版 IIIC。'},
  {q:'轉移病程 pembrolizumab 加化療的 PD-L1 條件？',options:['CPS ≥1','無須任何檢驗','只看 HPV16'],answer:0,explain:'依 KEYNOTE-826 與適應症確認 PD-L1 CPS ≥1。'},
  {q:'早期手術中冰凍切片發現淋巴結轉移，應如何？',options:['中止根治性子宮切除，改行根治性放化療','照常完成子宮切除再加放療','只切除淋巴結即可'],answer:0,explain:'ESGO 2023：避免根治手術合併放療，術中淋巴結陽性應轉為根治性放化療。'}
];

const quizAdvanced=[
  {q:'錐切確診 IA1、切緣陰性但 LVSI 陽性，淋巴結如何處理？',options:['可考慮前哨淋巴結切片，不需額外骨盆淋巴結廓清','必須做系統性骨盆淋巴結廓清加主動脈旁廓清','LVSI 不影響處置，任何淋巴結評估都不需要'],answer:0,explain:'ESGO 2023：IA1 LVSI 陰性不需淋巴結分期；LVSI 陽性可考慮，且建議以前哨淋巴結（不加 PLND）進行。'},
  {q:'根治性子宮切除後最終病理，何者屬「高風險」而應輔助放化療？',options:['子宮旁侵犯','1.5 cm 腫瘤合併 LVSI，切緣、子宮旁與淋巴結皆陰性','3 cm 腫瘤、淺層間質侵犯、無 LVSI'],answer:0,explain:'高風險：淋巴結轉移（含微轉移）、手術切緣陽性、子宮旁侵犯 → 輔助放化療。腫瘤大小、LVSI、間質侵襲深度依組合判定是否屬中風險，中風險考慮輔助放療或（適當根治手術後）觀察。'},
  {q:'IB1 病人希望接受微創根治性子宮切除，ESGO 2023 的前提為何？',options:['低風險（<2 cm 且錐切後切緣乾淨）並在符合品質標準的高量中心，充分說明證據後','任何 IB 期只要病人偏好即可','腫瘤 ≥4 cm 才能以微創降低併發症'],answer:0,explain:'LACC 試驗後，開腹為根治性子宮切除標準；微創僅限 <2 cm 且錐切切緣乾淨的低風險腫瘤、高量中心並經知情討論。'},
  {q:'局部晚期病人影像顯示一顆總髂（common iliac）淋巴結陽性，主動脈旁影像陰性，照射範圍應？',options:['應納入預防性主動脈旁照射','只照骨盆，主動脈旁陰性就不需要','先手術摘除所有腫大淋巴結再決定'],answer:0,explain:'ESGO 2023：影像上即使只有一顆 level 2（總髂）以上淋巴結陽性，都應給予預防性主動脈旁照射；不建議放化療前常規切除大型淋巴結。'},
  {q:'根治性同步放化療加近接治療的總治療時間目標？',options:['不超過 7 週','不超過 12 週','無時間限制，以毒性為準'],answer:0,explain:'ESGO 2023：外照射加 IGBT 的總治療時間應以 ≤7 週為目標；延長會降低局部控制。'},
  {q:'根治性放化療加近接治療結束 3–6 個月後仍有局部殘存腫瘤，無區域或遠端病灶，下一步？',options:['轉介專責中心評估救援手術的必要性與可行性','常規補做單純子宮切除','直接給 6 個療程輔助化療'],answer:0,explain:'放化療後不建議常規補做子宮切除或輔助化療；持續性局部腫瘤應由專責中心評估救援手術（如骨盆臟器切除）。'},
  {q:'懷孕合併子宮頸癌，ESGO 建議的生產方式？',options:['剖腹生產','陰道生產','依孕婦偏好，兩者風險相同'],answer:0,explain:'ESGO 2023：懷孕期子宮頸癌建議剖腹生產；局部晚期或殘存腫瘤可於懷孕 14 週後考慮 cisplatin／carboplatin 為主的化療；bevacizumab 與免疫檢查點抑制劑禁用。'},
  {q:'一線鉑類化療後進展、未曾使用免疫治療的復發病人，ESGO 2023 建議？',options:['Cemiplimab，不論 PD-L1 狀態','只有 CPS ≥10 才能用免疫治療','只能最佳支持療法'],answer:0,explain:'ESGO 2023：一線鉑類後進展且未用過免疫治療者，應提供 cemiplimab，不論 PD-L1；國內需另核對核准與自費。'},
  {q:'台灣健保：復發性子宮頸癌、無法接受含鉑治療，bevacizumab 可給付的併用處方？',options:['Paclitaxel + topotecan','Carboplatin + paclitaxel','Pembrolizumab 單用'],answer:0,explain:'藥品給付規定 9.37.4(2)：無法接受含鉑治療者，bevacizumab 與 paclitaxel 及 topotecan 併用；需事前審查，每次 15 週。'},
  {q:'台灣健保：子宮頸癌病人使用 pembrolizumab（合併放化療或復發轉移一線）的給付狀態？',options:['9.69 給付適應症未含子宮頸癌，需自費','PD-L1 CPS ≥1 即可給付','合併放化療給付、轉移時不給付'],answer:0,explain:'9.69 免疫檢查點抑制劑的給付適應症目前未包含子宮頸癌（115.9.22 版），KEYNOTE-A18 與 KEYNOTE-826 用法皆需自費。'}
];

/* 台灣健保：全民健康保險藥品給付規定 第九節 抗癌瘤藥物（115.9.22 更新版）逐條比對 */
const NHI_VERSION='第九節 抗癌瘤藥物（115.9.22 更新）';
function nhi(input){
  const d=Object.assign({setting:'recurrent',platinum:'yes',renal:'no',localTx:'no'},input||{});
  const rec=d.setting==='recurrent', plat=d.platinum==='yes', renal=d.renal==='yes', local=d.localTx==='yes';
  const rows=[];
  rows.push({drug:'Cisplatin',clause:'—',status:plat?'open':'na',
    text:plat?'第九節無限制條文，依許可證適應症使用。':'病人無法接受含鉑治療。'});
  rows.push({drug:'Carboplatin',clause:'9.2',status:renal?'covered':'no',
    text:renal?'符合 9.2 第 2 款：腎功能不佳（CCr <60）或曾作單側以上腎切除之惡性腫瘤患者。':'9.2 限卵巢癌、CCr <60 或曾腎切除者（及特定肺癌／乳癌併用）；子宮頸癌腎功能正常者不在給付範圍。'});
  rows.push({drug:'Paclitaxel',clause:'9.5.1／9.37.4',status:rec?'check':'no',
    text:rec?'9.5.1 給付癌別列卵巢癌、非小細胞肺癌、乳癌、卡波西氏肉瘤，未列子宮頸癌；子宮頸癌僅出現在 9.37.4 bevacizumab 併用處方。申報前請與院內藥劑部／健保窗口確認。':'9.5.1 未列子宮頸癌；根治性放化療前的誘導化療（INTERLACE）不在條文內。'});
  if(rec){
    rows.push({drug:'Bevacizumab',clause:'9.37.4',status:'covered',
      text:(plat?'9.37.4(1)：與 cisplatin 及 paclitaxel 併用於持續性、復發性或轉移性子宮頸癌。':'9.37.4(2)：無法接受含鉑治療者，與 paclitaxel 及 topotecan 併用於持續性、復發性或轉移性子宮頸癌。')+'需事前審查，每次以 15 週為限；續用須檢附影像等客觀證據證實無惡化。用藥前評估腸胃道／泌尿道瘻管與出血風險。'});
    rows.push({drug:'Topotecan 注射劑',clause:'9.16.1',status:plat&&!local?'covered':plat?'no':'check',
      text:plat&&!local?'9.16.1 第 2 款：與 cisplatin 併用，用於經組織學確定之第 IV-B 期、復發性或持續性子宮頸癌，且不適合手術及（或）放射治療者。'
        :plat?'9.16.1 第 2 款要求「不適合以外科手術及（或）放射療法治療」；仍可局部治療者不符合。'
        :'9.16.1 第 2 款限與 cisplatin 併用；無法用鉑類時，topotecan 僅在 9.37.4(2) bevacizumab 三合一處方中出現，申報前請確認。'});
  }else{
    rows.push({drug:'Bevacizumab',clause:'9.37.4',status:'no',text:'9.37.4 限持續性、復發性或轉移性子宮頸癌；根治性放化療階段不給付。'});
  }
  rows.push({drug:'Pembrolizumab／cemiplimab',clause:'9.69',status:'no',
    text:'9.69 免疫檢查點抑制劑的給付適應症未包含子宮頸癌：'+(rec?'復發／轉移一線（KEYNOTE-826）與二線 cemiplimab':'合併放化療（KEYNOTE-A18）')+'皆需自費。'});
  if(rec) rows.push({drug:'Tisotumab vedotin',clause:'—',status:'none',text:'第九節無此藥給付規定，需自費或專案，並確認國內可取得性。'});
  const notes=[];
  if(rec&&!plat) notes.push('無法使用鉑類：可給付組合為 bevacizumab + paclitaxel + topotecan（9.37.4(2)）。');
  if(rec&&plat) notes.push('一線常見可給付組合：cisplatin + paclitaxel ± bevacizumab（bevacizumab 需事前審查）。');
  if(!rec) notes.push('根治性放化療：每週 cisplatin 無限制條文；腎功能不佳改 carboplatin 時符合 9.2 第 2 款。');
  return {version:NHI_VERSION,rows,notes};
}
function nhiSummary(code){
  if(code==='metastatic') return '健保（'+NHI_VERSION+'）：bevacizumab 9.37.4 需事前審查；pembrolizumab／cemiplimab（9.69）未給付子宮頸癌，需自費。';
  if(code==='locally'||code==='iiic1'||code==='iiic2') return '健保（'+NHI_VERSION+'）：pembrolizumab 合併放化療未給付（9.69）；carboplatin 限 CCr <60 或腎切除（9.2）。';
  return '';
}

/* 完整示範病例：主觀內容以 ESGO/ESTRO/ESP 2023 口袋指引頁碼標註；分流與健保結果由 pathway()／nhi() 即時產生，tests 會核對。 */
/*CASES-START*/
const demoCases=[
  {id:'fertility',tag:'IB1',title:'想保留生育的 IB1、LVSI 陽性',
   stem:'34 歲未生育，錐切為 1.6 cm 鱗狀細胞癌、間質侵襲 6 mm、切緣乾淨、LVSI 陽性。骨盆 MRI 無可疑淋巴結，殘餘子宮頸長度足夠。',
   preset:{stage:'ib1',nodes:'negative',histology:'scc',lvsi:'positive',fertility:'yes'},expect:'ib1',
   steps:[
    {q:'符合保留生育的條件嗎？',a:'<2 cm、鱗狀細胞癌，符合討論條件。治療前先到生育腫瘤中心諮詢並經多專科會議，也要說明切緣或淋巴結陽性時須放棄保留生育。',src:'p.12'},
    {q:'手術第一步是什麼？',a:'先做前哨淋巴結切片並送冰凍；骨盆淋巴結陰性是任何保留生育治療的前提。一側找不到前哨淋巴結，該側做系統性骨盆淋巴結廓清。',src:'p.13'},
    {q:'淋巴結陰性後選哪種術式？',a:'T1b1 且 LVSI 陽性應做根治性子宮頸切除（type B）。只有間質未深層侵犯、上切緣很可能足夠時，才可考慮單純子宮頸切除；術中放置永久性環紮。',src:'p.13'},
    {q:'之後怎麼追蹤與生產？',a:'之後懷孕視為高風險妊娠；放置永久性環紮後只能剖腹生產。追蹤包含 6–12 個月與 24 個月的 HPV 檢測，生完不必常規切除子宮。',src:'p.14, p.20'}],
   traps:['術中淋巴結陽性：放棄保留生育，改放化療加近接治療；N1 不建議卵巢移位。','LVSI 陰性的 T1b1 才以錐切或單純子宮頸切除為適當術式。']},
  {id:'surgery',tag:'IB2',title:'根治手術：術中與最終病理的分岔',
   stem:'46 歲，3.2 cm 鱗狀細胞癌，FIGO IB2，影像淋巴結陰性，已完成生育，排定開腹根治性子宮切除。',
   preset:{stage:'ib2',nodes:'negative',histology:'scc',lvsi:'positive'},expect:'ib2',
   steps:[
    {q:'開刀先做什麼？',a:'先評估淋巴結：前哨淋巴結（ICG 優先）送冰凍；冰凍陰性再做系統性骨盆淋巴結廓清，兩側 level I 前哨陰性時可只廓清到 level I。',src:'p.10–11'},
    {q:'分岔一：冰凍陽性',a:'不再繼續骨盆廓清與根治性子宮切除，改轉根治性放化療（期別變為 IIIC1p）；主動脈旁廓清可考慮作為分期。',src:'p.11'},
    {q:'分岔二：最終病理高風險',a:'骨盆淋巴結轉移（巨轉移或微轉移）、手術切緣陽性（陰道／子宮旁／子宮頸旁）、子宮旁侵犯，任一項即給輔助放化療；陰道或子宮旁陽性可考慮近接加量。',src:'p.12'},
    {q:'分岔三：最終病理中風險',a:'腫瘤大小、LVSI、間質侵襲深度的組合：考慮輔助放療；若已做適當型式的根治手術，觀察是替代選項。前哨只有孤立腫瘤細胞時也可考慮輔助治療，但預後意義未定。',src:'p.12'}],
   traps:['術前就知道多項風險因子會需要輔助治療時，直接選根治性放化療加近接治療，避免手術合併放療。','微創根治手術僅限 <2 cm 且錐切切緣乾淨的低風險腫瘤；本例 3.2 cm 應開腹。']},
  {id:'incidental',tag:'意外發現',title:'單純子宮切除後才發現侵襲癌',
   stem:'47 歲因肌瘤接受單純子宮切除，病理意外發現鱗狀細胞癌：侵襲 9 mm、最大徑 1.5 cm，切緣乾淨、LVSI 陰性。術後 MRI／PET-CT 無殘存腫瘤，淋巴結不可疑。',
   engineNote:'分流工具未涵蓋此情境，以下依 ESGO 章節逐步處理。',
   steps:[
    {q:'下一步？',a:'先請專家重新判讀病理，提交多專科會議，並完成與標準流程相同的影像評估；治療策略同樣避免再次手術合併放療。',src:'p.14'},
    {q:'這是哪個情境？',a:'T1b1、切緣乾淨、無殘存腫瘤：建議手術評估淋巴結。子宮已切除，無法做前哨淋巴結切片；可單獨以腹腔鏡分期。',src:'p.14–15'},
    {q:'淋巴結陽性',a:'建議根治性放化療；主動脈旁廓清可考慮作為分期。',src:'p.15'},
    {q:'淋巴結陰性',a:'需處理子宮旁可能的殘餘病灶：可考慮子宮旁切除與上段陰道切除；放療為替代選項，需權衡再次手術的風險與效益。',src:'p.15'}],
   traps:['對照：T1a1（不論 LVSI）及 LVSI 陰性的 T1a2、切緣乾淨者不需額外治療。','若是 ≥T1b2、切緣陽性或有殘存腫瘤，方向改為（放）化療，不是再手術優先。']},
  {id:'renal',tag:'IIIB',title:'腎積水與腎功能不佳的放化療',
   stem:'58 歲，5.5 cm 腫瘤，左側腎積水，CCr 42 mL/min。PET-CT 無淋巴結與遠端轉移。',
   preset:{stage:'locally',nodes:'negative',histology:'scc'},expect:'locally',
   nhi:{setting:'curative',platinum:'yes',renal:'yes'},nhiDrugs:['Cisplatin','Carboplatin','Pembrolizumab'],
   steps:[
    {q:'怎麼分期？',a:'腎積水屬 FIGO IIIB，不必有淋巴結轉移。FIGO 2014 同樣列為 IIIB，因此落在 FDA pembrolizumab 合併放化療的 III–IVA 描述內。',src:'FIGO／FDA'},
    {q:'放化療怎麼選藥？',a:'每週 cisplatin 是標準；不適合 cisplatin 者可考慮每週 carboplatin 或溫熱治療。ESGO 未訂腎功能切點，是否適用由腫瘤團隊判斷。',src:'p.16'},
    {q:'腎積水要先處理嗎？',a:'腫瘤阻塞造成腎衰竭可考慮輸尿管支架或經皮腎造廔。ESGO 將此列於緩和照護章節，並指出沒有明確指引可預測誰受益，須仔細討論。',src:'p.21'},
    {q:'療效如何評估？',a:'治療結束滿 3 個月後才做影像，使用與治療前相同的方法；不常規切片或細胞學。3 個月未確定完全緩解，2–3 個月後再評估，必要時切片。',src:'p.21'}],
   traps:['不可用外照射加量取代近接治療，總治療時間以 ≤7 週為目標（p.16）。','放化療後不補做子宮切除，也不在試驗外給輔助化療；3–6 個月仍有局部殘存且無其他病灶，轉專責中心評估救援手術（p.16）。']},
  {id:'nodes',tag:'IIIC1r',title:'總髂淋巴結陽性與分期版本陷阱',
   stem:'51 歲，5 cm 腫瘤合併子宮旁侵犯，未達骨盆壁。PET-CT：外髂 2 顆、總髂 1 顆淋巴結陽性，主動脈旁與遠端陰性。',
   preset:{stage:'locally',nodes:'pelvic',histology:'scc'},expect:'iiic1',
   nhi:{setting:'curative',platinum:'yes',renal:'no'},nhiDrugs:['Cisplatin','Pembrolizumab'],
   steps:[
    {q:'FIGO 2018 期別？',a:'影像證實骨盆淋巴結陽性為 IIIC1r。同一個病人在不計淋巴結的 FIGO 2014 是 IIB。',src:'FIGO'},
    {q:'主動脈旁要照嗎？',a:'要。影像上只要有一顆 level 2（總髂）以上淋巴結陽性，就應給預防性主動脈旁照射。',src:'p.16'},
    {q:'陽性淋巴結怎麼處理？',a:'加量照射，建議同步整合加量（SIB），合計 60 Gy EQD2；放化療前不常規手術切除大型淋巴結。',src:'p.16'},
    {q:'可以直接說符合 pembrolizumab 嗎？',a:'不行。FDA 核准描述為 FIGO 2014 III–IVA，本例 2014 期別為 IIB；「IIIC」不能直接對應。台灣 9.69 亦未給付子宮頸癌，需自費。',src:'FDA／健保 9.69'}],
   traps:['若只有 level 1 淋巴結，預防性主動脈旁照射可依陽性顆數評估（例如 >2 顆）。','主動脈旁廓清可用來判斷是否需要主動脈旁照射，但本例已有總髂陽性，照射指徵已成立。']},
  {id:'pregnancy',tag:'懷孕',title:'懷孕 20 週的 IB3，希望保留胎兒',
   stem:'32 歲懷孕 20 週，產檢見 4.5 cm 子宮頸腫瘤，切片為鱗狀細胞癌。希望繼續懷孕。',
   preset:{stage:'locally',nodes:'unknown',histology:'scc',pregnant:true},expect:'pregnancy',
   steps:[
    {q:'在哪裡治療？',a:'由含婦癌、新生兒、產科、放射腫瘤與心理等專業的團隊諮詢，並在有最高級週產期中心的婦癌中心治療。',src:'p.22'},
    {q:'如何確診與分期？',a:'陰道鏡切片即可，禁做子宮頸搔刮。骨盆 MRI 或專家超音波，避免釓顯影劑；全身 DWI-MRI 可評估淋巴結與遠端，無法取得時用胸部 CT 加腹部遮蔽，避免 PET-CT。',src:'p.22'},
    {q:'可疑淋巴結怎麼辦？',a:'24 週前應取得組織確認，因為會影響處置。微創路徑可在 14–16 週前考慮；本例已 20 週。ICG 前哨淋巴結在孕期仍屬實驗性質。',src:'p.23'},
    {q:'如何在孕期控制腫瘤？',a:'局部晚期可於 14 週後考慮 cisplatin 或 carboplatin 為主的化療，可合併紫杉醇類；每療程前評估反應，2 療程無反應須重新評估。Bevacizumab 與免疫檢查點抑制劑禁用。',src:'p.23'},
    {q:'生產與後續？',a:'化療可至 37 週，化療與手術至少間隔 2 週。建議剖腹生產，並於剖腹時進行等同非懷孕病人的根治性處置，納入孕期已給的治療。',src:'p.23'}],
   traps:['若病人決定不繼續懷孕：依期別做根治手術或放化療；第一孕期後建議先終止妊娠，放化療前盡可能先排空胎兒。','延後治療到胎兒成熟（盡量 >34 週）只適合接近足月的情境，不是 20 週的方案。']},
  {id:'central',tag:'中央復發',title:'放化療後的中央型骨盆復發',
   stem:'55 歲，IIB 接受放化療加近接治療後 20 個月，陰道出血。切片證實陰道頂復發；MRI／PET-CT 未見骨盆壁、骨盆外淋巴結或腹膜病灶。',
   engineNote:'這是仍有機會根治的復發。分流工具的「轉移／復發」路徑針對遠端轉移或無法根治的情況，因此不帶入。',
   steps:[
    {q:'先確認什麼？',a:'盡可能以組織證實復發，評估局部與遠端範圍，交由含婦癌、放射腫瘤、腫瘤內科、泌尿與整形外科的團隊，並及早納入緩和照護。',src:'p.17'},
    {q:'首選處置？',a:'中央型骨盆復發且未侵犯骨盆壁、無骨盆外淋巴結或腹膜病灶：建議骨盆臟器切除。',src:'p.18'},
    {q:'還有其他局部選項嗎？',a:'部分病人可考慮以 IGABT 再次照射，需考量病灶體積、距首次放療時間與原劑量，只在專責中心進行。',src:'p.18'},
    {q:'侵犯骨盆壁或不適合手術？',a:'骨盆壁侵犯可在專責中心考慮擴大骨盆手術，目標 R0（可用 LEER 等技術）；不適合大手術者給全身化療，再依反應考慮後續治療。',src:'p.18'}],
   traps:['對照：先前只開過刀、未曾放療的中央復發，首選是放化療加 IGABT，不是臟器切除（p.18）。','多處淋巴結或遠端轉移、多灶合併廣泛骨盆壁侵犯，不列為根治性治療對象（p.17）。']},
  {id:'metastatic',tag:'IVB',title:'肺轉移一線治療：指引與健保的落差',
   stem:'62 歲新診斷多發性肺轉移，PD-L1 CPS 10，CCr 48 mL/min。先前未接受放療，無瘻管病史。',
   preset:{stage:'metastatic',nodes:'distant',histology:'scc',pdl1:'positive'},expect:'metastatic',
   nhi:{setting:'recurrent',platinum:'yes',renal:'yes',localTx:'no'},nhiDrugs:['Carboplatin','Paclitaxel','Bevacizumab','Pembrolizumab'],
   steps:[
    {q:'國際建議的一線？',a:'含鉑化療（carboplatin 或 cisplatin + paclitaxel）；CPS ≥1 加 pembrolizumab；仔細評估腸胃道與泌尿道毒性風險後，可再加 bevacizumab。',src:'p.19'},
    {q:'台灣健保怎麼對應？',a:'Carboplatin 因 CCr <60 符合 9.2；pembrolizumab 未給付需自費。注意 9.37.4(1) 的 bevacizumab 併用處方寫的是 cisplatin + paclitaxel，改用 carboplatin 是否符合，申報前要確認。',src:'健保第九節'},
    {q:'一線有反應之後？',a:'診斷時即有遠端轉移且化療有反應者，可考慮加做根治性骨盆放療；殘存寡轉移可考慮針對病灶的局部治療。',src:'p.19'},
    {q:'進展後用什麼？',a:'Cemiplimab 的 ESGO 建議限未用過免疫治療者，本例若一線已用 pembrolizumab 就不適用；可評估 tisotumab vedotin（FDA 核准，第九節無給付條文）與臨床試驗。',src:'p.19／FDA'}],
   traps:['同步提供緩和照護，疼痛、出血、腎功能與腸阻塞都有對應處置（p.21–22）。','CPS 未知時先檢驗，不能預設可用 pembrolizumab。']}
];
/*CASES-END*/

/*MAP-START*/
/* 葉節點重述 ESGO 2023 頁碼內容與本頁規則；p = 帶入分流工具的輸入；tw = 台灣健保條文。 */
const mindMap={
  dx:[
   {t:'確定診斷',s:'組織病理才算確診',l:[
    {k:'必要',x:'骨盆檢查加切片，必要時陰道鏡',src:'p.9'},
    {k:'不足以確診',x:'抹片或 HPV 陽性'},
    {k:'T1a',x:'依錐切或切除標本，由專家判讀侵襲深度、切緣、LVSI',src:'p.9'},
    {k:'錐切技術',x:'想保留生育時，環狀或雷射優於冷刀；標本完整並標示方向',src:'p.9'}]},
   {t:'局部影像',s:'決定腫瘤範圍',l:[
    {k:'骨盆 MRI',x:'初始評估必做；T1a 且錐切切緣乾淨者可選做',src:'p.9'},
    {k:'超音波',x:'受訓人員操作的經陰道／直腸超音波可作選項',src:'p.9'},
    {k:'內視鏡',x:'膀胱鏡、直腸鏡不常規建議',src:'p.9'}]},
   {t:'淋巴結與遠端',s:'手術或放化療的分水嶺',l:[
    {k:'早期手術者',x:'以手術病理分期骨盆淋巴結；T1a1 及 LVSI 陰性 T1a2 除外',src:'p.9'},
    {k:'T1b3 以上或影像可疑',x:'PET-CT，無則胸腹 CT（T2a1 除外）',src:'p.9'},
    {k:'根治性放化療前',x:'建議 PET-CT',src:'p.9'},
    {k:'主動脈旁',x:'影像陰性時，可考慮廓清至下腸繫膜動脈作分期',src:'p.9'},
    {k:'難判定病灶',x:'考慮切片，避免不當治療',src:'p.9'}]},
   {t:'FIGO 2018 分期',s:'r＝影像、p＝病理',l:[
    {k:'IA',x:'侵襲 <5 mm；IA1 <3 mm，IA2 3–<5 mm'},
    {k:'IB',x:'≥5 mm、限於子宮頸；IB1 <2 cm，IB2 2–<4 cm，IB3 ≥4 cm'},
    {k:'II',x:'IIA 陰道上 2/3；IIB 子宮旁'},
    {k:'III',x:'IIIA 陰道下 1/3；IIIB 骨盆壁或腎積水；IIIC1 骨盆、IIIC2 主動脈旁淋巴結'},
    {k:'IV',x:'IVA 膀胱或直腸黏膜；IVB 遠端'},
    {k:'版本差異',x:'FIGO 2014 不計淋巴結，與 2018 IIIC 不可互換'}]},
   {t:'必記錄的預後因子',s:'同時記 TNM 與 FIGO',l:[
    {k:'腫瘤',x:'最大徑、子宮外延伸（含子宮體）'},
    {k:'病理',x:'組織型含 HPV 狀態、間質侵襲深度、未侵犯間質最小厚度'},
    {k:'切緣',x:'陰道部、子宮頸內、放射狀／深部間質、陰道袖口'},
    {k:'其他',x:'LVSI、淋巴結數目／位置／大小／代謝、遠端轉移。以上見 p.8'}]},
   {t:'特殊情境',s:'先轉介再決定',l:[
    {k:'懷孕',x:'避免釓顯影劑與 PET-CT；禁做子宮頸搔刮',src:'p.22'},
    {k:'單純子宮切除後發現',x:'專家複閱病理加完整影像；無子宮無法做前哨',src:'p.14'},
    {k:'少見腫瘤',x:'專家第二意見，集中於轉診中心',src:'p.23'}]}
  ],
  tx:[
   {t:'IA：錐切為主',s:'根治手術屬過度治療',l:[
    {k:'IA1',x:'切緣乾淨的錐切可作最終治療；切緣陽性再錐切',src:'p.10',p:{stage:'ia1',lvsi:'negative'}},
    {k:'IA1 淋巴結',x:'LVSI 陰性不需；陽性可考慮前哨',src:'p.10',p:{stage:'ia1',lvsi:'positive'}},
    {k:'IA2',x:'錐切或單純子宮切除；不切子宮旁',src:'p.10',p:{stage:'ia2',lvsi:'negative'}},
    {k:'IA2 淋巴結',x:'LVSI 陰性可考慮、陽性應做前哨',src:'p.10',p:{stage:'ia2',lvsi:'positive'}},
    {k:'腺癌',x:'已完成生育者建議單純子宮切除',src:'p.10'}]},
   {t:'IB1、IB2、IIA1：手術優先',s:'避免手術合併放療',l:[
    {k:'第一步',x:'前哨淋巴結（ICG 優先）加術中冰凍',src:'p.10–11',p:{stage:'ib1'}},
    {k:'冰凍陽性',x:'中止廓清與子宮切除，改放化療',src:'p.11',p:{stage:'ib2',nodes:'pelvic'}},
    {k:'路徑',x:'開腹為標準；微創僅限 <2 cm、錐切切緣乾淨、高量中心',src:'p.10'},
    {k:'低風險',x:'SHAPE：≤2 cm、侵襲 <10 mm，可討論單純子宮切除'},
    {k:'替代',x:'根治性放化療加 IGBT；不建議前導化療後手術',src:'p.11'}]},
   {t:'術後輔助',s:'看最終病理',l:[
    {k:'高風險',x:'淋巴結（含微轉移）、切緣陽性、子宮旁 → 放化療',src:'p.12'},
    {k:'中風險',x:'大小、LVSI、間質深度組合 → 考慮放療，適當根治手術後可觀察',src:'p.12'},
    {k:'孤立腫瘤細胞',x:'可考慮輔助治療，預後意義未定',src:'p.12'}]},
   {t:'保留生育',s:'淋巴結陰性是前提',l:[
    {k:'對象',x:'<2 cm 鱗癌或 HPV 相關腺癌；先生育腫瘤諮詢',src:'p.12',p:{stage:'ib1',fertility:'yes'}},
    {k:'IA',x:'錐切或單純子宮頸切除，不論 LVSI',src:'p.13'},
    {k:'IB1 LVSI 陰性',x:'錐切或單純子宮頸切除，根治性仍是選項',src:'p.13',p:{stage:'ib1',fertility:'yes',lvsi:'negative'}},
    {k:'IB1 LVSI 陽性',x:'根治性子宮頸切除（type B）',src:'p.13',p:{stage:'ib1',fertility:'yes',lvsi:'positive'}},
    {k:'不建議',x:'神經內分泌癌、HPV 無關腺癌、癌肉瘤',src:'p.12'},
    {k:'>2 cm',x:'復發風險明顯較高，非標準治療',src:'p.13',p:{stage:'ib2',fertility:'yes'}}]},
   {t:'局部晚期：放化療加近接',s:'IB3、IIA2、IIB–IVA',l:[
    {k:'外照射',x:'45 Gy/25 次或 46 Gy/23 次，IMRT/VMAT',src:'p.16',p:{stage:'locally'}},
    {k:'同步化療',x:'每週 cisplatin；不適合者 carboplatin 或溫熱治療',src:'p.16'},
    {k:'近接',x:'影像導引近接不可缺，不可用外照射加量取代',src:'p.16'},
    {k:'時間',x:'總治療時間 ≤7 週',src:'p.16'},
    {k:'不常規',x:'試驗外前導或輔助化療、補做子宮切除；INTERLACE 誘導化療由團隊討論',src:'p.16'},
    {k:'療效',x:'≥3 個月影像；3–6 個月殘存轉救援手術評估',src:'p.16, p.21'},
    {k:'IB3／IIA2 淋巴結陰性',x:'手術與放化療證據有限，多專科討論',src:'p.17'}]},
   {t:'IIIC：淋巴結陽性',s:'放化療並照射淋巴結',l:[
    {k:'加量',x:'陽性淋巴結 SIB，合計 60 Gy EQD2',src:'p.16',p:{stage:'locally',nodes:'pelvic'}},
    {k:'主動脈旁',x:'level 2（總髂）以上一顆陽性就應預防性照射',src:'p.16'},
    {k:'IIIC2',x:'照射野延伸至主動脈旁',p:{stage:'locally',nodes:'para'}},
    {k:'Pembrolizumab',x:'FDA 描述為 FIGO 2014 III–IVA，不等於 2018 IIIC'}]},
   {t:'局部復發',s:'仍可能根治',l:[
    {k:'手術後中央復發',x:'未放療者：放化療加 IGABT',src:'p.18'},
    {k:'手術後骨盆壁',x:'未放療者：放化療；不可行時擴大手術',src:'p.18'},
    {k:'放療後中央復發',x:'骨盆臟器切除；部分可再照射',src:'p.18'},
    {k:'寡轉移',x:'照射野外淋巴結可根治性外照射；器官病灶可切除、消融或 SABR',src:'p.18'}]},
   {t:'遠端轉移與無法根治',s:'全身治療加緩和照護',l:[
    {k:'一線',x:'Carboplatin 或 cisplatin + paclitaxel',src:'p.19',p:{stage:'metastatic',pdl1:'negative'}},
    {k:'CPS ≥1',x:'加 pembrolizumab',src:'p.19',p:{stage:'metastatic',pdl1:'positive'}},
    {k:'Bevacizumab',x:'評估腸胃道與泌尿道毒性後可加',src:'p.19'},
    {k:'二線',x:'未用過免疫治療者 cemiplimab；FDA 另核准 tisotumab vedotin',src:'p.19'},
    {k:'有反應者',x:'可考慮骨盆根治放療或處理殘存寡轉移',src:'p.19'}]},
   {t:'懷孕',s:'依孕週、期別與意願',l:[
    {k:'接近成熟',x:'盡量 >34 週，產後立即治療',src:'p.23',p:{stage:'ib2',pregnant:true}},
    {k:'小病灶',x:'錐切或單純子宮頸切除，必要時淋巴結分期',src:'p.23'},
    {k:'局部晚期',x:'14 週後鉑類化療 ± 紫杉醇類，可至 37 週',src:'p.23'},
    {k:'禁用',x:'Bevacizumab、免疫檢查點抑制劑',src:'p.23'},
    {k:'生產',x:'建議剖腹，同時做根治性處置',src:'p.23'}]},
   {t:'追蹤與生活品質',s:'依個人風險調整',l:[
    {k:'每次回診',x:'病史與骨盆檢查；有症狀或風險再做影像',src:'p.20'},
    {k:'不建議',x:'陰道頂抹片；放療後以細胞學偵測復發',src:'p.20–21'},
    {k:'保留生育後',x:'6–12 及 24 個月 HPV 檢測',src:'p.20'},
    {k:'放療後',x:'陰道擴張器、局部雌激素；提早停經可補充荷爾蒙並追蹤骨質',src:'p.20'},
    {k:'晚期症狀',x:'及早緩和照護：疼痛、腎衰竭、腸阻塞、出血',src:'p.21–22'}]},
   {t:'台灣健保',s:'第九節 115.9.22',tw:true,l:[
    {k:'Cisplatin',x:'第九節無限制條文',tw:true},
    {k:'Carboplatin',x:'9.2：CCr <60 或曾腎切除',tw:true},
    {k:'Bevacizumab',x:'9.37.4：持續性、復發性或轉移性；需事前審查，每次 15 週',tw:true},
    {k:'Topotecan',x:'9.16.1：併 cisplatin，IVB、復發或持續性且不適合手術／放療',tw:true},
    {k:'免疫檢查點抑制劑',x:'9.69 未含子宮頸癌，需自費',tw:true}]}
  ]
};
/*MAP-END*/

root.CC={STAGES,pathway,cases,demoCases,mindMap,quiz,quizAdvanced,nhi,nhiSummary,NHI_VERSION};
})(typeof globalThis!=='undefined'?globalThis:this);

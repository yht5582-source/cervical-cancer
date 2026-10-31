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
      '分期影像以 MRI 或專家超音波為主，避免含碘／釓顯影劑與放射線檢查。',
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
      small?'低風險（≤2 cm、間質侵襲 <50%、影像無淋巴結轉移）可依 SHAPE 試驗討論單純子宮切除加淋巴結評估。':'術前已知多項風險因子（需輔助治療）時，直接選擇根治性放化療＋近接治療，避免手術合併放療。',
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
  {title:'IB1 低風險病灶',stem:'43 歲、1.5 cm 鱗狀細胞癌、間質侵襲 <50%，無生育需求；影像無淋巴結轉移。',options:['核對低風險條件後，討論單純子宮切除加淋巴結評估','一律視為 IVB','省略淋巴結評估'],answer:0,explain:'SHAPE 試驗：低風險早期病灶單純子宮切除骨盆復發率不劣於根治性手術；淋巴結評估仍不可省略。'},
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
  {q:'根治性子宮切除後最終病理，何者屬「高風險」而應輔助放化療？',options:['子宮旁侵犯','1.5 cm 腫瘤合併 LVSI，切緣與淋巴結陰性','3 cm 腫瘤、淺層間質侵犯、無 LVSI'],answer:0,explain:'高風險：淋巴結轉移（含微轉移）、手術切緣陽性、子宮旁侵犯 → 輔助放化療。腫瘤大小、LVSI、間質侵襲深度的組合屬中風險，考慮輔助放療或觀察。'},
  {q:'IB1 病人希望接受微創根治性子宮切除，ESGO 2023 的前提為何？',options:['低風險（<2 cm 且錐切後切緣乾淨）並在符合品質標準的高量中心，充分說明證據後','任何 IB 期只要病人偏好即可','腫瘤 ≥4 cm 才能以微創降低併發症'],answer:0,explain:'LACC 試驗後，開腹為根治性子宮切除標準；微創僅限 <2 cm 且錐切切緣乾淨的低風險腫瘤、高量中心並經知情討論。'},
  {q:'局部晚期病人影像顯示一顆總髂（common iliac）淋巴結陽性，主動脈旁影像陰性，照射範圍應？',options:['應納入預防性主動脈旁照射','只照骨盆，主動脈旁陰性就不需要','先手術摘除所有腫大淋巴結再決定'],answer:0,explain:'ESGO 2023：影像上即使只有一顆 level 2（總髂）以上淋巴結陽性，都應給予預防性主動脈旁照射；不建議放化療前常規切除大型淋巴結。'},
  {q:'根治性同步放化療加近接治療的總治療時間目標？',options:['不超過 7 週','不超過 12 週','無時間限制，以毒性為準'],answer:0,explain:'ESGO 2023：外照射加 IGBT 的總治療時間應以 ≤7 週為目標；延長會降低局部控制。'},
  {q:'根治性放化療加近接治療結束 3–6 個月後仍有局部殘存腫瘤，無區域或遠端病灶，下一步？',options:['轉介專責中心評估救援手術的必要性與可行性','常規補做單純子宮切除','直接給 6 個療程輔助化療'],answer:0,explain:'放化療後不建議常規補做子宮切除或輔助化療；持續性局部腫瘤應由專責中心評估救援手術（如骨盆臟器切除）。'},
  {q:'懷孕合併子宮頸癌，ESGO 建議的生產方式？',options:['剖腹生產','陰道生產','依孕婦偏好，兩者風險相同'],answer:0,explain:'ESGO 2023：懷孕期子宮頸癌建議剖腹生產；孕期化療可於 14 週後考慮，並在具經驗中心處置。'},
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

root.CC={STAGES,pathway,cases,quiz,quizAdvanced,nhi,nhiSummary,NHI_VERSION};
})(typeof globalThis!=='undefined'?globalThis:this);

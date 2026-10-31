# 子宮頸癌｜臨床決策教學

FIGO 2018 分期、診斷與治療方向的繁體中文互動教學網站。包含情境分流、六個示範病例、十題考題及原始指引連結。

網站：https://yht5582-source.github.io/cervical-cancer/

本工具僅供醫療人員教學，不自動判定分期或開立個別治療。實際決策請由婦癌多專科團隊依病理、影像、淋巴結、病人需求、當地核准與給付條件確認。特別注意 FIGO 2018 IIIC 與 pembrolizumab 合併放化療研究及 FDA 核准所用 FIGO 2014 期別不可直接互換。

## 資料來源

- [ESGO/ESTRO/ESP 2023 management guidelines](https://www.esgo.org/media/2019/03/Pocket-Guidelines_Cervical-cancer_June2023.pdf)
- [NCI PDQ cervical cancer treatment](https://www.cancer.gov/types/cervical/hp/cervical-treatment-pdq)
- [FIGO 2018 staging table](https://www.ncbi.nlm.nih.gov/books/NBK606467/table/T5.10.5/)
- [FDA pembrolizumab with chemoradiotherapy](https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-pembrolizumab-chemoradiotherapy-figo-2014-stage-iii-iva-cervical-cancer)
- [NCI SHAPE trial commentary](https://www.cancer.gov/news-events/cancer-currents-blog/2024/cervical-cancer-simple-hysterectomy)
- [INTERLACE (Lancet 2024)](https://doi.org/10.1016/S0140-6736(24)01438-7)
- [FDA tisotumab vedotin](https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-tisotumab-vedotin-tftv-recurrent-or-metastatic-cervical-cancer)

資料核對日期：2026-10-31。

## 結構與測試

- `clinical.js`：分流引擎 `CC.pathway()` 與病例／考題題庫（純函式，classic script，file:// 可用）
- `app.js`：畫面互動（快速情境、分期階梯帶入、即時更新、複製摘要、選項隨機、計分與進度）
- `style.css`：色彩變數，支援深色模式與手機版
- 測試：`node --test tests/clinical.test.cjs`


# CSS Class 問題盤點(對照 class_inventory.md)

掃描範圍:`CSS/footer.css`、`CSS/cheering-new.css`、`CSS/list-page.css`、`CSS/review.css`、`CSS/login.css`、`CSS/nav.css`、`CSS/index.css`、`CSS/style.css`、`CSS/artist.css`、`CSS/profile.css`(共 10 個檔案),對照 [class_inventory.md](class_inventory.md) 的 HTML 使用清單。

本報告純粹列出現狀,**不包含任何修改或優化建議**。行號為該規則選擇器(selector)在檔案中的起始行。

---

## 1. 衝突定義(同一個 class,不同 CSS 檔案/位置有不同樣式)

### 1.1 您特別點名的 8 個高風險通用命名

| Class | 結論 |
|---|---|
| `card` | 僅在 `style.css` 有獨立定義;`artist.css` 只有巢狀/情境選擇器,沒有直接覆寫 `.card` 本身 → 非典型衝突,但定義被拆在兩個檔案 |
| `list` | 同上,`style.css` 定義基礎樣式,`artist.css` 只有 `#section-merch>.list` 情境覆寫 |
| `label` | **在任何 CSS 檔案中都找不到 `.label` 規則**(artist.html 用在 `<p class="label">`,目前完全沒有樣式) |
| `right` | 只有 `artist.css` 以 `.card>.right` 複合選擇器定義,沒有獨立的 `.right{}` 規則 |
| `divider` | 只在 `list-page.css` 有一份定義,未跨檔案重複,本身不衝突(但見第 4 節與 `login-divider`/`stub-divider` 的概念比較) |
| `active` | 只在 `login.css` 有一份定義,不衝突 |
| `row2` | 只在 `list-page.css` 有一份定義,不衝突 |
| `date` | **在任何 CSS 檔案中都找不到 `.date` 規則**(artist.html 用在 `<p class="date">`,目前完全沒有樣式) |

逐一附完整規則內容:

**`.card`**
```
CSS/style.css:202
.card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 16px;
    border: 1px solid var(--border-color);
    background-color: var(--bg-card);
    border-radius: 12px;
}
```
```
CSS/artist.css:259   .card>p { text-align:center; display:flex; flex-direction:column; text-align:left; }
CSS/artist.css:267   .card>p>span { font-size:12px; font-weight:200; }
CSS/artist.css:272   .card>.right { width:100px; display:flex; text-align:center; align-self:center; justify-content:space-between; }
CSS/artist.css:292   .card:hover { background-color: var(--bg-hover); }
CSS/artist.css:307   .date-item details[open] .card { background-color: var(--bg-hover); border-radius: 12px 12px 0 0; }
CSS/artist.css:440   #section-ticket .card { flex-direction:column; align-items:normal; justify-content:normal; gap:5px; }
```

**`.list`**
```
CSS/style.css:196
.list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
```
```
CSS/artist.css:401
#section-merch>.list {
    gap: 0;
}
```

**`.label`** — 未找到任何 CSS 規則。

**`.right`**
```
CSS/artist.css:272
.card>.right {
    width: 100px;
    display: flex;
    text-align: center;
    align-self: center;
    justify-content: space-between;
}
```

**`.divider`**
```
CSS/list-page.css:657
.divider {
    font-size: 12px;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-color);
    margin-top: 10px;
}
```

**`.active`**
```
CSS/login.css:50
.active {
    color: var(--text-primary);
    border-bottom-color: var(--text-primary);
}
```

**`.row2`**
```
CSS/list-page.css:608
.row2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    align-items: end;
}
```

**`.date`** — 未找到任何 CSS 規則。

---

### 1.2 全專案掃描出的「真正衝突」(同 class、不同檔案或同檔案內,屬性值不同)

**`.comment`** — artist.css 自己就有兩份互相衝突的 `.comment` 定義:
```
CSS/list-page.css:330
.comment { display: flex; gap: 12px; }
CSS/list-page.css:335
.comment:not(:last-child) { border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }

CSS/artist.css:326   (與 list-page.css 相同)
.comment { display: flex; gap: 12px; }
CSS/artist.css:333    (與 list-page.css 相同)
.comment:not(:last-child) { border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }

CSS/artist.css:394   ← 同一檔案內第二次定義 .comment,屬性完全不同
.comment {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 16px;
}
```
artist.css:394 在來源順序上排在後面,會覆蓋掉 326 行的 flex 版本(部分屬性如 `display:flex` 沒有重複設定的會被保留,但視覺上等同於把同一個 class 重新定義成卡片樣式)。

**`.comment-time`** — artist.css 內部前後兩份不一致:
```
CSS/list-page.css:352
.comment-time { font-size: 12px; color: var(--text-muted); }

CSS/artist.css:359   ← 缺少 color
.comment-time { font-size: 12px; }

CSS/artist.css:742   ← 又補回 color,與 list-page.css 一致
.comment-time { font-size: 12px; color: var(--text-muted); }
```

**`.badge`** — 三個檔案對同一 class 給出不同屬性集(雖然各自掛在不同的父層複合選擇器上,屬於層疊覆寫而非單純衝突,但請確認是否為刻意設計):
```
CSS/style.css:159
.badge { font-size: 16px; border-radius: 20px; padding: 3px 7px; }

CSS/list-page.css:316
.lp-card .badge { font-size: small; }

CSS/artist.css:577
.cheer-card-meta,
.cheer-card-host,
.cheer-card .badge {
    font-size: small;
    display: flex;
    align-items: flex-start;
}
```

**`.btn-submit`** — cheering-new.css 與 artist.css 的配色幾乎是「相反」的,需確認是否為手誤:
```
CSS/cheering-new.css:159
.btn-submit {
    background-color: var(--badge-purple-text);
    color: var(--badge-purple-bg);
    border: 1px solid var(--badge-purple-bg);
    padding: 5px 13px;
}

CSS/artist.css:713   ← 顏色變數位置對調
.form-actions>.btn-submit {
    background-color: var(--badge-purple-bg);
    color: var(--badge-purple-text);
    border: 1px solid var(--badge-purple-text);
}
CSS/artist.css:719
.form-actions>.btn-submit:hover {
    background-color: var(--badge-purple-text);
    color: var(--badge-purple-bg);
    border: 1px solid var(--badge-purple-bg);
}
```

**`.form-section`** — 兩個檔案的視覺完全不同(有沒有卡片背板):
```
CSS/cheering-new.css:70
.form-section {
    width: 85%;
    margin: auto;
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

CSS/artist.css:680   ← 沒有背景/邊框/padding/寬度,只有 flex 排版
.form-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
```

**`.section-header`(在 `.form-section>.section-header` 情境下)** — artist.css 自己前後兩份矛盾:
```
CSS/artist.css:703
.form-section>.section-header { margin-bottom: -5px; }

CSS/artist.css:725
.form-section>.section-header { margin-bottom: 5px; }
```
(基礎 `.section-header` 本身在 list-page.css / review.css / artist.css 三份完全相同,見 1.3)

**`.warn-banner`** — list-page.css 自己前後兩份矛盾,artist.css 又是第三種版本:
```
CSS/list-page.css:357
.warn-banner { display: flex; flex-direction: column; font-size: 14px; padding: 3px 7px; margin: 10px; }

CSS/list-page.css:431   ← 同檔案第二次定義,沒有 flex-direction:column,改成置中
.warn-banner { display: flex; justify-content: center; align-items: center; }

CSS/artist.css:472   ← 缺少 flex-direction:column(與 357 行的版本不同)
.warn-banner { display: flex; font-size: 14px; padding: 3px 7px; margin: 10px; }
```

**`.meta-label`** — 兩個檔案各自在不同父層複合選擇器下給完全不同的屬性:
```
CSS/list-page.css:545
.lp-contact__row>.meta-label { width: 55px; }

CSS/artist.css:648
.cheer-detail-meta-row>.meta-label { flex-shrink: 0; color: var(--text-muted); font-size: 13px; }
```

**`.modal-footer`** — artist.css 多了一個 `margin-top`:
```
CSS/list-page.css:583
.modal-footer { display: flex; justify-content: center; gap: 100px; }

CSS/artist.css:876
.modal-footer { display: flex; justify-content: center; gap: 100px; margin-top: 20px; }
```

**`.page-hero-content`** — list-page.css 用寫死的色碼,review.css/artist.css 用 CSS 變數,且規則被拆成兩段:
```
CSS/list-page.css:56
.page-hero-content {
    margin-block: 10px;
    color: #f0eeff;
    font-family: var(--font-space);
    margin-top: 70px;
}

CSS/review.css:71 / CSS/artist.css:70
.artist-name, .artist-tour-name, .page-hero-content {
    margin-block: 10px;
    color: var(--bg-page);
    font-family: var(--font-space);
}
CSS/review.css:79 / CSS/artist.css:78
.page-hero-content { margin-top: 70px; }
```

**`.latest-track-wrapper`** — profile.css 只搬了一部分,index.css 才有完整的 hover/漸層遮罩邏輯:
```
CSS/index.css:136   .latest-track-wrapper { overflow:hidden; position:relative; width:100%; }
CSS/index.css:183   #left-button,#right-button,.latest-track-wrapper::before,.latest-track-wrapper::after { opacity:0; transition:opacity .3s; }
CSS/index.css:195   .latest-track-wrapper.is-start:hover::before { opacity:0; }
CSS/index.css:199   .latest-track-wrapper.is-end:hover::after { opacity:0; }
CSS/index.css:203   .latest-track-wrapper:hover #left-button, ...:hover #right-button, ...::before, ...::after { opacity:1; }
CSS/index.css:210   .latest-track-wrapper::before { ...漸層遮罩... }
CSS/index.css:223   .latest-track-wrapper::after { ...漸層遮罩... }

CSS/profile.css:100   .latest-track-wrapper { overflow:hidden; position:relative; width:100%; }   ← 只有這條與 index.css 相同
CSS/profile.css:155   .latest-track-wrapper:hover #left-button, ...:hover #right-button { opacity:1; }   ← 缺少 is-start/is-end 與 ::before/::after 漸層規則
```

---

### 1.3 跨檔案「內容完全相同」的重複定義(非衝突,但屬於重複維護點,列出供您確認範圍)

以下 class 在多個 CSS 檔案中重複出現,但目前內容逐字相同:

| Class | 出現位置(檔案:行號) |
|---|---|
| `artist-hero-bg` | review.css:49、artist.css:48 |
| `artist-hero-overlay` | review.css:60、artist.css:59 |
| `artist-name` / `artist-tour-name`(同一複合選擇器) | review.css:71、artist.css:70 |
| `avatar` | list-page.css:320、review.css:201、artist.css:338 |
| `btn-new-cheer`(含 `:hover`) | list-page.css:202,212、artist.css:519,528 |
| `comment-body` | list-page.css:340、artist.css:347 |
| `comment-meta` | list-page.css:346、artist.css:353 |
| `form-field` | cheering-new.css:91、artist.css:708 |
| `modal-box` | list-page.css:574、artist.css:762 |
| `related-genre` | list-page.css:184、review.css:196、artist.css:195 |
| `related-item`(含 `:hover`) | list-page.css:167,174、review.css:179,186、artist.css:178,185 |
| `related-list` | list-page.css:161、review.css:173、artist.css:172 |
| `related-name` | list-page.css:178、review.css:190、artist.css:189 |
| `section-header`(基礎定義) | list-page.css:1、review.css:21、artist.css:21 |
| `sidebar-artist-img`(`img` 子選擇器) | list-page.css:99、review.css:103、artist.css:102 |
| `sidebar-artist-info` / `sidebar-tour-info`(`>p` 複合) | list-page.css:113、review.css:117、artist.css:116 |
| `sidebar-artist-name` / `sidebar-stat`(複合) | list-page.css:107、review.css:111、artist.css:110 |
| `sidebar-link`(含 `>span`、`:hover`) | list-page.css:144,153,157、review.css:148,152,161、artist.css:147,151,160 |
| `sidebar-stat-label` | list-page.css:139、review.css:143、artist.css:142 |
| `sidebar-stat-value` | list-page.css:133、review.css:137、artist.css:136 |
| `sidebar-stats` | list-page.css:121、review.css:125、artist.css:124 |
| `sidebar-tour-info`(獨立規則) | list-page.css:128、review.css:132、artist.css:131 |
| `sort-btn` | list-page.css:228、artist.css:534 |
| `sort-btn--active`(`.sort-group>` 複合) | list-page.css:234、artist.css:540 |
| `sort-group`(同上複合選擇器) | list-page.css:234、artist.css:540 |
| `upload-area`(含 `>svg`) | cheering-new.css:105,121、list-page.css:664,679 |
| `warn-link`(含 `::after`) | list-page.css:367,371、artist.css:485,490 |

### 1.4 只是「基礎定義 + 另一檔案的情境覆寫」,非真正衝突

這些 class 只在一個檔案有獨立的 `.class{...}` 基礎定義,另一個檔案只用複合選擇器(如 `#id .class`、`.parent>.class`)做情境延伸,沒有對同一選擇器給出矛盾值:

- `chevron`(基礎在 style.css:227;artist.css:317 只有 `details[open] .chevron`)
- `form-actions`(基礎在 cheering-new.css:179;artist.css 只有 `.form-actions>.btn-submit` 系列)
- `ti`(基礎在 list-page.css:554;index.css:78 只有 `.about-card-icon .ti`)
- `review-card__footer`(基礎+ `span` 規則在 review.css;profile.css:276 只有 `.review-card--compact .review-card__footer` 修飾)

---

## 2. 死碼(CSS 有定義,但 class_inventory.md 中沒有任何 HTML 檔案使用)

共 16 個:

**`.cheer-card`**
```
CSS/artist.css:555
.cheer-card { display:flex; background-color:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; overflow:hidden; }
CSS/artist.css:563
.cheer-card:hover { background-color:var(--bg-hover); border-color:var(--purple-main); }
```

**`.cheer-card-body`**
```
CSS/artist.css:546
.cheer-card-body { flex:1; padding:12px; display:flex; flex-direction:column; gap:6px; }
```

**`.cheer-card-detail`**
```
CSS/artist.css:607
.cheer-card-detail { margin-block:-8px; display:flex; align-items:center; gap:20px; }
CSS/artist.css:615
.cheer-card-detail svg { width:15px; height:15px; }
```

**`.cheer-card-host`**(與 `.cheer-card-meta` 共用選擇器)
```
CSS/artist.css:577
.cheer-card-meta, .cheer-card-host, .cheer-card .badge { font-size:small; display:flex; align-items:flex-start; }
CSS/artist.css:585
.cheer-card-meta, .cheer-card-host { color: var(--text-muted); }
```

**`.cheer-card-img`**
```
CSS/artist.css:596
.cheer-card-img { width:120px; flex-shrink:0; }
CSS/artist.css:601
.cheer-card-img>img { width:100%; height:100%; object-fit:cover; }
```

**`.cheer-card-meta`**(同上,另外還有獨立規則)
```
CSS/artist.css:590
.cheer-card-meta { justify-content:space-between; align-items:center; margin-top:-10px; }
```

**`.cheer-card-title`**
```
CSS/artist.css:568
.cheer-card-title { display:flex; flex-direction:column; padding-bottom:5px; border-bottom:1px solid var(--border-color); margin-top:-10px; color:var(--text-primary); }
```

**`.cheering-list`**
```
CSS/artist.css:502
.cheering-list { display:flex; flex-direction:column; gap:16px; }
```

**`.cheering-toolbar`**
```
CSS/artist.css:509
.cheering-toolbar { display:flex; margin-top:13px; }
CSS/artist.css:515
.cheering-toolbar>h2 { flex:1; }
```

**`.comment-avatar`**
```
CSS/review.css:470
.comment-avatar { width:28px; height:28px; border-radius:50%; background:#c4b5f4; color:#5b21b6; font-size:9px; font-weight:500; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
```

**`.hidden`**
```
CSS/index.css:191
.hidden { display: none; }
```

**`.is-end`**
```
CSS/index.css:199
.latest-track-wrapper.is-end:hover::after { opacity: 0; }
```

**`.is-start`**
```
CSS/index.css:195
.latest-track-wrapper.is-start:hover::before { opacity: 0; }
```

**`.laest-title`**(疑似 `latest-title` 的打字錯誤,但因找不到對應 HTML class,歸類為死碼)
```
CSS/index.css:131
.laest-title { align-self: center; font-size: 14px; }
```

**`.merch-card-remove`**
```
CSS/artist.css:816
.merch-card-remove { background:none; border:none; cursor:pointer; font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:4px; padding:0; }
CSS/artist.css:828
.merch-card-remove:hover { color: var(--text-primary); }
```

**`.review-avatar`**
```
CSS/review.css:292
.review-avatar { width:36px; height:36px; border-radius:50%; background:var(--purple-main); color:#fff; font-size:11px; font-weight:500; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
```

備註:`.cheer-card*` 系列、`.cheering-list`、`.cheering-toolbar` 看起來像是 artist.html 改版前使用的舊版讓票/應援卡片元件,目前 HTML 已改用 `lp-card*` / `list` 等 class;`.comment-avatar` / `.review-avatar` 則疑似頭像 fallback(文字縮寫頭像)用的樣式,但目前 HTML 都直接用 `<img class="avatar">`,沒有觸發這組 class。

---

## 3. 疑似打字錯誤或孤兒樣式:`arro-rightw`

- **`arro-rightw` 在所有 CSS 檔案中完全沒有對應的規則定義**(搜尋不到任何 `.arro-rightw`)。
- 使用位置:`cheering.html:79`
  ```html
  <a href="https://www.oneokrock.com/jp/" target="_blank" class="sidebar-link">
      <span>官方網站</span><span class="arro-rightw">→</span>
  </a>
  ```
- 對照同一份檔案裡幾乎相同結構、相鄰的另一個連結(`cheering.html:82`),用的是 `arrow-right`:
  ```html
  <a href="https://www.youtube.com/@ONEOKROCK" target="_blank" class="sidebar-link">
      <span>YouTube</span><span class="arrow-right">→</span>
  </a>
  ```
- `arrow-right` 的實際樣式定義:
  ```
  CSS/style.css:115
  .arrow-right, .arrow-left {
      transition: transform 0.3s;
      display: inline-block;
  }
  CSS/style.css:121
  .more:hover .arrow-right, .warn-link:hover .arrow-right {
      transform: translateX(8px);
  }
  ```

**結論**:`arro-rightw` 與 `arrow-right` 出現在完全相同的 UI 模式(`sidebar-link` 內、文字後面接一個「→」箭頭 span),但 `arro-rightw` 在任何 CSS 檔案中都沒有規則,等同於該箭頭符號沒有 `transition`/`hover translateX` 效果。高度懷疑這是 `arrow-right` 的打字錯誤(字母順序錯位 + 多了一個 `w`),而不是刻意建立的獨立樣式 ——因為它從未在 CSS 裡被定義,視覺上會與其他頁面/其他連結的箭頭表現不一致(其他箭頭 hover 時會位移,這個不會)。

---

## 4. 同概念不同命名:比對相似度

### 4.1 `comment` / `comment-body`(artist.html)vs `comment-row` / `comment-bubble`(review.html)

```
.comment (list-page.css:330 / artist.css:326)
    display: flex; gap: 12px;
.comment:not(:last-child)
    border-bottom: 1px solid var(--border-color); padding-bottom: 10px;
.comment (artist.css:394，第二次定義，見 1.2)
    background-color: var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:16px;

.comment-body (list-page.css:340 / artist.css:347)
    display: flex; flex-direction: column; gap: 6px;

.comment-row (review.css:463)
    display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px;

.comment-bubble (review.css:484)
    background: var(--bg-section, #ede9f8); border-radius: 0 20px 20px 20px; padding: 8px 12px; flex: 1;
```

**相似度判斷**:`comment`/`comment-row` 概念角色相同 ——都是「一則留言的橫向排列容器」(flex row + gap),數值也接近(gap 12px vs 8px)。但兩邊的視覺呈現已經分岔:artist.html 那邊因為 394 行的衝突規則,實際呈現是「卡片框」(背景色+邊框+圓角);review.html 那邊則是「聊天泡泡」(`comment-bubble` 單側圓角 + 紫色底色,搭配 `comment-avatar` 圓形頭像)。`comment-body` 單純是文字直排容器,跟 `comment-bubble`(有底色、有泡泡尖角造型)在視覺定位上不是同一層級的東西 —— `comment-body` 更接近「文字區塊」,`comment-bubble` 是「整個泡泡外框」。
結論:概念上同屬「留言列表項目」,但目前兩邊的視覺設計已經不一致(卡片 vs 聊天泡泡),要合併前需要先決定要統一成哪種視覺,不是單純改名就能合併。

### 4.2 `divider`(list-page.css)vs `login-divider`(login.css)vs `stub-divider`(profile.css)

```
.divider (list-page.css:657)
    font-size: 12px; color: var(--text-muted); border-bottom: 1px solid var(--border-color); margin-top: 10px;

.login-divider (login.css:86)
    display: flex; align-items: center; gap: 12px; margin: 0.5rem 0;
.login-divider::before, .login-divider::after (login.css:94)
    content: ""; flex: 1; height: 1px; background-color: var(--border-color);
.login-divider>span (login.css:102)
    display:flex; align-items:center; justify-content:center; font-size:14px; color:var(--text-secondary);

.stub-divider (profile.css:259)
    width: 60%; border-top: 1px dashed var(--border-color); margin-bottom: 8px;
```

**相似度判斷**:三者用途完全不同 ——
- `divider` 是「帶底線的小字標籤/區段分隔文字」(像列表裡的日期分組標籤)。
- `login-divider` 是「左右各一條線、中間夾文字」的 OR 分隔線(登入頁常見的「或」分隔),用了 `::before`/`::after` 雙線結構。
- `stub-divider` 是票根上的「虛線裁切線」裝飾,單純一條 60% 寬的 dashed 上邊框。
三者只是巧合共用「divider」這個泛用詞,樣式屬性幾乎沒有重疊(連邊框方向 `border-bottom` vs `border-top`、線型 solid vs dashed 都不同)。**不建議合併**,目前的差異反映的是三種截然不同的 UI 元件,合併成一個共用 class 反而會增加耦合風險。

### 4.3 `more` vs `off-more` vs `live-more` vs `review-read-more` vs `review-comments__more`

```
.more (style.css:86)
    position:relative; display:inline-block; align-self:flex-start; color:var(--text-secondary); margin-top:5px;
.more:hover::after / .more::after (style.css:94,98)
    底線動畫(width 0 → 100%)
.more:hover .arrow-right (style.css:121)
    箭頭 translateX(8px)

.off-more (style.css:110，與 .about-more 共用選擇器)
    .about-more:hover::after, .off-more:hover::after { width: calc(100% + 8px); }

.live-more (index.css:303)
    width:100%; padding:10px 0; text-align:center; background-color:var(--purple-sub);

.review-read-more (review.css:356)
    font-size:13px; color:var(--purple-main); text-decoration:none; display:inline-block; margin-bottom:12px;
.review-read-more:hover
    opacity: 0.75;

.review-comments__more (review.css:505)
    font-size:12px; color:var(--purple-main); text-decoration:none; display:block; margin-bottom:12px;
.review-comments__more:hover
    opacity: 0.75;
```

實際 HTML 用法對照(來自 class_inventory.md / 原始 HTML):
- `off-more` 一律與 `more` 同時出現在同一個元素上(`class="more off-more"`,見 artist.html:131),本身就是 `more` 的修飾用法,不是獨立元件。
- `live-more` 用在 `<div class="live-more">`(index.html),是整條滿版的色塊按鈕,跟 `more` 的「文字連結+底線動畫」完全是不同視覺語言。

**相似度判斷**:
1. `more` + `off-more`:本來就是同一元件的「基礎 + 修飾」組合,不存在重複定義問題。
2. `live-more`:視覺與用途(滿版色塊 banner)跟 `more` 系列(行內文字連結)差異很大,**不建議**與 more 系列合併。
3. `review-read-more` 與 `review-comments__more`:兩者幾乎是同一份樣式的兩份拷貝 —— 同樣的 `color`、`text-decoration:none`、`margin-bottom:12px`、`:hover { opacity:0.75 }`,只差 `font-size`(13px vs 12px)和 `display`(inline-block vs block)。**相似度非常高,是最值得合併的一組**(可視為同一個「文字連結 + hover 變淡」元件的兩個尺寸變體)。
4. `review-read-more` / `review-comments__more` 整組 vs `more`:概念上都是「查看更多」連結,但視覺處理手法不同(`more` 用底線動畫+箭頭位移,review 那組用 hover 透明度淡化),目前不是同一套視覺系統,合併前需要先統一視覺風格。

---

備註:本報告所有行號以掃描當下的檔案內容為準,僅供現狀確認,後續若要修改請另行確認影響範圍。

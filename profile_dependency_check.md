# profile.html CSS 依賴盤點

範圍:profile.html 目前引入的 7 個 CSS 檔案 — style.css、nav.css、footer.css、artist.css、list-page.css、review.css、profile.css。
方法:列出 profile.html 用到的所有 class,逐一比對 7 個檔案裡「`.class名稱`」這個 selector 實際出現在哪些檔案,再標出「只在 artist.css 或 review.css 出現、在 style.css / list-page.css / profile.css 都找不到」的項目。

**本檔案只做盤點,未修改任何檔案。**

---

## A. 完整 class 對照表

| class 名稱 | 定義於 | 備註 |
|---|---|---|
| theme-light | style.css | |
| nav-logo | nav.css | |
| nav-links | nav.css | |
| nav-line | nav.css | |
| nav-login | nav.css | |
| sidebar-avatar | profile.css | |
| sidebar-profile-info | profile.css | |
| sidebar-profile-name | profile.css | |
| sidebar-profile-bio | profile.css | |
| sidebar-join-date | profile.css | |
| sidebar-stats | list-page.css, artist.css | 兩處重複定義,但 list-page.css 有,不算借用 |
| sidebar-stat | list-page.css, artist.css | 同上 |
| sidebar-stat-value | list-page.css, artist.css | 同上 |
| sidebar-stat-label | list-page.css, artist.css | 同上 |
| sidebar-links | **找不到** | 7 個檔案裡完全沒有 `.sidebar-links` 規則(只有單數的 `.sidebar-link`)。見 C 段 |
| sidebar-link | list-page.css, artist.css | |
| btn-edit-profile | profile.css | |
| **tab-item** | **artist.css(僅此一處)** | ⚑ 借用,見 B 段 |
| section-header | list-page.css, artist.css, review.css | |
| section-header__title | **找不到** | 見 C 段 |
| section-count | profile.css | |
| latest-track-wrapper | profile.css | |
| size-6 | **找不到** | 見 C 段(Tailwind/heroicons 慣用 class,專案 CSS 從未定義過) |
| ticket-track | profile.css | |
| ticket-card | profile.css | |
| ticket-poster | profile.css | |
| ticket-poster-info | profile.css | |
| ticket-artist-name | profile.css | |
| ticket-tour-name | profile.css | |
| ticket-venue | profile.css | |
| ticket-perforation | profile.css | |
| notch / notch--top / notch--bottom | profile.css | |
| ticket-stub | profile.css | |
| stub-month / stub-day / stub-year / stub-divider / stub-seat / stub-price | profile.css | |
| more | style.css | |
| arrow-right | style.css | |
| list | style.css, artist.css | |
| **review-card** | **review.css(僅此一處)** | ⚑ 借用,見 B 段 |
| review-card--compact | profile.css | profile 專屬 modifier,正常 |
| **review-card__header** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-card__author** | **review.css(僅此一處)** | ⚑ 借用 |
| avatar | list-page.css, artist.css, review.css | |
| **review-meta** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-author** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-time** | **review.css(僅此一處)** | ⚑ 借用 |
| badge | style.css | |
| **badge--review-type** | **review.css(僅此一處)** | ⚑ 借用 |
| **badge--review-type-prep** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-card__title** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-card__body** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-read-more** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-img-single** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-img-grid** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-img-more-wrapper** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-img-more** | **review.css(僅此一處)** | ⚑ 借用 |
| **review-card__footer** | **review.css(基底定義)+ profile.css(只有覆寫片段)** | ⚑ 借用,見 B 段說明 |
| lp-card | list-page.css | |
| lp-card__img | list-page.css | |
| lp-card__body | list-page.css | |
| lp-card__meta | list-page.css | |
| badge-group | style.css | |
| badge--cheer | style.css | |
| lp-card__title | list-page.css | |
| lp-card__host | list-page.css | |
| lp-card__detail | list-page.css | |
| badge--ended | profile.css | |
| footer-content / footer-top / footer-top-left / footer-logo / footer-social / footer-links | footer.css | |
| footer-slogan | **找不到** | 見 C 段 |
| footer-copyright | **找不到**(但有 `.footer-content > p` 通用規則間接套用) | 見 C 段 |

---

## B. 借用 artist.css / review.css 專屬樣式的清單(規則內容 + 原頁面情境)

### `.tab-item` — 定義於 artist.css

```css
.tab-item {
    padding-inline: 20px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding-block: 8px;
    position: relative;
    color: var(--text-secondary);
    font-size: 16px;
    font-weight: 500;
}

.tab-item::after {
    content: "";
    position: absolute;
    bottom: -3px;
    left: calc(50% - 15px);
    width: 30px;
    height: 2px;
    background-color: var(--text-secondary);
    transition: width 0.3s, left 0.3s;
}

.tab-item:hover::after {
    color: var(--purple-main);
    width: 100%;
    left: 0;
    ...
}
```

**artist.html 原始情境**:藝人頁面內部錨點分頁列(`#profile-tabs` / artist.html 對應的是頁內 jump 連結),用於「粉絲留言」「應援計畫」「周邊情報」「票券轉讓」等 4 個分頁項目。
**profile.html 使用情境**:個人檔案頁的「參戰紀錄 / 我的心得 / 應援紀錄」3 個分頁項目,結構和語意上是同一種「頁內分頁列」概念,借用合理但目前是「借用」而非「共用宣告」。

---

### `.review-card` 家族 — 全部定義於 review.css

```css
.review-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 16px;
}

.review-card__author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.review-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.review-meta {
    display: flex;
    flex-direction: column;
}

.review-author {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.review-time {
    font-size: 12px;
    color: var(--text-muted);
}

.badge--review-type {
    background: #ede9fe;
    color: #6d28d9;
    margin-bottom: 8px;
    display: inline-block;
}

.badge--review-type-prep {
    background: #fce7f3;
    color: #be185d;
}

.review-card__title {
    font-size: 20px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 8px;
    font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
}

.review-card__body {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 6px;
}

.review-read-more {
    font-size: 13px;
    color: var(--purple-main);
    text-decoration: none;
    display: inline-block;
    margin-bottom: 12px;
}
.review-read-more:hover { opacity: 0.75; }

.review-img-single {
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;
}
.review-img-single img { width: 100%; height: auto; display: block; }

.review-img-grid {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
}
.review-img-grid img {
    width: 80px; height: 80px; object-fit: cover; border-radius: 6px; position: relative;
}

.review-img-more-wrapper {
    position: relative; width: 80px; height: 80px; flex-shrink: 0;
}
.review-img-more-wrapper img { width: 80px; height: 80px; object-fit: cover; border-radius: 6px; }

.review-img-more {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background-color: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
}

.review-card__footer {
    display: flex;
    gap: 20px;
    font-size: 13px;
    color: var(--text-muted);
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0;
}
.review-card__footer span { display: flex; align-items: center; gap: 4px; cursor: pointer; transition: color 0.2s ease; }
.review-card__footer span:hover { color: var(--purple-main); }
```

**review.html 原始情境**:心得列表頁裡每一篇心得的卡片(`<article class="review-card">`),內部結構固定為:
`review-card__header`(作者列 + 類型 badge)→ `review-card__author` 包 `avatar` + `review-meta`(`review-author` 作者名 + `review-time` 時間)→ `review-card__title` 標題 → `review-card__body` 內文(3 行截斷)→ 可選的 `review-img-single` / `review-img-grid` + `review-img-more-wrapper`/`review-img-more` 附圖 → `review-card__footer` 互動列(讚數/留言數)。

**profile.html 使用情境**:「我的心得」分頁裡完整複製了同一套 `review-card` 結構(只多加 `review-card--compact` modifier,在 profile.css 裡用 `.review-card--compact .review-card__footer` 把底部留言區的邊框/間距拿掉)。換句話說,profile.html 沒有自己的「心得卡片」樣式定義,完全依賴 review.css 把整套卡片畫出來,profile.css 只負責一個尺寸/邊框的微調覆寫,而不是 `.review-card__footer` 本身的完整定義。

---

## C. 額外發現(不在「借用 artist/review」題目範圍內,但盤點時順手發現)

以下 class 在 profile.html 裡使用,但**全部 7 個 CSS 檔案都找不到對應規則**,純粹靠繼承父層或標籤預設樣式撐著,跟「借用其他頁面樣式」是不同性質的問題,先列出供你之後決定要不要處理:

| class 名稱 | 使用位置(profile.html) | 目前狀況 |
|---|---|---|
| `sidebar-links` | 第 59 行,社群帳號連結的容器 `<div>` | 完全沒有規則,只有單數的 `.sidebar-link` 有定義 |
| `section-header__title` | 各 section 標題 `<h2>`(第 85、244、331 行) | 完全沒有規則,純靠 `<h2>` 預設樣式 |
| `size-6` | SVG icon class(第 90、95 行等) | 完全沒有規則(常見於 Tailwind/heroicons,但本專案沒有採用對應的 CSS) |
| `footer-slogan` | 第 470 行 | 完全沒有規則 |
| `footer-copyright` | 第 484 行 | 沒有專屬規則,但會吃到 footer.css 的 `.footer-content > p` 通用樣式 |

# CSS 架構審計報告

掃描範圍：9 個 `.html`（index, artist, cheering, cheering-detail, cheering-new, transfer, review, profile, login）＋ 10 個 `.css`（style, nav, footer, list-page, index, artist, review, profile, cheering-new, login）。

本報告為唯讀分析，未修改任何檔案。所有清單均由腳本逐字解析（非肉眼掃描），class/selector 名稱可信度高；第 6、7 節的歸屬建議涉及主觀判斷，標註為建議而非定論。

---

## 0. 重要發現摘要（先看這裡）

1. **`size-6` 是個幽靈 class**：在 index / artist / cheering / cheering-new / transfer 五個頁面共用於 svg 圖示，但**整個專案的 CSS 都沒有定義 `.size-6`**。圖示目前能看起來正常，純粹是因為 svg 本身有 `viewBox`，這個 class 完全沒在生效，可安全刪除或要記得補上定義。
2. **頁面缺連結，導致樣式失效**：
   - `cheering-new.html` 用了 `class="hero-sub"`，但該頁只連結 `cheering-new.css`，沒連 `index.css`（`.hero-sub` 定義在 `index.css`）→ **這段文字目前無樣式**。
   - `transfer.html` 用了 `form-field`、`meta-value`、`modal-body`、`modal-header`，但定義散落在 `artist.css` / `cheering-new.css`，而 `transfer.html` 沒連這兩個檔 → **轉讓公告 modal 內的表單目前無樣式**。
   - `artist.html` 用了 `comment-name`、`comment-text`，定義在 `review.css`，但 `artist.html` 沒連 `review.css` → **粉絲留言區的留言人名稱/內文目前無樣式**。
   - `cheering-detail.html` 用了 `comment-input-row`、`radio-pill`，定義分別在 `review.css`／`cheering-new.css`，該頁都沒連 → **留言輸入列、報名單選按鈕目前無樣式**。
   - `index.html` 用了 `artist-name`，定義在 `artist.css`/`review.css`，`index.html` 沒連任何一個（但 index.html 的 `.artist-name` 用在首頁卡片標題，視覺上目前無樣式，只是繼承純文字）。
3. **死碼（已確認全站都沒用到）**：`.btn-new-cheer`／`.btn-new-cheer:hover`／`.sort-btn`／`.sort-group>.sort-btn--active` 同時出現在 `list-page.css` 和 `artist.css`（兩份一字不差），疑似是排序/應援按鈕的舊版設計，已被 `.add-report-btn` + `.sort-active` 取代但沒清掉。
4. **三檔同名同內容**：`.avatar`、`.related-*`、`.sidebar-*`、`.section-header`、`h3`、`aside` 等一整組「側欄／留言／相關藝人」樣式，在 `list-page.css`、`artist.css`、`review.css` 三份檔案裡逐字重複。這是目前最大宗的重複定義來源。
5. **同檔內自我覆蓋**：`list-page.css` 的 `.warn-banner` 被定義了兩次（第一次 `flex-direction: column`，第二次只設 `justify-content/align-items`），且 `artist.css` 又定義第三次、方向改成 `row`，三者疊加後實際生效的版面取決於連結順序（`artist.css` 排在 `list-page.css` 後面，所以 `row` 會贏）——這是潛在的視覺 bug 來源，建議重構時順手修掉。
6. **review.css 內含完全用不到的複製貼上**：`review.css` 定義了 `#artist-hero`、`.artist-hero-bg`、`.artist-hero-overlay`、`.artist-name`、`.artist-tour-name`，但 `review.html` 本身用的是 `#lp-hero` / `.lp-hero-bg` 樣式（跟 cheering、transfer 同款），完全沒有 `id="artist-hero"` 或 `class="artist-name"` 這些東西。這組規則對 review.html 來說是純廢碼（只是因為 artist.html 真的有用到，所以全站比對不會被判定為「死」）。

---

## 1. HTML class 清單（去重、依字母排序）

> `ti` / `ti-*` 為 Tabler Icons CDN 字型 class，定義在外部 CDN，非站內 CSS 範圍，已於下方標註但不計入孤兒/死碼判定。

#### index.html
about-card, about-card-icon, about-left, about-more, about-right, arrow-right, artist-card, artist-hover, artist-img, artist-info, artist-name, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, hero-content, hero-logo, hero-sub, hero_background, latest-header, latest-track-wrapper, live-date, live-item, live-more, live-venue, more, nav-line, nav-links, nav-login, nav-logo, size-6, ~~hero-slogan~~（註解內，未實際輸出）, *ti, ti-calendar-event, ti-map-pin, ti-messages, ti-ticket*

#### artist.html
add-report-btn, arrow, arrow-right, artist-hero-bg, artist-hero-overlay, artist-name, artist-tour-name, avatar, badge, badge--cheer, badge--country, badge--genre, badge--limited, badge--merch, badge--offer, badge--on-sale, badge--rule, badge--sold, badge--want, badge-group, badge-rules, card, cheer-detail, cheer-icon, cheer-info, cheer-title, chevron, color-icon, comment, comment-body, comment-likes, comment-meta, comment-name, comment-text, comment-time, date, date-detail, date-item, detail-grid, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, form-field, form-label, label, list, merch-add-card-btn, merch-card-index, merch-name, merch-price, merch-report-card, merch-report-card__fields, merch-report-card__header, merch-row, merch-sizes, merch-updated, modal-body, modal-box, modal-close, modal-footer, modal-header, modal-overlay, more, nav-line, nav-links, nav-login, nav-logo, off-more, related-genre, related-info, related-item, related-list, related-name, req, right, rules-section, section-header, section-header__title, sidebar-artist-img, sidebar-artist-info, sidebar-artist-name, sidebar-link, sidebar-links, sidebar-stat, sidebar-stat-label, sidebar-stat-value, sidebar-stats, sidebar-tour-info, size-6, tab-item, theme-light, ticket-contact, ticket-meta, ticket-post-header, ticket-type, tour-meta, venue, warn-banner, warn-icon, warn-link, *ti, ti-plus, ti-x*

#### cheering.html
add-report-btn, arrow-left, arrow-right, avatar, badge, badge--cheer, badge--genre, badge--on-sale, badge-group, chevron, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, lp-card, lp-card__body, lp-card__detail, lp-card__host, lp-card__img, lp-card__meta, lp-card__title, lp-header, lp-hero-bg, lp-hero-overlay, lp-toolbar, nav-line, nav-links, nav-login, nav-logo, page-hero-content, page-hero-label, page-hero-sub, page-hero-title, related-genre, related-info, related-item, related-list, related-name, review-back, review-count, review-sort, sidebar-artist-img, sidebar-artist-info, sidebar-artist-name, sidebar-link, sidebar-links, sidebar-stat, sidebar-stat-label, sidebar-stat-value, sidebar-stats, sidebar-tour-info, size-6, sort-active, theme-light

#### cheering-detail.html
arrow-right, avatar, badge, badge--cheer, badge--genre, badge-group, btn-submit, capacity-bar-bg, capacity-bar-fill, cheer-detail-capacity, cheer-detail-desc, cheer-detail-img, cheer-detail-info, cheer-detail-meta-list, cheer-detail-meta-row, cheer-detail-title, cheer-detail-top, cheer-map-placeholder, comment, comment-author, comment-body, comment-contents, comment-input-row, comment-meta, comment-time, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, form-actions, form-field, form-field--full, form-section, list, lp-hero-bg, lp-hero-overlay, meta-label, meta-value, nav-line, nav-links, nav-login, nav-logo, page-hero-content, page-hero-label, page-hero-sub, page-hero-title, radio-group, radio-pill, related-genre, related-info, related-item, related-list, related-name, section-header, sidebar-artist-img, sidebar-artist-info, sidebar-artist-name, sidebar-link, sidebar-links, sidebar-stat, sidebar-stat-label, sidebar-stat-value, sidebar-stats, sidebar-tour-info, text-muted, theme-light

#### cheering-new.html
arrow-left, back, btn-cancel, btn-submit, char-count, checkbox-group, checkbox-item, cheering-new-hero-bg, cheering-new-hero-overlay, end-time-or, end-time-row, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, form-actions, form-field, form-field--full, form-row, form-section, form-section__title, hero-breadcrumb, hero-sub, nav-line, nav-links, nav-login, nav-logo, radio-pill, req, size-6, theme-light, upload-area, upload-text

#### transfer.html
add-report-btn, arrow-left, arrow-right, badge, badge--genre, badge--merch, badge--offer, badge--on-sale, badge--want, badge-group, chevron, color-icon, contact-group, divider, filter-bar, filter-btn, filter-btn--active, filter-btns, filter-group, filter-label, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, form-field, form-label, lp-card, lp-card--merch, lp-card--ticket, lp-card__body, lp-card__detail, lp-card__host, lp-card__img, lp-card__meta, lp-card__title, lp-contact__body, lp-contact__grid, lp-contact__note, lp-contact__row, lp-header, lp-hero-bg, lp-hero-overlay, lp-toolbar, meta-label, meta-value, modal-body, modal-box, modal-footer, modal-header, modal-overlay, nav-line, nav-links, nav-login, nav-logo, page-hero-content, page-hero-label, page-hero-sub, page-hero-title, price-list, price-row, price-value, price-zone, radio-group, radio-option, req, review-back, review-count, review-sort, row2, safety-icon, safety-item, safety-item--ok, safety-item--warn, safety-list, sidebar-artist-img, sidebar-artist-info, sidebar-artist-name, sidebar-price-ref, sidebar-safety, sidebar-safety__title, sidebar-stat, sidebar-stat-label, sidebar-stat-value, sidebar-stats, size-6, sort-active, theme-light, upload-area, upload-text, warn-banner, warn-icon, warn-link, *ti, ti-cash, ti-message-dots, ti-shield-check*

#### review.html
add-report-btn, arrow-left, arrow-right, avatar, badge, badge--review-type, badge--review-type-prep, btn-write-review, chevron, comment-bubble, comment-input, comment-input-row, comment-name, comment-row, comment-send, comment-text, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, lp-hero-bg, lp-hero-overlay, nav-line, nav-links, nav-login, nav-logo, page-hero-content, page-hero-label, page-hero-sub, page-hero-title, related-genre, related-info, related-item, related-list, related-name, review-author, review-back, review-card, review-card__author, review-card__body, review-card__footer, review-card__header, review-card__title, review-comments, review-comments__label, review-comments__more, review-count, review-img-grid, review-img-more, review-img-more-wrapper, review-img-single, review-meta, review-read-more, review-sort, review-time, review-toolbar, sidebar-artist-img, sidebar-artist-info, sidebar-artist-name, sidebar-link, sidebar-links, sidebar-stat, sidebar-stat-label, sidebar-stat-value, sidebar-stats, sidebar-tour-info, sort-active, theme-light, *ti, ti-heart, ti-message-circle, ti-share*

#### profile.html
arrow, arrow-right, avatar, badge, badge--cheer, badge--ended, badge--review-type, badge--review-type-prep, badge-group, btn-edit-profile, chevron, footer-content, footer-copyright, footer-links, footer-logo, footer-slogan, footer-social, footer-top, footer-top-left, latest-track-wrapper, list, lp-card, lp-card__body, lp-card__detail, lp-card__host, lp-card__img, lp-card__meta, lp-card__title, more, nav-line, nav-links, nav-login, nav-logo, notch, notch--bottom, notch--top, review-author, review-card, review-card--compact, review-card__author, review-card__body, review-card__footer, review-card__header, review-card__title, review-img-grid, review-img-more, review-img-more-wrapper, review-img-single, review-meta, review-read-more, review-time, section-count, section-header, section-header__title, sidebar-avatar, sidebar-join-date, sidebar-link, sidebar-links, sidebar-profile-bio, sidebar-profile-info, sidebar-profile-name, sidebar-stat, sidebar-stat-label, sidebar-stat-value, sidebar-stats, stub-day, stub-divider, stub-month, stub-price, stub-seat, stub-year, tab-item, theme-light, ticket-artist-name, ticket-card, ticket-perforation, ticket-poster, ticket-poster-info, ticket-stub, ticket-tour-name, ticket-track, ticket-venue, *ti, ti-heart, ti-message-circle*

#### login.html
active, btn-google, btn-primary-login, login-agree, login-card, login-divider, login-field, login-forgot, login-heading, login-logo, login-page, login-switch, login-tab, login-tabs, pane-login, theme-light

---

## 2. CSS selector 清單（去重、依字母排序）

#### CSS/style.css
`*`, `:root`, `a`, `body`, `body.theme-light`, `button`, `html`, `img`, `input:focus`, `input[type="checkbox"]`, `input[type="email"]`, `input[type="number"]`, `input[type="password"]`, `input[type="radio"]`, `input[type="text"]`, `input[type="time"]`, `select`, `select:focus`, `summary`, `summary::-webkit-details-marker`, `textarea`, `textarea:focus`, `#back-to-top`, `.about-more:hover::after`, `.add-report-btn`, `.add-report-btn:hover`, `.arrow-left`, `.arrow-right`, `.badge`, `.badge--cheer`, `.badge--country`, `.badge--genre`, `.badge--limited`, `.badge--merch`, `.badge--offer`, `.badge--on-sale`, `.badge--rule`, `.badge--sold`, `.badge--want`, `.badge-group`, `.card`, `.chevron`, `.color-icon`, `.list`, `.more`, `.more::after`, `.more:hover .arrow-right`, `.more:hover::after`, `.off-more:hover::after`, `.req`, `.review-back`, `.review-back::after`, `.review-back:hover .arrow-left`, `.review-back:hover::after`, `.warn-banner`, `.warn-link:hover .arrow-right`

#### CSS/nav.css
`#LG_NAV`, `#back-to-top`, `#back-to-top:hover`, `.nav-line`, `.nav-links`, `.nav-links .nav-login`, `.nav-links .nav-login:hover`, `.nav-links a`, `.nav-links a:hover`, `.nav-logo img`

#### CSS/footer.css
`#LG_FOOTER`, `.footer-content`, `.footer-content a:hover`, `.footer-content>p`, `.footer-links`, `.footer-links a`, `.footer-logo`, `.footer-social`, `.footer-top`, `.footer-top-left`

#### CSS/list-page.css
`#btn-cancel`, `#btn-submit`, `#lp-content`, `#lp-content>section`, `#lp-hero`, `#lp-main`, `#lp-sidebar`, `#lp-topbar`, `#transfer-modal`, `h2`, `h3`, `label`, `section:not(#artist-hero):not(#lp-hero)`, `details[open] .lp-card`, `details[open] summary`, `.avatar`, `.badge--review-type`, `.badge--review-type-prep`, `.btn-new-cheer`, `.btn-new-cheer:hover`, `.comment`, `.comment-body`, `.comment-meta`, `.comment-time`, `.comment:not(:last-child)`, `.contact-group`, `.divider`, `.filter-bar`, `.filter-btn`, `.filter-btn--active`, `.filter-btn:hover:not(.filter-btn--active)`, `.filter-btns`, `.filter-group`, `.filter-label`, `.lp-card`, `.lp-card .badge`, `.lp-card:hover`, `.lp-card__body`, `.lp-card__detail`, `.lp-card__detail span`, `.lp-card__detail svg`, `.lp-card__host`, `.lp-card__img`, `.lp-card__img>img`, `.lp-card__meta`, `.lp-card__title`, `.lp-contact__body`, `.lp-contact__grid`, `.lp-contact__note`, `.lp-contact__row`, `.lp-contact__row>.meta-label`, `.lp-header`, `.lp-hero-bg`, `.lp-hero-overlay`, `.lp-toolbar`, `.lp-toolbar>h2`, `.modal-box`, `.modal-footer`, `.page-hero-content`, `.page-hero-label`, `.page-hero-sub`, `.page-hero-title`, `.price-list`, `.price-row`, `.price-value`, `.radio-group`, `.radio-group>label`, `.radio-option`, `.radio-option>span`, `.related-genre`, `.related-item`, `.related-item:hover`, `.related-list`, `.related-name`, `.review-author`, `.review-card`, `.review-card__author`, `.review-card__body`, `.review-card__footer`, `.review-card__footer span`, `.review-card__footer span:hover`, `.review-card__header`, `.review-card__title`, `.review-count`, `.review-img-grid`, `.review-img-grid img`, `.review-img-more`, `.review-img-more-wrapper`, `.review-img-more-wrapper img`, `.review-img-single`, `.review-img-single img`, `.review-meta`, `.review-read-more`, `.review-read-more:hover`, `.review-sort`, `.review-sort a`, `.review-sort a.sort-active`, `.review-time`, `.row2`, `.safety-icon`, `.safety-item`, `.safety-item--ok`, `.safety-item--warn`, `.safety-list`, `.section-header`, `.sidebar-artist-img img`, `.sidebar-artist-info>p`, `.sidebar-artist-name`, `.sidebar-link`, `.sidebar-link:hover`, `.sidebar-link>span`, `.sidebar-price-ref`, `.sidebar-safety`, `.sidebar-safety__title`, `.sidebar-stat`, `.sidebar-stat-label`, `.sidebar-stat-value`, `.sidebar-stats`, `.sidebar-tour-info`, `.sidebar-tour-info>p`, `.sort-btn`, `.sort-group>.sort-btn--active`, `.tab-item`, `.tab-item::after`, `.tab-item:hover::after`, `.ti`, `.upload-area`, `.upload-area>svg`, `.warn-banner`, `.warn-banner>p`, `.warn-link`, `.warn-link::after`

#### CSS/index.css
`button>svg`, `#LG_ABOUT`, `#LG_HERO`, `#LG_LATEST`, `#latest-track`, `#left-button`, `#left-button:hover`, `#right-button`, `#right-button:hover`, `.about-card`, `.about-card-icon .ti`, `.about-card:hover`, `.about-left`, `.about-left>h2`, `.about-right`, `.artist-card`, `.artist-card:hover`, `.artist-card:hover .artist-hover`, `.artist-hover`, `.artist-img`, `.artist-img img`, `.artist-info`, `.hero-content`, `.hero-logo`, `.hero-sub`, `.hero_background`, `.hidden`, `.latest-header`, `.latest-header>h2`, `.latest-track-wrapper`, `.latest-track-wrapper.is-end:hover::after`, `.latest-track-wrapper.is-start:hover::before`, `.latest-track-wrapper::after`, `.latest-track-wrapper::before`, `.latest-track-wrapper:hover #left-button`, `.latest-track-wrapper:hover #right-button`, `.latest-track-wrapper:hover::after`, `.latest-track-wrapper:hover::before`, `.live-date`, `.live-item`, `.live-more`, `.live-venue`

#### CSS/artist.css
`aside`, `h2`, `h3`, `details[open] .chevron`, `#artist-hero`, `#artist-main`, `#artist-tabs`, `#btn-cancel`, `#btn-submit`, `#merch-report-modal`, `#section-cheering`, `#section-comments`, `#section-info>.date-item`, `#section-merch`, `#section-merch>.list`, `#section-ticket`, `#section-ticket .card`, `.artist-hero-bg`, `.artist-hero-overlay`, `.artist-name`, `.artist-tour-name`, `.avatar`, `.btn-new-cheer`, `.btn-new-cheer:hover`, `.capacity-bar-bg`, `.capacity-bar-fill`, `.card:hover`, `.card>.right`, `.card>p`, `.card>p>span`, `.cheer-detail`, `.cheer-detail-desc`, `.cheer-detail-desc>p`, `.cheer-detail-img img`, `.cheer-detail-info`, `.cheer-detail-meta-list`, `.cheer-detail-meta-row`, `.cheer-detail-meta-row>.meta-label`, `.cheer-detail-meta-row>.meta-value`, `.cheer-detail-top`, `.cheer-icon`, `.cheer-info`, `.cheer-map-placeholder>span`, `.cheer-title`, `.comment`, `.comment-author`, `.comment-body`, `.comment-contents`, `.comment-likes img`, `.comment-meta`, `.comment-time`, `.comment:not(:last-child)`, `.date`, `.date span`, `.date-detail`, `.date-item details[open] .card`, `.date-item summary`, `.date-item[open] summary`, `.detail-grid`, `.form-actions>.btn-submit`, `.form-actions>.btn-submit:hover`, `.form-field`, `.form-section`, `.form-section>.section-header`, `.label`, `.merch-add-card-btn`, `.merch-add-card-btn:hover`, `.merch-card-index`, `.merch-card-remove`, `.merch-card-remove:hover`, `.merch-name`, `.merch-price`, `.merch-report-card`, `.merch-report-card__fields`, `.merch-report-card__header`, `.merch-row`, `.merch-row:not(:last-child)`, `.modal-body`, `.modal-box`, `.modal-close`, `.modal-footer`, `.modal-header`, `.page-hero-content`, `.related-genre`, `.related-item`, `.related-item:hover`, `.related-list`, `.related-name`, `.rules-section>h2`, `.section-header`, `.sidebar-artist-img img`, `.sidebar-artist-info>p`, `.sidebar-artist-name`, `.sidebar-link`, `.sidebar-link:hover`, `.sidebar-link>span`, `.sidebar-stat`, `.sidebar-stat-label`, `.sidebar-stat-value`, `.sidebar-stats`, `.sidebar-tour-info`, `.sidebar-tour-info>p`, `.sort-btn`, `.sort-group>.sort-btn--active`, `.ticket-contact`, `.ticket-meta`, `.ticket-post-header`, `.ticket-type`, `.tour-meta`, `.warn-banner`, `.warn-banner>p`, `.warn-link`, `.warn-link::after`

#### CSS/review.css
`aside`, `h2`, `h3`, `section:not(#artist-hero):not(#lp-hero)`, `#artist-hero`, `#artist-main`, `#review-topbar`, `.artist-hero-bg`, `.artist-hero-overlay`, `.artist-name`, `.artist-tour-name`, `.avatar`, `.comment-bubble`, `.comment-input`, `.comment-input-row`, `.comment-input:focus`, `.comment-name`, `.comment-row`, `.comment-send`, `.comment-send:hover`, `.comment-text`, `.page-hero-content`, `.related-genre`, `.related-item`, `.related-item:hover`, `.related-list`, `.related-name`, `.review-comments`, `.review-comments__label`, `.review-comments__more`, `.review-comments__more:hover`, `.review-toolbar`, `.section-header`, `.sidebar-artist-img img`, `.sidebar-artist-info>p`, `.sidebar-artist-name`, `.sidebar-link`, `.sidebar-link:hover`, `.sidebar-link>span`, `.sidebar-stat`, `.sidebar-stat-label`, `.sidebar-stat-value`, `.sidebar-stats`, `.sidebar-tour-info`, `.sidebar-tour-info>p`

#### CSS/profile.css
`button>svg`, `#left-button`, `#left-button:hover`, `#profile-content`, `#profile-main`, `#profile-sidebar`, `#profile-tabs`, `#right-button`, `#right-button:hover`, `#section-cheering-history`, `#section-reviews`, `#section-tickets`, `.badge--ended`, `.btn-edit-profile`, `.btn-edit-profile:hover`, `.latest-track-wrapper`, `.latest-track-wrapper:hover #left-button`, `.latest-track-wrapper:hover #right-button`, `.notch`, `.notch--bottom`, `.notch--top`, `.review-card--compact .review-card__footer`, `.section-count`, `.sidebar-avatar img`, `.sidebar-join-date`, `.sidebar-profile-bio`, `.sidebar-profile-info`, `.sidebar-profile-name`, `.stub-day`, `.stub-divider`, `.stub-month`, `.stub-price`, `.stub-seat`, `.stub-year`, `.ticket-artist-name`, `.ticket-card`, `.ticket-perforation`, `.ticket-poster`, `.ticket-poster img`, `.ticket-poster-info`, `.ticket-stub`, `.ticket-tour-name`, `.ticket-track`, `.ticket-venue`

#### CSS/cheering-new.css
`#cheering-new-hero`, `#cheering-new-main`, `.btn-cancel`, `.btn-submit`, `.char-count`, `.checkbox-item`, `.cheering-new-hero-bg`, `.cheering-new-hero-overlay`, `.end-time-or`, `.end-time-row`, `.end-time-row>label`, `.form-actions`, `.form-field`, `.form-row`, `.form-section`, `.form-section__title`, `.form-section__title>svg`, `.hero-breadcrumb`, `.radio-pill`, `.upload-area`, `.upload-area>svg`

#### CSS/login.css
`.active`, `.btn-google`, `.btn-google img`, `.btn-google:hover`, `.btn-primary-login`, `.btn-primary-login:hover`, `.login-agree`, `.login-agree a`, `.login-agree input[type="checkbox"]`, `.login-agree span`, `.login-card`, `.login-divider`, `.login-divider::after`, `.login-divider::before`, `.login-divider>span`, `.login-field`, `.login-field label`, `.login-forgot`, `.login-forgot a`, `.login-heading`, `.login-logo`, `.login-page`, `.login-switch`, `.login-switch a`, `.login-tab`, `.login-tabs`

---

## 3. 死 selector（CSS 有定義，但全站 HTML 都沒用到對應 class）

依規則排除：`hidden`、`is-start`、`is-end`、`merch-card-remove`（JS 保留）。

#### CSS/list-page.css
- `.btn-new-cheer`
- `.btn-new-cheer:hover`
- `.sort-btn`
- `.sort-group>.sort-btn--active`

#### CSS/artist.css
- `.btn-new-cheer`（與 list-page.css 重複，見第 5 節）
- `.btn-new-cheer:hover`
- `.sort-btn`
- `.sort-group>.sort-btn--active`

其餘 8 個 CSS 檔（style / nav / footer / index / review / profile / cheering-new / login）**沒有**發現死 class selector。

> 註：`merch-card-remove` 出現在 `artist.css`（`.merch-card-remove`、`.merch-card-remove:hover`），雖按規則排除不列為死碼，但目前 9 個 html 都沒有任何元素帶這個 class（JS 應該是動態插入時才會加上）。重構時請保留，不要刪。

---

## 4. 孤兒 class（HTML 有用到，但全站 CSS 都找不到對應定義）

*ti / ti-\** 開頭為 Tabler Icons 外部字型 class，不計入孤兒清單（定義在 CDN，非站內 CSS 職責）。

| class | 使用頁面 |
|---|---|
| `arrow` | artist.html, profile.html |
| `back` | cheering-new.html |
| `badge-rules` | artist.html |
| `btn-write-review` | review.html |
| `checkbox-group` | cheering-new.html |
| `cheer-detail-capacity` | cheering-detail.html |
| `cheer-detail-title` | cheering-detail.html |
| `footer-copyright` | 全部 8 個非 login 頁 |
| `footer-slogan` | 全部 8 個非 login 頁 |
| `form-field--full` | cheering-detail.html, cheering-new.html |
| `form-label` | artist.html, transfer.html |
| `lp-card--merch` | transfer.html |
| `lp-card--ticket` | transfer.html |
| `merch-sizes` | artist.html |
| `merch-updated` | artist.html |
| `modal-overlay` | artist.html, transfer.html |
| `pane-login` | login.html |
| `price-zone` | transfer.html |
| `related-info` | artist.html, cheering.html, cheering-detail.html, review.html |
| `section-header__title` | artist.html, profile.html |
| `sidebar-links` | artist.html, cheering.html, cheering-detail.html, review.html, profile.html |
| `size-6` | index.html, artist.html, cheering.html, cheering-new.html, transfer.html |
| `text-muted` | cheering-detail.html |
| `upload-text` | cheering-new.html, transfer.html |
| `venue` | artist.html |
| `warn-icon` | artist.html, transfer.html |

**特別提醒**：`footer-copyright`／`footer-slogan` 是孤兒 class 裡影響範圍最大的，幾乎每頁都用到（footer 版權字與標語），目前完全沒有專屬樣式（字級、顏色都是繼承 `#LG_FOOTER` 的全域 11px），整頓 footer.css 時應該順手補上。

---

## 5. 跨檔重複定義

### 5a. 完全一致（複製貼上，可直接合併保留一份）

| selector | 出現檔案 |
|---|---|
| `#artist-hero` | artist.css, review.css |
| `#artist-main` | artist.css, review.css |
| `#btn-cancel` | list-page.css, artist.css |
| `#btn-submit` | list-page.css, artist.css |
| `.artist-hero-bg` | artist.css, review.css |
| `.artist-hero-overlay` | artist.css, review.css |
| `.artist-name` | artist.css, review.css |
| `.artist-tour-name` | artist.css, review.css |
| `.avatar` | list-page.css, artist.css, review.css（**三檔同名同內容**） |
| `.btn-new-cheer` / `:hover` | list-page.css, artist.css（兩者皆為死碼，見第 3 節） |
| `.comment-body` / `.comment-meta` / `.comment-time` / `.comment:not(:last-child)` | list-page.css, artist.css |
| `.form-field` | artist.css, cheering-new.css |
| `.modal-box` | list-page.css, artist.css |
| `.related-genre` / `.related-item` / `.related-item:hover` / `.related-list` / `.related-name` | list-page.css, artist.css, review.css（**三檔**） |
| `.section-header` | list-page.css, artist.css, review.css（**三檔**） |
| `.sidebar-artist-img img` / `.sidebar-artist-info>p` / `.sidebar-artist-name` / `.sidebar-link` / `.sidebar-link:hover` / `.sidebar-link>span` / `.sidebar-stat` / `.sidebar-stat-label` / `.sidebar-stat-value` / `.sidebar-stats` / `.sidebar-tour-info` / `.sidebar-tour-info>p` | list-page.css, artist.css, review.css（**整組側欄樣式三檔重複，10 條規則**） |
| `.sort-btn` / `.sort-group>.sort-btn--active` | list-page.css, artist.css（兩者皆為死碼） |
| `.upload-area` / `.upload-area>svg` | list-page.css, cheering-new.css |
| `.warn-banner>p` / `.warn-link` / `.warn-link::after` | list-page.css, artist.css |
| `h3` | list-page.css, artist.css, review.css |
| `aside` | artist.css, review.css |
| `section:not(#artist-hero):not(#lp-hero)` | list-page.css, review.css |
| `.latest-track-wrapper` 及其 `:hover #left-button` / `:hover #right-button` | index.css, profile.css |
| `#left-button:hover` / `#right-button:hover` | index.css, profile.css |

### 5b. 同名但內容不同（⚠️ 有實際覆蓋/衝突風險，需人工確認哪個是對的）

- **`.warn-banner`**（style.css / list-page.css / artist.css）：
  - `style.css`：設定底色/文字色/邊框（橙色 badge 配色）
  - `list-page.css`：**同檔內定義了兩次** —— 第一次 `flex-direction: column; padding: 3px 7px; margin: 10px;`，第二次（檔案後段）只設 `justify-content: center; align-items: center;`
  - `artist.css`：`flex-direction: row; align-items: stretch; justify-content: center; ...`（方向跟 list-page.css 的第一次定義相反）
  - 同時連結 `list-page.css` + `artist.css` 的頁面（artist / cheering / cheering-detail / review），最終 `flex-direction` 由**較晚連結的 `artist.css` 勝出（row）**。建議重構時統一成一份定義。
- **`.comment`**（list-page.css / artist.css）：list-page.css 只設 `display:flex; gap:12px`；artist.css 額外把它變成有底色、圓角、padding 的卡片（`.comment { background-color:...; border-radius:12px; border:1px solid...; padding:16px }`）。同時連結兩檔的頁面（artist/cheering-detail/review）留言會疊加成卡片樣式；但 `cheering.html`／`transfer.html`／`profile.html` 只連 list-page.css，沒有這個卡片效果——**視覺不一致，需確認是否為刻意設計**。
- **`#left-button` / `#right-button`**（index.css / profile.css）：版面屬性一致，但 `z-index`（90 vs 40）與 `margin-inline`（-8px vs -7px，在 `button>svg` 規則）不同，屬於微小數值落差，可在合併時統一成一個值。
- **`.modal-footer`**（list-page.css / artist.css）：artist.css 多了 `margin-top: 20px`。
- **`.page-hero-content`**（list-page.css / artist.css / review.css）：list-page.css 版本顏色寫死 `#f0eeff`，artist.css／review.css 版本用 `var(--bg-page)`（淺色主題下其實是同一個值，但寫法不一致，深色主題下會不同）。
- **`h2`**（list-page.css / artist.css / review.css）：review.css 多了 `color: var(--text-primary)`，其餘兩檔沒有設文字色。

### 5c. ID 與 class 命名衝突（不是同一個 selector，但容易混淆）

- `#btn-cancel` / `#btn-submit`（list-page.css、artist.css，以 **ID** 選取）vs `.btn-cancel` / `.btn-submit`（cheering-new.css，以 **class** 選取）——同名但選擇器類型不同，內容也幾乎相同。重構時建議統一成同一種命名方式（建議全部改 class，因為同一個按鈕在多頁出現，ID 不該重複使用）。

---

## 6. 屬性值高度重疊的規則集（可抽取共用 class 的候選）

| 重複內容 | 出現位置 | 建議 |
|---|---|---|
| `display:flex; align-items:center; justify-content:space-between` | `.review-card__header`(list-page)、`.ticket-post-header`(artist)、`.modal-header`(artist)、`.merch-report-card__header`(artist) | 抽成共用 `.flex-between` 工具 class，4 處可直接套用 |
| `align-self:flex-start; color:var(--text-secondary); display:inline-block; margin-top:5px; position:relative` + 對應的 `::after` 底線動畫 | `.more` 與 `.review-back`（皆在 style.css，幾乎逐字重複，只差底線方向 left/right） | 兩者本質是同一個「帶底線動畫的返回/更多連結」元件，可合併成一個 `.link-underline`（用 modifier 控制方向） |
| `background-image:url(../img/03-2.png); background-size:cover; ...; border-radius:20px 20px 0 0; z-index:-1` | `.lp-hero-bg`(list-page)、`.artist-hero-bg`(artist/review)、`.cheering-new-hero-bg`(cheering-new，僅 height 用 40vh 寫死而非繼承) | 同一張 hero 背景圖案被三套命名各自複製，是目前最大宗「相同元件、不同名稱」案例，強烈建議合併成一個 `.page-hero-bg` |
| 對應的漸層 overlay（`.lp-hero-overlay` / `.artist-hero-overlay` / `.cheering-new-hero-overlay`） | 同上三檔 | 同上，合併成 `.page-hero-overlay` |
| `#lp-hero` 與 `#artist-hero` 整組版面（width 95%、margin-top 70px、height 40vh...） | list-page.css / artist.css / review.css | 同一個 hero 容器版面，建議統一用 class（如 `.page-hero`）取代各頁各自的 ID 選擇器 |
| `#lp-main` 與 `#artist-main` 整組版面（三欄 grid 25/60/15%） | list-page.css / artist.css / review.css | 同上，建議統一成 `.page-main` |
| `#artist-tabs` 與 `#profile-tabs`（sticky tab nav，逐字相同） | artist.css / profile.css | 合併成 `.sticky-tabs` |
| `#latest-track`（index.css）與 `.ticket-track`（profile.css） | index.css / profile.css | profile.css 註解已自承「沿用 index.css 的滑動機制改名」——確認是同一套橫向滑動 carousel，建議真正抽成共用 class 而非複製改名 |
| `height:100%; object-fit:cover; width:100%` | `.lp-card__img>img`(list-page)、`.artist-img img`(index)、`.ticket-poster img`(profile) | 圖片填滿容器的工具樣式，可抽成 `.img-cover` |
| `#lp-topbar`（list-page）與 `#review-topbar`（review） | 同上 | 建議統一用 `.lp-topbar` class，不要各頁重開 ID |

---

## 7. 現有 selector 對應目標架構的歸屬建議

目標分層：`style.css`（全站共用，含目前的 nav.css + footer.css）、`list-page.css`（非 index 頁共用）、各頁 `[page].css`。

### [style] 全站共用 —— 建議內容
- `style.css` 現有全部規則（已正確歸位）
- `nav.css` 全部規則（`#LG_NAV`、`.nav-*`、`#back-to-top` 系列）→ 併入 style.css
- `footer.css` 全部規則（`#LG_FOOTER`、`.footer-*`）→ 併入 style.css，**順手補上 `.footer-copyright` / `.footer-slogan` 的樣式（目前孤兒，見第 4 節）**
- `index.css` 的 `.hidden`（目前在 index.css，但是個通用顯示/隱藏工具 class，且只有 index.html 連結 index.css——若其他頁的 JS 之後也要用 `.hidden` 切換顯示，現在會失效，建議搬到 style.css）
- `list-page.css` 的 `h2` / `h3` / `label`（純元素重置，目前在 list-page.css/artist.css/review.css 三檔重複，建議升級成全站 reset，搬進 style.css，這樣 index.html 也能拿到一致的標題樣式）

### [list-page] 非 index 頁共用 —— 建議內容
保留在 list-page.css，並把目前散落在 `artist.css` / `review.css` 裡的**重複版本刪除**（第 5a 節列出的三檔重複群組，全部以 list-page.css 為唯一來源）：
- hero／main 殼層：`#lp-hero`、`.lp-hero-bg`、`.lp-hero-overlay`、`#lp-main`、`#lp-sidebar`、`#lp-content`、`#lp-topbar`、`.lp-header`、`.lp-toolbar`、`.page-hero-*`
- 卡片：`.lp-card` 全家族
- 側欄：`.sidebar-artist-*`、`.sidebar-link*`、`.sidebar-stat*`、`.sidebar-tour-info*`、`.related-*`
- 留言基礎：`.avatar`、`.comment`、`.comment-body`、`.comment-meta`、`.comment-time`
- 心得卡片基礎：`.review-card*`、`.review-author`、`.review-meta`、`.review-time`、`.review-read-more`、`.review-count`、`.review-sort`、`.review-img-*`、`.badge--review-type*`（review.html 與 profile.html 共用）
- modal 基礎：`.modal-box`、`.modal-footer`、`#btn-cancel`、`#btn-submit`（建議統一成 class）
- `.section-header`、`.tab-item`、`.ti`、`.upload-area`（與 cheering-new.css 重複，見下）
- `.warn-banner` / `.warn-link`（先解掉第 5b 節提到的方向衝突後再保留一份）

**建議從 list-page.css 移出、改放到專屬頁面 CSS（目前錯放在共用層，實際只有 transfer.html 用到）：**
`.filter-bar`、`.filter-btn*`、`.filter-group`、`.filter-label`、`.price-list`、`.price-row`、`.price-value`（並補上孤兒 `.price-zone`）、`.safety-*`、`.row2`、`.contact-group`、`.divider`、`.lp-contact__*`、`.sidebar-price-ref`、`.sidebar-safety*` → 全部移到新建的 `transfer.css`

**建議刪除（死碼，見第 3 節）：** `.btn-new-cheer`、`.btn-new-cheer:hover`、`.sort-btn`、`.sort-group>.sort-btn--active`

### [page:index]
`index.css` 現有內容已經正確隔離良好，維持原樣即可（`#LG_HERO`、`#LG_ABOUT`、`#LG_LATEST`、`.about-*`、`.artist-card` 首頁卡片家族、`.live-*`、`#left-button`/`#right-button` 首頁版）。

### [page:artist]
保留：`#artist-hero`、`#artist-main`、`#artist-tabs`、`.artist-hero-bg/overlay`、`.artist-name`、`.artist-tour-name`（与 review.css 重複版本擇一刪除，建議改用 list-page 的 `.page-hero-*` 系統，從根本上不要再用 artist 專屬命名）、`#section-*` 系列、`.tour-meta`、`.date*`、`.detail-grid`、`.rules-section*`、`.cheer-icon/info/title`（artist 頁的應援活動卡片，跟 cheering-detail 的 `.cheer-detail-*` 是不同元件）、`.merch-*`、`.ticket-post-header/type/meta/contact`、`#merch-report-modal` 與其內部 `.merch-report-card*`、`.merch-add-card-btn`、`.modal-header`、`.modal-close`、`.modal-body`、`.comment-author`、`.comment-contents`（⚠️ 這兩個其實只被 cheering-detail.html 用到，artist.html 沒用，建議搬去新建的 `cheering-detail.css`）

### [page:cheering]
目前無專屬 CSS（完全依賴 list-page.css），保持現狀即可，不需新建 cheering.css。

### [page:cheering-detail]（建議新建 cheering-detail.css）
從 artist.css 搬出：`.capacity-bar-bg`、`.capacity-bar-fill`、`.cheer-detail-top`、`.cheer-detail-info`、`.cheer-detail-meta-list`、`.cheer-detail-meta-row*`、`.cheer-detail-desc*`、`.cheer-detail-img img`、`.cheer-map-placeholder>span`、`.comment-author`、`.comment-contents`、`.form-section`（注意此規則目前與 cheering-new.css 的 `.form-section` 同名不同內容，需要分清楚是否該共用）。並補上孤兒 class：`.cheer-detail-capacity`、`.cheer-detail-title`、`.form-field--full`、`.text-muted`。

### [page:cheering-new]
保留 `cheering-new.css` 現有大部分內容；但 `.btn-cancel`/`.btn-submit`/`.form-field`/`.form-section`/`.upload-area` 與其他檔重複（見第 5 節），建議改吃 list-page 共用版本，cheering-new.css 只留 `#cheering-new-hero*`、`.hero-breadcrumb`、`.form-row`、`.checkbox-item`、`.end-time-*`、`.char-count`、`.form-section__title*`、`.radio-pill`（與 cheering-detail.html 共用，建議搬到 list-page 或共用）。

### [page:transfer]（建議新建 transfer.css）
見上方「從 list-page.css 移出」清單，全部歸入此檔，並補上孤兒 `.price-zone`、`.form-label`、`.upload-text`、`.warn-icon`、`.modal-overlay`、`lp-card--ticket`/`lp-card--merch` 修飾類。

### [page:review]
保留 `review.css` 現有的 `#review-topbar`、`.review-toolbar`、`.comment-bubble/input/send`、`.review-comments*`；**刪除**完全沒用到的複製貼上區塊：`#artist-hero`、`#artist-main`、`.artist-hero-bg`、`.artist-hero-overlay`、`.artist-name`、`.artist-tour-name`、`.page-hero-content`、`.section-header`、`.sidebar-*`、`.related-*`、`.avatar`、`aside`、`h2`、`h3`（這些 review.html 實際上吃的是 list-page.css 裡的同名規則，review.css 里的版本是死重複，留著只會增加維護負擔）。

### [page:profile]
`profile.css` 現有內容已隔離良好（`#profile-*`、`.ticket-card` 票卡家族、`.notch*`、`.stub-*`、`.badge--ended`、`.section-count`、`.sidebar-avatar/profile-*`），維持原樣。`#left-button`/`#right-button`/`.latest-track-wrapper`/`button>svg` 與 index.css 重複（見第 6 節 carousel 機制建議抽成共用），可考慮抽到 style.css 或 list-page.css 作為共用 `.scroll-track` 元件。

### [page:login]
`login.css` 現有內容已完全隔離，維持原樣。

---

## 暫存腳本

審計過程中用到的 3 個臨時 Perl 腳本已執行完並刪除，未留下任何專案外檔案；本檔案是唯一輸出。

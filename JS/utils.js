(function () {
    const saved = localStorage.getItem('lg-theme');
    if (saved === 'dark') {
        document.body.classList.remove('theme-light');
    } else {
        document.body.classList.add('theme-light');
    }
})();

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const isLight = document.body.classList.contains('theme-light');
    toggle.setAttribute('aria-checked', String(isLight));

    toggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('theme-light');
        toggle.setAttribute('aria-checked', String(isLight));
        localStorage.setItem('lg-theme', isLight ? 'light' : 'dark');
    });
}

initThemeToggle();

// 觀察尺寸

document.querySelectorAll('*').forEach(el => {
    if (el.offsetWidth > document.documentElement.offsetWidth) {
        console.log(el.className || el.tagName, el.offsetWidth);
    }
});
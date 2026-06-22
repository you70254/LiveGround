// 讓藝人卡片可以移動
const track = document.getElementById('latest-track');
const leftBtn = document.getElementById('left-button');
const rightBtn = document.getElementById('right-button');
const wrapper = document.querySelector('.latest-track-wrapper');
let position = 0;
let cardWidth = 246;
const cards = document.querySelectorAll('.artist-card');
let maxScroll = track.scrollWidth - wrapper.offsetWidth;

checkBtn();

rightBtn.addEventListener('click', function () {
    position -= (cardWidth);
    track.style.transform = `translateX(${position}px)`;
    checkBtn();
})
leftBtn.addEventListener('click', function () {
    position += (cardWidth);
    track.style.transform = `translateX(${position}px)`;
    checkBtn();
});

function checkBtn() {
    if (position === 0) {
        leftBtn.classList.add('hidden');
        wrapper.classList.add('is-start');
    } else {
        leftBtn.classList.remove('hidden');
        wrapper.classList.remove('is-start');
    }

    if (position <= -maxScroll) {
        rightBtn.classList.add('hidden');
        wrapper.classList.add('is-end');
    } else {
        rightBtn.classList.remove('hidden');
        wrapper.classList.remove('is-end');
    }
}
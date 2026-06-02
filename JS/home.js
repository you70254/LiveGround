// 讓藝人卡片可以移動
let track = document.getElementById('latest-track');
let leftBtn = document.getElementById('left-button');
let rightBtn = document.getElementById('right-button');
let wrapper = document.querySelector('.latest-track-wrapper');
let position = 0;
let cardWidth = 246;
let cards = document.querySelectorAll('.artist-card');
let maxScroll = (cards.length - 1) * cardWidth;

checkBtn();

rightBtn.addEventListener('click', function () {
    position -= (cardWidth * 3);
    track.style.transform = `translateX(${position}px)`;
    checkBtn();
})
leftBtn.addEventListener('click', function () {
    position += (cardWidth * 3);
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
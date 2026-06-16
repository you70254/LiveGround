const btnOpen = document.getElementById('btn-open-merch-modal');
const reportModal = document.getElementById('merch-report-modal');
const btnCancel = document.getElementById('btn-cancel');

btnOpen.addEventListener('click', () => {
    reportModal.style.display = "block";
});

btnCancel.addEventListener('click', () => {
    reportModal.style.display = "none";
});

reportModal.addEventListener('click', (a) => {
    // console.log(a.target);
    if (a.target === reportModal) {
        reportModal.style.display = 'none';
    }
});
const btnOpen = document.getElementById('btn-open-modal');
const transferModal = document.getElementById('transfer-modal');
const btnCancel = document.getElementById('btn-cancel');


btnOpen.addEventListener('click', () => {
    transferModal.style.display = "block";
});

btnCancel.addEventListener('click', () => {
    transferModal.style.display = "none";
});

transferModal.addEventListener('click', (a) => {
    // console.log(a.target);
    if (a.target === transferModal) {
        transferModal.style.display = 'none';
    }
});

document.querySelectorAll('input[name="ticket-type"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const isTicket = this.value === 'offer' || this.value === 'want';
        document.getElementById('form-ticket').style.display = isTicket ? 'block' : 'none';
        document.getElementById('form-merch').style.display = isTicket ? 'none' : 'block';
    });
});
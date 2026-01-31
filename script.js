document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.btn--subjects .btn');
    const cards = document.querySelectorAll('.tutor-card');
    const grid = document.querySelector('.grid-tutors');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    const overlay = document.getElementById('modal-overlay');
    const timeSlotsContainer = document.getElementById('time-slots');
    const dateInput = document.getElementById('booking-date');
    const bookingForm = document.getElementById('order-form');
    const submitBtn = document.getElementById('submit-booking');
    let selectedTime = null;

    const allTimeSlots = ['15:00', '16:00', '17:00', '18:00', '19:30'];
    const busySlots = {
        '2026-02-01': ['15:00', '16:00', '17:00', '18:00'],
        '2026-02-02': ['18:00', '19:30'],
        '2026-02-03': ['15:00', '16:00','17:00', '18:00', '19:30'],
        '2026-02-04': ['15:00', '19:30'],
        '2026-02-05': [],
        '2026-02-06': ['17:00'],
        '2026-02-07': ['15:00', '16:00', '17:00', '18:00', '19:30'],
        '2026-02-08': ['15:00', '16:00',]
    };
    
    /*фильтрация*/
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cardSubject = card.getAttribute('data-subject');
                
                if (filterValue === 'all' || filterValue === cardSubject) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            grid.scrollLeft = 0;
        });
    });

    /*слайдер*/
    if (grid && nextBtn && prevBtn) {
        const getScrollStep = () => {
            const card = document.querySelector('.tutor-card');
            if (!card) return 0;
            return card.getBoundingClientRect().width + 30; 
        };

        nextBtn.addEventListener('click', () => {
            grid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            grid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });
    }

    /*модальное окно*/
    /*открытие формы*/
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tutorName = e.target.closest('.tutor-card').querySelector('h3').innerText;
            document.getElementById('modal-title').innerText = `Запись к ${tutorName}`;
            overlay.style.display = 'flex';
        });
    });

    /*закрытие формы*/
    document.querySelectorAll('.close-modal, .close-btn-final').forEach(btn => {
        btn.onclick = () => {
            document.getElementById('modal-overlay').style.display = 'none';
            resetForm();
        };
    });

    dateInput.addEventListener('change', () => {
        const date = dateInput.value;
        const busyOnThisDate = busySlots[date] || [];
        timeSlotsContainer.innerHTML = ''; 
        selectedTime = null;
        checkFormValidity();

        allTimeSlots.forEach(time => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerText = time;
            btn.classList.add('time-slot');
            
            if (busyOnThisDate.includes(time)) {
                btn.classList.add('busy');
                btn.disabled = true;
            } else {
                btn.onclick = () => {
                    document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedTime = time;
                    checkFormValidity();
                };
            }
            timeSlotsContainer.appendChild(btn);
        });
    });

    /*валидация формы*/
    function checkFormValidity() {
        const name = document.getElementById('user-name').value.trim();
        const contact = document.getElementById('user-contact').value.trim();
        const submitBtn = document.getElementById('submit-booking');
        console.log("Время выбрано:", selectedTime);    
        const isNameValid = name.length >= 2;
        const isContactValid = contact.length >= 5;
        const isTimeSelected = selectedTime !== null;

        submitBtn.disabled = !(isNameValid && isContactValid && isTimeSelected);
    }

    bookingForm.addEventListener('input', checkFormValidity);
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.innerText = "Отправка...";
        submitBtn.disabled = true;
        
        setTimeout(() => {
            document.getElementById('booking-step').style.display = 'none';
            document.getElementById('success-step').style.display = 'block';
            document.getElementById('success-message').innerText = 
                `Вы записаны на ${dateInput.value} в ${selectedTime}`;
        }, 1500);
    });

    function resetForm() {
        bookingForm.reset();
        document.getElementById('booking-step').style.display = 'block';
        document.getElementById('success-step').style.display = 'none';
        timeSlotsContainer.innerHTML = '';
        selectedTime = null;
        submitBtn.innerText = "Записаться";
    }
});
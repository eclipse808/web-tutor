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

    const durationBtns = document.querySelectorAll('.duration-btn');
    const priceDisplay = document.getElementById('current-price');
    let selectedPrice = 1500;        

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
    
    durationBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            durationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            selectedPrice = btn.getAttribute('data-price');
            priceDisplay.innerText = selectedPrice;
        });
    });

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
    const nameInput = document.getElementById('user-name');
    const contactInput = document.getElementById('user-contact');
    const nameError = document.getElementById('name-error');
    const contactError = document.getElementById('contact-error');
    
    const nameValue = nameInput.value.trim();
    const contactValue = contactInput.value.trim();

    // валидация имени: только буквы, минимум 2 символа 
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
    let isNameValid = false;

    if (nameValue.length === 0) {
        nameError.innerText = "";
        nameInput.classList.remove('invalid');
    } else if (nameValue.length < 2) {
        nameError.innerText = "Минимум 2 символа";
        nameInput.classList.add('invalid');
    } else if (!nameRegex.test(nameValue)) {
        nameError.innerText = "Только буквы";
        nameInput.classList.add('invalid');
    } else {
        nameError.innerText = "";
        nameInput.classList.remove('invalid');
        isNameValid = true;
    }
    // валидация контакта: @ для почты или цифры для телефона
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    let isContactValid = false;

    if (contactValue.length === 0) {
        contactError.innerText = "";
        contactInput.classList.remove('invalid');
    } else if (emailRegex.test(contactValue) || phoneRegex.test(contactValue)) {
        contactError.innerText = "";
        contactInput.classList.remove('invalid');
        isContactValid = true;
    } else {
        contactError.innerText = "Введите корректный email или телефон";
        contactInput.classList.add('invalid');
    }

    const isTimeSelected = selectedTime !== null;
    submitBtn.disabled = !(isNameValid && isContactValid && isTimeSelected);
    }

    bookingForm.addEventListener('input', checkFormValidity);
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // данные о записи
        const tutorName = document.getElementById('modal-title').innerText.replace('Запись к ', '');
        const activeDuration = document.querySelector('.duration-btn.active').innerText;
        const currentPrice = document.getElementById('current-price').innerText;

        // логика уведомлений
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                sendNotification(tutorName, selectedTime);
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        sendNotification(tutorName, selectedTime);
                    }
                });
            }
        }

        //сохранение в localstorage
        const newBooking = {
            id: Date.now(),
            tutor: tutorName,
            date: dateInput.value,
            time: selectedTime,
            duration: activeDuration,
            price: currentPrice,
            userName: document.getElementById('user-name').value
        };
        const allBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
        allBookings.push(newBooking);
        localStorage.setItem('myBookings', JSON.stringify(allBookings));

        submitBtn.innerText = "Отправка...";
        submitBtn.disabled = true;

        setTimeout(() => {
            document.getElementById('booking-step').style.display = 'none';
            document.getElementById('success-step').style.display = 'block';
            document.getElementById('success-message').innerText = 
                `Вы записаны на ${dateInput.value} в ${selectedTime} (${activeDuration})`;
        }, 1500);
    });

    //уведомление notification
    function sendNotification(name, time) {
        new Notification("Успешная запись!", {
            body: `Репетитор: ${name}\nВремя: ${time}`,
            icon: "img/icon.png"
        });
    }

    function resetForm() {
        bookingForm.reset();
        document.getElementById('booking-step').style.display = 'block';
        document.getElementById('success-step').style.display = 'none';
        timeSlotsContainer.innerHTML = '';
        selectedTime = null;
        submitBtn.innerText = "Записаться";
    }
});
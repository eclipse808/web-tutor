document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('bookings-list');
    const noRecordsMsg = document.getElementById('no-records');
    const bookings = JSON.parse(localStorage.getItem('myBookings')) || []; //загрузка данных из localstorage

    if (bookings.length > 0) {
        noRecordsMsg.style.display = 'none';

        bookings.forEach(book => {
            const card = document.createElement('div');
            card.className = 'record-card';
            
            //создание карточки на основе данных
            card.innerHTML = `
                <div class="record-side-panel">
                    <span>✎</span> </div>
                <div class="record-body">
                    <p style="font-size: 0.8rem; color: #a29bfe; margin: 0;">Репетитор:</p>
                    <h3>${book.tutor}</h3>
                    <div class="record-details">
                        <p class="record-info-item">Дата: ${book.date}</p>
                        <p class="record-info-item">Длительность: ${book.duration}</p>
                        <p class="record-info-item">Стоимость: ${book.price} ₽</p>
                    </div>
                    <button class="btn-cancel" onclick="deleteBooking(${book.id})">Отменить запись</button>
                </div>
            `;
            listContainer.appendChild(card);
        });
    }
});

//удаление записи из localstorage+обновление интрерфейса
function deleteBooking(id) {
    if (confirm('Удалить эту запись?')) {
        let bookings = JSON.parse(localStorage.getItem('myBookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('myBookings', JSON.stringify(bookings));
        location.reload();
    }
}
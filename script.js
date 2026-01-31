document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.btn--subjects .btn');
    const cards = document.querySelectorAll('.tutor-card');
    const grid = document.querySelector('.grid-tutors');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

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
});
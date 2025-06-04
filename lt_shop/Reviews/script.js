document.addEventListener('DOMContentLoaded', function() {
    
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('reviewRating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            ratingInput.value = value;
            
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= value);
            });
        });
    });
    
   
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
           
            alert('Спасибо за ваш отзыв! После модерации он будет опубликован.');
            this.reset();
            
            
            stars.forEach((star, index) => {
                star.classList.toggle('active', index === 0);
            });
            ratingInput.value = 5;
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            
            tabBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
    
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            
            alert('Вход выполнен успешно!');
            
            
            document.querySelector('[data-tab="profile"]').style.display = 'block';
            document.querySelector('[data-tab="orders"]').style.display = 'block';
            document.querySelector('[data-tab="login"]').style.display = 'none';
            document.querySelector('[data-tab="register"]').style.display = 'none';
            
            
            document.querySelector('[data-tab="profile"]').click();
        });
    }
    
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Регистрация прошла успешно! Выполнен вход.');
            
            
            document.querySelector('[data-tab="profile"]').style.display = 'block';
            document.querySelector('[data-tab="orders"]').style.display = 'block';
            document.querySelector('[data-tab="login"]').style.display = 'none';
            document.querySelector('[data-tab="register"]').style.display = 'none';
            
            
            document.querySelector('[data-tab="profile"]').click();
        });
    }
    
    
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            
            alert('Вы вышли из аккаунта');
            
            
            document.querySelector('[data-tab="profile"]').style.display = 'none';
            document.querySelector('[data-tab="orders"]').style.display = 'none';
            document.querySelector('[data-tab="login"]').style.display = 'block';
            document.querySelector('[data-tab="register"]').style.display = 'block';
            
            
            document.querySelector('[data-tab="login"]').click();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() { 
    let header = document.querySelector('header');
    let width = window.innerWidth;
    if (width < 650) {
        header.style.backgroundImage = "url('css/img/Header_Photo/B (1)_small.jpg')";
        header.style.backgroundSize = "cover";
    }

    let GoToMainPage = document.querySelector('.go-back-to-main');
    
    GoToMainPage.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
});

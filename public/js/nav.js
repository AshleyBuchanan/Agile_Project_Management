const userButton = document.querySelector('#logged-user');
const userInfo = document.querySelector('.nav-user-info');
userButton.innerText = window.localStorage.getItem('loggedUser');
userButton.addEventListener('click', (e) => {
    const timer = 500;
    if (userInfo.classList.contains('show')) {
        userInfo.classList.remove('show');
        setTimeout(() => {
            userInfo.classList.remove('display');
        }, timer);
    } else {
        userInfo.classList.add('show');
        userInfo.classList.add('display');
    }

});
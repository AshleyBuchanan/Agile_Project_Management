function getCurrentUser() {
    const currentUser = window.localStorage.getItem('loggedUser');
    const currentEmail = window.localStorage.getItem('loggedEmail');
    if (currentUser && currentEmail) return { currentUser, currentEmail };
    window.location.href = '/login';
}
function logout(userId) {
    console.log(`logout(${userId})`);

    window.localStorage.removeItem('logged_uid');
    window.localStorage.removeItem('loggedUser');
    window.localStorage.removeItem('loggedEmail');
    window.location.href = '/login';

}
function logoutRequest(userId) {
    console.log(`logoutRequest(${userId})`);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/logout', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const { response } = JSON.parse(xhr.responseText);
            if (response === 'true') logout(userId);
            if (response === 'false') no_logout(userId);
        } else {
            console.error('Something went wrong:', xhr.status);
        }
    };

    xhr.send(JSON.stringify({ userId }));
}

const userButton = document.querySelector('#logged-user');
const userInfo = document.querySelector('.nav-user-info');
const userEmail = document.querySelector('.nav-user-info-profile-email');
const userName = document.querySelector('.nav-user-info-profile-name');
const { currentUser, currentEmail } = getCurrentUser(); // <- login writes who to localStorage at login success.

userEmail.innerText = currentEmail;
userName.innerText = `- ${currentUser} -`;
userButton.innerText = currentUser.split(' ')[0];   // <- only use first name here
userButton.addEventListener('click', e => {
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
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', e => {
    console.log('logoutButton clicked');
    const userId = window.localStorage.getItem('logged_uid');
    console.log('userId:', userId);
    if (userId) logoutRequest(userId);
});
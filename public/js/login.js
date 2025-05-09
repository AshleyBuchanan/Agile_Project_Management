const body = document.querySelector('.main-container');
setTimeout(() => {
    body.style.opacity = 1;
}, 500);

//email
const _email = document.querySelector('#email');
//password
const _password = document.querySelector('#password');
//all buttons
const _bottom = document.querySelector('.bottom');
//login button (for disabling/enabling)
const _login = document.querySelector('#login-button');
//badCredentials
const badCredentials = document.querySelector('.welcome-bottom');
//extension array
const commonEmailExtensions = [
    // General-purpose TLDs
    '.com',
    '.net',
    '.org',
    '.edu',
    '.gov',
    '.co',
    '.us',
    '.info',
    '.biz',
    '.io',

    // Country-code TLDs (ccTLDs)
    '.uk',
    '.ca',
    '.au',
    '.de',
    '.fr',
    '.jp',
    '.in',
    '.cn',
    '.br',
    '.mx',
    '.it',
    '.es',
    '.ru',
    '.nl',
    '.ch',
    '.se',
    '.no',

    // Tech & niche domains
    '.me',
    '.dev',
    '.app',
    '.tech',
    '.email',
    '.cloud',
    '.xyz',
    '.site',
    '.online',
    '.company',
    '.live'
];
//regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

//using this to auto redirect if already logged in
function getCurrentUser() {
    const currentUser = window.localStorage.getItem('loggedUser');
    const currentEmail = window.localStorage.getItem('loggedEmail');
    if (currentUser && currentEmail) window.location.href = '/tasks';
}
getCurrentUser();

function validEmail() {
    return (
        _email.value.includes('@') &&
        commonEmailExtensions.some(ext => _email.value.endsWith(ext)) &&
        _email.value.length >= 5
    );
}

function validPassword() {
    return passwordRegex.test(_password.value);
}

function unauthorized() {
    badCredentials.classList.add('show');
}

function authorized(name, id, email) {
    console.log(name, id, email);
    window.localStorage.setItem('loggedUser', name);
    window.localStorage.setItem('logged_uid', id);
    window.localStorage.setItem('loggedEmail', email);
    fadeOut('/tasks');
}

function loginRequest() {
    console.log('in');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const { response, username, user_id, user_email } = JSON.parse(xhr.responseText);
            if (response === 'true') authorized(username, user_id, user_email);
            if (response === 'false') unauthorized();
        } else {
            console.error('Something went wrong:', xhr.status);
        }
    };

    xhr.send(JSON.stringify({ email: _email.value, password: _password.value }));
}

function fadeOut(href) {
    body.style.opacity = 0;
    setTimeout(() => {
        if (href) window.location.href = href;
    }, 250);
}

//initial check for pre-populated email
if (validEmail() === true) {
    _login.classList.remove('disabled');
}

_email.addEventListener('input', e => {
    badCredentials.classList.remove('show');
    if (validEmail() === true && validPassword() === true) {
        _login.classList.remove('disabled');
    } else {
        _login.classList.add('disabled');
    }
});

_password.addEventListener('input', e => {
    badCredentials.classList.remove('show');
    if (validEmail() === true && validPassword() === true) {
        _login.classList.remove('disabled');
    } else {
        _login.classList.add('disabled');
    }
});

//three buttons in the bottom div (delegate)
_bottom.addEventListener('mouseover', e => {
    if (e.target.classList.contains('form-button') &&
        (!e.target.classList.contains('disabled'))) {
        e.target.classList.add('hovered');
    }
});
_bottom.addEventListener('mouseout', e => {
    if (e.target.classList.contains('form-button') &&
        (!e.target.classList.contains('disabled'))) {
        e.target.classList.remove('hovered');
    }
});
_bottom.addEventListener('mousedown', e => {
    e.target.classList.add('pressed');
});
_bottom.addEventListener('mouseup', e => {
    e.target.classList.remove('pressed');

    if (e.target.id === 'login-button' &&
        (!e.target.classList.contains('disabled'))) {
        loginRequest();
    }
    if (e.target.id === 'create-button') {
        fadeOut('/create');
    }
});

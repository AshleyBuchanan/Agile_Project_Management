//email
const _email = document.querySelector('#email');
//password
const _password = document.querySelector('#password');
//login
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

function authorized(name, id) {
    window.localStorage.setItem('loggedUser', name);
    window.localStorage.setItem('logged_uid', id);
    window.location.href = '/tasks';
}

function loginRequest() {
    console.log('in');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const { response, username, _id } = JSON.parse(xhr.responseText);
            if (response === 'true') authorized(username, _id);
            if (response === 'false') unauthorized();
        } else {
            console.error('Something went wrong:', xhr.status);
        }
    };

    xhr.send(JSON.stringify({ email: _email.value, password: _password.value }));
}

//initial check for pre-populated email
if (validEmail() === true) {
    _login.classList.remove('disabled');
}

_login.addEventListener('click', (e) => {
    if (!_login.classList.contains('disabled')) loginRequest();
});

_email.addEventListener('input', (e) => {
    badCredentials.classList.remove('show');
    if (validEmail() === true && validPassword() === true) {
        _login.classList.remove('disabled');
    } else {
        _login.classList.add('disabled');
    }
});
_password.addEventListener('input', (e) => {
    badCredentials.classList.remove('show');
    if (validEmail() === true && validPassword() === true) {
        _login.classList.remove('disabled');
    } else {
        _login.classList.add('disabled');
    }
});

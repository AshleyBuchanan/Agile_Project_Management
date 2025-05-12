//fade in
const body = document.querySelector('.main-container');
setTimeout(() => {
    body.style.opacity = 1;
}, 500);

//extensions
const commonEmailExtensions = [
    // General-purpose TLDs
    '.com',
    '.net',
    '.org',
    '.edu',
    '.gov',
    // '.co', //<- this one bothers me
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

//network switch to prevent excessive calls to the server
let emailChecked = false;

//inputs
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

const jobTitle = document.querySelector('#job-title');
const department = document.querySelector('#department');
const organization = document.querySelector('#organization');

const welcomeAboard = document.querySelector('.welcome-aboard');
const finished = document.querySelector('.finished');
const finishedButton = document.querySelector('#finished-button');

const emailTaken = document.querySelector('.embedded-email');
const emailCheck = document.querySelector('#email-check');
const nameTaken = document.querySelector('.embedded-name');
const usernamesStr = document.querySelector('#hidden-data').innerText;
const usernames = new Set(usernamesStr.split(',').map(item => item.trim()));

//name reserved check
nameInput.addEventListener('input', e => {
    if (usernames.has(nameInput.value)) {
        nameTaken.classList.add('show');
    } else {
        nameTaken.classList.remove('show');
    }
});

function toggleFinishedState() {
    if (validEmail() === true && validPassword() === true && !emailTaken.classList.contains('show')) {
        finished.classList.remove('disabled');
        finishedButton.style.cursor = 'pointer';
        welcomeAboard.classList.add('disabled');
    } else {
        finished.classList.add('disabled');
        finishedButton.style.cursor = 'default';
        welcomeAboard.classList.remove('disabled');
    }
}

function uniquenessCheck() {
    console.log('checking', emailInput.value);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/uniquenessCheck', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const { foundEmail: response } = JSON.parse(xhr.responseText);
            emailChecked = true;

            if (response === true) {
                emailTaken.classList.add('show');
                emailCheck.classList.remove('show');
            } else {
                emailTaken.classList.remove('show');
                emailCheck.classList.add('show');
            }
            toggleFinishedState();
        } else {
            console.error('Something went wrong:', xhr.status);
        }
    };
    email = emailInput.value;
    xhr.send(JSON.stringify({ email }));
}

function sendCreateRequest() {
    console.log('sending', emailInput.value);

    const name = nameInput.value;
    const email = emailInput.value;
    const job = jobTitle.value;
    const dept = department.value;
    const org = organization.value;
    const pass = passwordInput.value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const { response, user_id } = JSON.parse(xhr.responseText);
            if (response === true) {

                window.localStorage.setItem('loggedEmail', email);
                window.localStorage.setItem('loggedUser', name);
                window.localStorage.setItem('logged_uid', user_id);
                window.location.href = '/tasks';
            }

            if (response === false) alert('something went wrong');
        } else {
            console.error('Something went wrong:', xhr.status);
        }
    };

    xhr.send(JSON.stringify({ name, email, job, dept, org, pass }));
}

function validEmail() {
    if (
        emailInput.value.includes('@') &&
        commonEmailExtensions.some(ext => emailInput.value.endsWith(ext)) &&
        emailInput.value.length >= 5
    ) {
        if (emailChecked === false) uniquenessCheck(); return true;
    }
}

function updatePasswordHints() {
    const val = passwordInput.value;

    const numberHint = document.querySelector('#a-number');
    const capitalHint = document.querySelector('#a-capital');
    const symbolHint = document.querySelector('#a-symbol');
    const lengthHint = document.querySelector('#a-length');
    const passwordCheck = document.querySelector('#password-check');

    if (/\d/.test(val)) numberHint.classList.add('highlighted');
    else numberHint.classList.remove('highlighted');

    if (/[A-Z]/.test(val)) capitalHint.classList.add('highlighted');
    else capitalHint.classList.remove('highlighted');

    if (/[\W_]/.test(val)) symbolHint.classList.add('highlighted');
    else symbolHint.classList.remove('highlighted');

    if (val.length >= 8) lengthHint.classList.add('highlighted');
    else lengthHint.classList.remove('highlighted');

    if (validPassword() === true) passwordCheck.classList.add('show');
    else passwordCheck.classList.remove('show');
}

function validPassword() {
    return passwordRegex.test(passwordInput.value);
}

emailInput.addEventListener('input', () => {
    emailCheck.classList.remove('show');
    emailTaken.classList.remove('show');    // reset when user modifies email
    emailChecked = false;
    //validEmail();                           // kicks off uniquenessCheck
    toggleFinishedState();
});

passwordInput.addEventListener('input', () => {
    updatePasswordHints();
    toggleFinishedState();
});

finishedButton.addEventListener('mouseover', () => {
    finishedButton.classList.add('hovered');
});
finishedButton.addEventListener('mouseout', () => {
    finishedButton.classList.remove('hovered');
});
finishedButton.addEventListener('click', () => {
    sendCreateRequest();
});


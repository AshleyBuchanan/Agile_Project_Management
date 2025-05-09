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

const alreadyTaken = document.querySelector('.embedded-red');
const usernamesStr = document.querySelector('#hidden-data').innerText;
const usernames = new Set(usernamesStr.split(',').map(item => item.trim()));

//name reserved check
nameInput.addEventListener('input', e => {
    if (usernames.has(nameInput.value)) {
        alreadyTaken.classList.add('show');
    } else {
        alreadyTaken.classList.remove('show');
    }
});

function validEmail() {
    return (
        emailInput.value.includes('@') &&
        commonEmailExtensions.some(ext => emailInput.value.endsWith(ext)) &&
        emailInput.value.length >= 5
    );
}

function validPassword() {
    return passwordRegex.test(passwordInput.value);
}

emailInput.addEventListener('input', e => {
    if (validEmail() === true && validPassword() === true) {
        finished.classList.remove('disabled');
        welcomeAboard.classList.add('disabled');
    } else {
        finished.classList.add('disabled');
        welcomeAboard.classList.remove('disabled');
    }
});

passwordInput.addEventListener('input', e => {
    if (validEmail() === true && validPassword() === true) {
        finished.classList.remove('disabled');
        welcomeAboard.classList.add('disabled');
    } else {
        finished.classList.add('disabled');
        welcomeAboard.classList.remove('disabled');
    }
});

finishedButton.addEventListener('mouseover', e => {
    finishedButton.classList.add('hovered');
});
finishedButton.addEventListener('mouseout', e => {
    finishedButton.classList.remove('hovered');
});


const panels = document.querySelectorAll('.panel');

const xhr = new XMLHttpRequest();
xhr.open('POST', '/tickets', true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function () {
    if (xhr.status === 200) {
        const userData = JSON.parse(xhr.responseText);
        console.log('User Data:', userData);
    } else {
        console.error('Something went wrong:', xhr.status);
    }
};

const userNames = { names: ['Jasdeep'] };
xhr.send(JSON.stringify(userNames));
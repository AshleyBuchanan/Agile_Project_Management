let myFilterSet = new Set();
// myFilterSet.add(

//     'Jasdeep',
//     'Vinita',
//     'Praveen',
//     'Nivas',
//     'Josh Cantero',
//     'Ryan',
//     'Sidd'


// );

const panels = document.querySelectorAll('.panel');
const shortcuts = document.querySelector('.top-level-2');
shortcuts.addEventListener('click', (event) => {
    if (event.target.classList.contains('bubble-long')) {
        event.target.classList.toggle('bubble-long-active');

        if (event.target.classList.contains('bubble-long-active')) {
            myFilterSet.add(event.target.innerText);
        } else {
            myFilterSet.delete(event.target.innerText);
        }

        eraseCards();
        inquire();
    }
});

function eraseCards() {
    const cards = document.querySelectorAll('.card');
    for (let card of cards) {
        card.remove();
    }
}

function makeCardElement(c) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const title = document.createElement('div');
    title.className = 'card-title';
    title.innerText = c.title;
    if (c.step === 'DONE') title.style.textDecoration = 'line-through';

    const description = document.createElement('div');
    description.className = 'card-description';
    description.innerText = c.description;

    const project = document.createElement('div');
    project.className = 'card-project major';
    project.innerText = c.project;

    const tagsLine = document.createElement('div');
    tagsLine.className = 'card-tagsLine';

    const hierarchy = document.createElement('img');
    hierarchy.className = 'card-icon';
    hierarchy.src = `/${c.hierarchy}_icon.png`;
    tagsLine.append(hierarchy);

    const priority = document.createElement('img');
    priority.className = 'card-icon';
    priority.src = `/${c.priority}_icon.png`;
    tagsLine.append(priority);

    const userText = document.createElement('div');
    userText.className = 'card-user';
    userText.innerText = c.user;
    tagsLine.append(userText);

    cardElement.append(title);
    cardElement.append(description);
    cardElement.append(project);
    cardElement.append(tagsLine);
    return cardElement;
}

function placeCards(cards) {
    cards.forEach(card => {
        for (let panel of panels) {
            if (card.project === panel.dataset.project && card.step === panel.dataset.step) {
                const cardElement = makeCardElement(card);
                panel.append(cardElement);
            }
        }
    });
}

function inquire() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/tickets', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const userData = JSON.parse(xhr.responseText);
            console.log(userData);
            placeCards(userData);
        } else {
            console.error('Something went wrong:', xhr.status);
        }
    };

    let filters = [...myFilterSet];
    xhr.send(JSON.stringify({ names: filters }));
}

inquire();

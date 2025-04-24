let myFilterSet = new Set();
myFilterSet.add('Ashley');
myFilterSet.add('Jasdeep');


const navLinks = document.querySelectorAll('.nav-link');
for (let navLink of navLinks) {
    navLink.addEventListener('click', e => {
        const links = document.querySelectorAll('.nav-link');
        for (let link of links) {
            if (link.innerText === e.target.innerText) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}
const panels = document.querySelectorAll('.panel');
for (let panel of panels) {
    panel.addEventListener('dragover', e => {
        e.preventDefault();
    });

    panel.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        console.log('---', id);
        const card = [...document.querySelectorAll('.card')]
            .find(c => c.querySelector('.card-id').innerText === id);

        const allowedFromRaw = panel.dataset.allowedfrom;
        let allowedFrom = [];
        if (allowedFromRaw) {
            allowedFrom = (new Function(`return ${allowedFromRaw}`))();
        }

        const project = card.querySelector('.card-sprint-id').innerText;
        if (card && allowedFrom.includes(card.dataset.step)) {
            if (panel.dataset.project === project) {
                panel.append(card);
                card.dataset.step = panel.dataset.step;

                //draw line through the card title
                if (card.dataset.step === 'DONE') {
                    const id = card.querySelector('.card-id');
                    id.style.textDecoration = 'line-through';
                }
                panel.scrollTo({ top: card.offsetTop - panel.offsetTop - panel.clientHeight / 2 + card.clientHeight / 2, behavior: 'smooth' });
            }
        }
        const ps = document.querySelectorAll('.panel');
        for (let p of ps) {
            p.classList.remove('panel-selectable');
        }
    });
}
const shortcuts = document.querySelectorAll('.bubble-long');
for (let shortcut of shortcuts) {
    //i wanted a very specific action set for these
    //preset actions
    if (myFilterSet.has(shortcut.innerText)) {
        shortcut.classList.add('bubble-long-active');
    }
    //click actions
    shortcut.addEventListener('click', (event) => {

        event.target.classList.toggle('bubble-long-active');

        if (event.target.classList.contains('bubble-long-active')) {
            myFilterSet.add(event.target.innerText);
        } else {
            myFilterSet.delete(event.target.innerText);
        }

        eraseCards();
        inquire();
    });
    //hover actions
    shortcut.addEventListener('mouseover', (event) => {
        if (!event.target.classList.contains('bubble-long-active')) {
            event.target.classList.add('bubble-long-hover');
        }
    });
    shortcut.addEventListener('mouseleave', (event) => {
        event.target.classList.remove('bubble-long-hover');
    });
}

function eraseCards() {
    const cards = document.querySelectorAll('.card');
    for (let card of cards) {
        card.remove();
    }
}

function makeCardElement(c) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const id = document.createElement('div');
    id.className = 'card-id';
    id.innerText = c.id;
    if (c.step === 'DONE') id.style.textDecoration = 'line-through';

    const description = document.createElement('div');
    description.className = 'card-description';
    description.innerText = c.description;

    const epic = document.createElement('div');
    epic.className = 'card-sprint-id major';
    epic.innerText = c.epic;

    const tagsLine = document.createElement('div');
    tagsLine.className = 'card-tagsLine';

    const has_bug = document.createElement('img');
    if (c.has_bug === 'True') {
        has_bug.className = 'card-icon';
        has_bug.src = `/icons/bug_icon.png`;
        tagsLine.append(has_bug);
    }

    const blocker = document.createElement('img');
    if (c.blocker === 'True') {
        blocker.className = 'card-icon';
        blocker.src = `/icons/blocker_icon.png`;
        tagsLine.append(blocker);
    }

    const story_id = document.createElement('img');
    if (c.story_id) {
        story_id.className = 'card-icon';
        story_id.src = `/icons/story_icon.png`;
        tagsLine.append(story_id);
    }

    const priority = document.createElement('img');
    priority.className = 'card-icon';
    priority.src = `/icons/${c.priority}_icon.png`;
    tagsLine.append(priority);

    const userText = document.createElement('div');
    userText.className = 'card-user';
    userText.innerText = c.user;
    tagsLine.append(userText);

    cardElement.append(id);
    cardElement.append(description);
    cardElement.append(epic);
    cardElement.append(tagsLine);
    return cardElement;
}

function placeCards(cards) {
    cards.forEach(card => {
        for (let panel of panels) {
            if (card.epic === panel.dataset.project && card.step === panel.dataset.step) {
                const cardElement = makeCardElement(card);
                cardElement.dataset.step = panel.dataset.step;
                cardElement.setAttribute('draggable', 'true');
                cardElement.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', card.id);
                    e.dataTransfer.effectAllowed = 'move';

                    const epic = cardElement.querySelector('.card-sprint-id').innerText;
                    console.log(epic);
                    for (let panel of panels) {
                        const p_project = panel.dataset.project;
                        const c_step = cardElement.dataset.step;

                        const allowedFromRaw = panel.dataset.allowedfrom;
                        let allowedFrom = [];
                        if (allowedFromRaw) {
                            allowedFrom = (new Function(`return ${allowedFromRaw}`))();
                        }

                        if (allowedFrom.includes(c_step) && p_project === epic) {
                            panel.classList.add('panel-selectable');
                        }
                    }
                });

                panel.append(cardElement);
            }
        }
    });
}

function inquire() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/sprints', true);
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

let myFilterSet = new Set();
myFilterSet.add('Ashley');


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
        const title = e.dataTransfer.getData('text/plain');
        const card = [...document.querySelectorAll('.card')]
            .find(c => c.querySelector('.card-title').innerText === title);

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
                    const title = card.querySelector('.card-title');
                    title.style.textDecoration = 'line-through';
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

    const title = document.createElement('div');
    title.className = 'card-title';
    title.innerText = c.title;
    if (c.step === 'DONE') title.style.textDecoration = 'line-through';

    const description = document.createElement('div');
    description.className = 'card-description';
    description.innerText = c.description;

    const sprint_id = document.createElement('div');
    sprint_id.className = 'card-sprint-id major';
    sprint_id.innerText = c.sprint_id;

    const tagsLine = document.createElement('div');
    tagsLine.className = 'card-tagsLine';

    const blocker = document.createElement('img');
    if (c.blocker) {
        blocker.className = 'card-icon';
        blocker.src = `/icons/blocker_icon.png`;
        tagsLine.append(blocker);
    }

    const epic = document.createElement('img');
    if (c.epic) {
        epic.className = 'card-icon';
        epic.src = `/icons/epic_icon.png`;
        tagsLine.append(epic);
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

    cardElement.append(title);
    cardElement.append(description);
    cardElement.append(sprint_id);
    cardElement.append(tagsLine);
    return cardElement;
}

function placeCards(cards) {
    cards.forEach(card => {
        for (let panel of panels) {
            if (card.sprint_id === panel.dataset.project && card.step === panel.dataset.step) {
                const cardElement = makeCardElement(card);
                cardElement.dataset.step = panel.dataset.step;
                cardElement.setAttribute('draggable', 'true');
                cardElement.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', card.title);
                    e.dataTransfer.effectAllowed = 'move';

                    const sprint_id = cardElement.querySelector('.card-sprint-id').innerText;
                    console.log(sprint_id);
                    for (let panel of panels) {
                        const p_project = panel.dataset.project;
                        const c_step = cardElement.dataset.step;

                        const allowedFromRaw = panel.dataset.allowedfrom;
                        let allowedFrom = [];
                        if (allowedFromRaw) {
                            allowedFrom = (new Function(`return ${allowedFromRaw}`))();
                        }

                        if (allowedFrom.includes(c_step) && p_project === sprint_id) {
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

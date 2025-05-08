const body = document.querySelector('.main-container');
setTimeout(() => {
    body.style.opacity = 1;
}, 500);

let myFilterSet = new Set();
myFilterSet.add('ALL');

const navLinks = document.querySelectorAll('.nav-link');
for (let navLink of navLinks) {
    //set correct link to current page
    if (navLink.innerText === 'Tasks') navLink.classList.add('active');
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

const listing = document.querySelector('.listing');
function makeTaskElement(t) {
    const block = document.createElement('div');
    block.className = 'task-block';
    //block.innerText = t.title;

    const id = document.createElement('div');
    id.className = 'task-id';
    id.innerText = t.id;
    if (t.step === 'DONE') id.style.textDecoration = 'line-through';
    block.append(id);

    const tagsLine = document.createElement('div');
    tagsLine.className = 'task-text tags-line';
    block.append(tagsLine);

    const title = document.createElement('div');
    title.className = 'task-text task-title';
    title.innerText = t.title;
    block.append(title);

    const description = document.createElement('div');
    description.className = 'task-text task-description';
    description.innerText = t.description;
    block.append(description);

    const epicTitle = document.createElement('div');
    epicTitle.className = 'task-text task-epic task-is-task';
    epicTitle.innerText = t.title;
    block.append(epicTitle);

    const priority = document.createElement('img');
    priority.className = 'task-icon';
    priority.src = `/icons/${t.priority}_icon.png`;
    tagsLine.append(priority);

    const story_id = document.createElement('img');
    if (t.story_id) {
        story_id.className = 'task-icon';
        story_id.src = `/icons/story_icon.png`;
        tagsLine.append(story_id);

        epicTitle.classList.add('task-is-story');
    }

    const has_bug = document.createElement('img');
    if (t.has_bug === 'True') {
        has_bug.className = 'task-icon';
        has_bug.src = `/icons/bug_icon.png`;
        tagsLine.append(has_bug);

        epicTitle.classList.add('task-is-bug');
    }

    const blocker = document.createElement('img');
    if (t.blocker === 'True') {
        blocker.className = 'task-icon';
        blocker.src = `/icons/blocker_icon.png`;
        tagsLine.append(blocker);

        epicTitle.classList.add('task-is-blocker');
    }

    const initiative = document.createElement('img');
    if (t.is_initiative === 'True') {
        //console.log(t.is_initiative);
        initiative.className = 'task-icon';
        // change this later!
        initiative.src = `/icons/epic_icon.png`;
        tagsLine.append(initiative);

        epicTitle.innerText = t.initiative;
        epicTitle.classList.add('task-is-initiative');

        block.classList.add('task-is-initiative');
    }

    const epic = document.createElement('img');
    if (t.is_epic === 'True') {
        epic.className = 'task-icon';
        // change this later!
        epic.src = `/icons/epic_icon.png`;
        tagsLine.append(epic);

        // epic.innerText = t.epic;
        epicTitle.classList.add('task-is-epic');

        block.classList.add('task-is-epic');
    }

    const userText = document.createElement('div');
    userText.className = 'task-id task-user-right';
    userText.innerText = t.assignee.name;
    block.append(userText);

    return block;
}

function placeTasks(tasks) {
    tasks.forEach(task => {
        const taskElement = makeTaskElement(task);
        listing.append(taskElement);
    });

}
function inquire() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/tasks', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const userData = JSON.parse(xhr.responseText);
            console.log(userData);
            placeTasks(userData);
        } else {
            console.error('Something went wrong:', xhr.status);
        }
    };

    let filters = [...myFilterSet];
    xhr.send(JSON.stringify({ names: filters }));
}

inquire();
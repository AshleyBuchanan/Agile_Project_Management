const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const connectToMongo = require('./db/mongo'); // adjust the path if needed

async function getData() {
    const { tasksCollection, usersCollection } = await connectToMongo();
    const tasks = await tasksCollection.find().toArray();
    const users = await usersCollection.find().toArray();
    return { tasks, users };
}
let tasks = [];
let users = [];

(async () => {
    try {
        ({ tasks, users } = await getData());
    } catch (err) {
        console.error('Failed to load tasks.');
    }
})();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/sprints', (req, res) => {
    const panelNames = ['START', 'BLOCKED', 'IN PROGRESS', 'CODE REVIEW', 'TESTING', 'QE VALIDATION', 'DONE'];
    const shortcuts = ['Jasdeep', 'Vinita', 'Praveen', 'Nivas', 'Josh Cantero', 'Ryan', 'Joshua Cheng', 'Ashley'];
    const allEpics = ['User Onboarding', 'Dashboard Management', 'FM Month in Review', 'User Account Management', 'UI Polish', 'FM Another Big Thing'];
    const activeSprint = 'FY25 Q3';
    res.render('sprints', { panelNames, shortcuts, allEpics, users, activeSprint });
});
app.post('/sprints', async (req, res) => {
    const { names } = req.body;
    const matchedTasks = [];
    names.forEach(name => {
        const user = users.find(user => user.name === name);
        if (user && Array.isArray(user.tasks)) {
            user.tasks.forEach(title => {
                const task = tasks.find(t => t.title === title);
                if (task) {
                    task.user = name;
                    matchedTasks.push(task);
                }
            });
        }
    });
    res.json(matchedTasks); // ✅ Only send response once after loop
});


app.listen(port, () => console.log(`APM_Server listening on port:${port}`));



const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const connectToMongo = require('./db/mongo');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/APM_Main_DB', {})
    .then(() => console.log('Mongoose  successfully  connected'))
    .catch(err => console.error('Mongoose connection error:', err));
const loggedUserSchema = new mongoose.Schema({
    loggedOn: [mongoose.Schema.Types.Mixed] // or ObjectId if strictly ObjectIds
});
const LoggedUser = mongoose.model('LoggedUser', loggedUserSchema, 'APM_LoggedOn_Collection');

async function getData() {
    const { tasksCollection, usersCollection } = await connectToMongo();
    const tasks = await tasksCollection.find().toArray();
    const users = await usersCollection.find().toArray();
    return { tasks, users };
}
let tasks = [];
let users = [];
let loggedUsers = new Set();

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
    const page = 'sprints';
    const activeSprint = 'FY25 Q3';
    const shortcuts = ['Jasdeep', 'Vinita', 'Praveen', 'Nivas', 'Josh Cantero', 'Ryan', 'Joshua Cheng', 'Ashley'];
    const panelNames = ['START', 'BLOCKED', 'IN PROGRESS', 'CODE REVIEW', 'TESTING', 'QE VALIDATION', 'DONE'];
    const allEpics = ['User Onboarding', 'Dashboard Management', 'FM Month in Review', 'User Account Management', 'UI Polish', 'FM Another Big Thing'];
    res.render('sprints', { page, activeSprint, shortcuts, panelNames, allEpics });
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
    res.json(matchedTasks);
});
app.get('/tasks', (req, res) => {
    const page = 'tasks';
    const activeSprint = 'FY25 Q3';
    const shortcuts = ['START', 'BLOCKED', 'IN PROGRESS', 'CODE REVIEW', 'TESTING', 'QE VALIDATION', 'DONE', 'ALL'];
    const allEpics = ['User Onboarding', 'Dashboard Management', 'FM Month in Review', 'User Account Management', 'UI Polish', 'FM Another Big Thing'];
    res.render('tasks', { page, activeSprint, shortcuts, allEpics });
});
app.post('/tasks', async (req, res) => {
    const { names } = req.body;
    res.json(tasks);
});

app.get('/login', (req, res) => {
    page = 'login';
    res.render('login', { page });
});
app.get('/', (req, res) => {
    page = 'login';
    res.render('login', { page });
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('-', email);
    console.log('-', password);

    const foundUser = users.find(user => user.email === email && user.pass === password);
    if (foundUser) {
        loggedUsers.add(foundUser._id);
        console.log(loggedUsers);
        try {
            console.log('Saving to DB:', { id: foundUser._id, on: true });
            await LoggedUser.updateOne(
                { _id: '681a834058b558506a3bb5b6' },
                { $push: { loggedOn: foundUser._id } }
            );
        } catch (err) {
            console.error('failed', err.message);
        }
        res.json({ response: 'true', username: foundUser.name, user_id: foundUser._id, user_email: foundUser.email });
    } else {
        res.json({ response: 'false' });
    }
});
app.post('/logout', async (req, res) => {
    const { userId } = req.body;
    const objectId = new mongoose.Types.ObjectId(userId);

    try {
        console.log('Removing from DB:', objectId);
        await LoggedUser.updateOne(
            { _id: '681a834058b558506a3bb5b6' },
            { $pull: { loggedOn: objectId } }
        );
        res.json({ response: 'true' });
    } catch (err) {
        console.error('failed', err.message);
        res.json({ response: 'false' });
    }
});

app.listen(port, () => console.log(`APM_Server listening on port:${port}`));



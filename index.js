const { match } = require('assert');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const task1 = require('./task1.json');
const task2 = require('./task2.json');
const task3 = require('./task3.json');
const task4 = require('./task4.json');
const task5 = require('./task5.json');

const users = [
    {
        name: 'Ashley',
        team: 'FM BE and Web',
        projects:
            [
                'User Onboarding',
                'Dashboard Management'
            ],
        tickets:
            [
                'Implement Google sign-in',
                'Add archive feature for completed tasks'
            ]
    },
    {
        name: 'Jasdeep',
        team: 'FM BE and Web',
        projects:
            [
                'FM Month in Review - FY25 Q3'
            ],
        tickets:
            [
                'Add connection for unconnected user',
            ]
    },
    {
        name: 'Vinita',
        team: 'FM BE and Web',
        projects:
            [
                'User Account Management'
            ],
        tickets:
            [
                'Create password reset flow',
            ]
    },
    {
        name: 'Praveen',
        team: 'FM BE and Web',
        projects:
            [
                'UI Polish'
            ],
        tickets:
            [
                'Ensure mobile responsiveness',
            ]
    }
];

const tickets = [
    {
        sprint_id: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4748',
        description: 'Add unit test for month in review surface',
        priority: 'major',
        hierarchy: 'story',
        step: 'START',
        epic: true,
    },
    {
        sprint_id: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4749',
        description: 'Tracking for Month In Review feature',
        priority: 'major',
        hierarchy: 'story',
        step: 'START',
        epic: true,
    },
    {
        sprint_id: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4742',
        description: 'Create Fabric component for Unconnected User',
        priority: 'major',
        hierarchy: 'bug',
        step: 'IN PROGRESS',
        epic: true,
    },
    {
        sprint_id: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4743',
        description: 'Create and render templates for Unconnected User',
        priority: 'major',
        hierarchy: 'bug',
        step: 'TESTING',
        epic: true,
    },
    {
        sprint_id: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4723',
        description: 'Create darwin experiment for the feature',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: true,
    },
    {
        sprint_id: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4606',
        description: 'Fetch data needed for takeover content and eligibility',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: false,
    },
    {
        sprint_id: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4605',
        description: 'Build bottom takeover Fabric component',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: false,
    },
    {
        sprint_id: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4604',
        description: 'Implement additional events for tracking Member Feedback',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: false,
    },
    {
        sprint_id: 'FM Some other Task - FY25 Q3',
        title: 'MADEUP-9999',
        description: 'Fix login issue',
        priority: 'blocker',
        hierarchy: 'bug',
        step: 'BLOCKED',
        epic: false,
    },
    {
        sprint_id: 'FM Some other Task - FY25 Q3',
        title: 'MADEUP-9998',
        description: 'Fix bad takeover issue',
        priority: 'minor',
        hierarchy: 'bug',
        step: 'QE VALIDATION',
        epic: false,
    },
    {
        sprint_id: 'FM Some other Task - FY25 Q3',
        title: 'MADEUP-9997',
        description: 'First page font is incorrectly sized',
        priority: 'minor',
        hierarchy: 'bug',
        step: 'TESTING',
        epic: true,
    },
    {
        sprint_id: 'FM Another Big Thing - FY25 Q3',
        title: 'MADEUP-9996',
        description: 'Background transparency isn\'t consistent across different pages',
        priority: 'normal',
        hierarchy: 'bug',
        step: 'QE VALIDATION',
        epic: true,
    },
    task1,
    task2,
    task3,
    task4,
    task5,
];

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
app.post('/sprints', (req, res) => {
    const { names } = req.body;
    const matchedTickets = [];
    names.forEach(name => {
        console.log(name);
        const user = users.find(user => user.name === name);
        if (user && Array.isArray(user.tickets)) {
            user.tickets.forEach(title => {
                const ticket = tickets.find(t => t.title === title);
                ticket.user = name;
                if (ticket) matchedTickets.push(ticket);
            });
        }
    });
    res.json(matchedTickets);

});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



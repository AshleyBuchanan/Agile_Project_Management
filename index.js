const { match } = require('assert');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const users = [
    {
        name: 'Jasdeep',
        team: 'FM BE and Web',
        projects:
            [
                'FM Member Feedback - FY25 Q3',
                'FM Month in Review - FY25 Q3',
                'FM Some other Task - FY25 Q3',
            ],
        tickets:
            [
                'MINT-4748',
                'MINT-4749',
                'MINT-4742',
                'MINT-4743',
                'MINT-4723',
                'MINT-4606',
                'MINT-4605',
                'MINT-4604',
            ]
    },
    {
        name: 'Vinita',
        team: 'FM BE and Web',
        projects:
            [
                'FM Member Feedback - FY25 Q3',
                'FM Month in Review - FY25 Q3',
                'FM Some other Task - FY25 Q3',
            ],
        tickets:
            [
                'MADEUP-9999',
                'MADEUP-9998',
            ]
    },
    {
        name: 'Praveen',
        team: 'FM BE and Web',
        projects:
            [
                'FM Member Feedback - FY25 Q3',
                'FM Month in Review - FY25 Q3',
                'FM Some other Task - FY25 Q3',
                'FM Another Big Thing - FY25 Q3'
            ],
        tickets:
            [
                'MADEUP-9997',
                'MADEUP-9996',
            ]
    }
];

const tickets = [
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4748',
        description: 'Add unit test for month in review surface',
        priority: 'major',
        hierarchy: 'story',
        step: 'START',
        epic: true,
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4749',
        description: 'Tracking for Month In Review feature',
        priority: 'major',
        hierarchy: 'story',
        step: 'START',
        epic: true,
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4742',
        description: 'Create Fabric component for Unconnected User',
        priority: 'major',
        hierarchy: 'bug',
        step: 'IN PROGRESS',
        epic: true,
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4743',
        description: 'Create and render templates for Unconnected User',
        priority: 'major',
        hierarchy: 'bug',
        step: 'TESTING',
        epic: true,
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4723',
        description: 'Create darwin experiment for the feature',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: true,
    },
    {
        project: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4606',
        description: 'Fetch data needed for takeover content and eligibility',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: false,
    },
    {
        project: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4605',
        description: 'Build bottom takeover Fabric component',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: false,
    },
    {
        project: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4604',
        description: 'Implement additional events for tracking Member Feedback',
        priority: 'major',
        hierarchy: 'story',
        step: 'DONE',
        epic: false,
    },
    {
        project: 'FM Some other Task - FY25 Q3',
        title: 'MADEUP-9999',
        description: 'Fix login issue',
        priority: 'blocker',
        hierarchy: 'bug',
        step: 'BLOCKED',
        epic: false,
    },
    {
        project: 'FM Some other Task - FY25 Q3',
        title: 'MADEUP-9998',
        description: 'Fix bad takeover issue',
        priority: 'minor',
        hierarchy: 'bug',
        step: 'QE VALIDATION',
        epic: false,
    },
    {
        project: 'FM Some other Task - FY25 Q3',
        title: 'MADEUP-9997',
        description: 'First page font is incorrectly sized',
        priority: 'minor',
        hierarchy: 'bug',
        step: 'TESTING',
        epic: true,
    },
    {
        project: 'FM Another Big Thing - FY25 Q3',
        title: 'MADEUP-9996',
        description: 'Background transparency isn\'t consistent across different pages',
        priority: 'normal',
        hierarchy: 'bug',
        step: 'QE VALIDATION',
        epic: true,
    },
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/tickets', (req, res) => {
    const panelNames = ['START', 'BLOCKED', 'IN PROGRESS', 'CODE REVIEW', 'TESTING', 'QE VALIDATION', 'DONE'];
    const shortcuts = ['Jasdeep', 'Vinita', 'Praveen', 'Nivas', 'Josh Cantero', 'Ryan', 'Joshua Cheng', 'Sidd'];
    const allProjects = ['FM Month in Review - FY25 Q3', 'FM Member Feedback - FY25 Q3', 'FM Some other Task - FY25 Q3', 'FM Another Big Thing - FY25 Q3'];
    res.render('tickets', { panelNames, shortcuts, allProjects, users });
});
app.post('/tickets', (req, res) => {
    const { names } = req.body;
    const matchedTickets = [];
    let projectTitles = new Set();
    names.forEach(name => {
        const user = users.find(user => user.name === name);
        if (user && Array.isArray(user.tickets)) {
            user.tickets.forEach(title => {
                const ticket = tickets.find(t => t.title === title);
                ticket.user = name;
                if (ticket) matchedTickets.push(ticket);
            });
        }
    });
    res.json(matchedTickets, projectTitles);

});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



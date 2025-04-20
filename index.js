const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const user = {
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
        ]
};

const tickets = [
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4748',
        description: 'Add unit test for month in review surface',
        priority: 'major',
        step: 'START,'
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4749',
        description: 'Tracking for Month In Review feature',
        priority: 'major',
        step: 'START',
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4742',
        description: 'Create Fabric component for Unconnected User',
        priority: 'major',
        step: 'IN PROGRESS',
        epic: true,
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4743',
        description: 'Create and render templates for Unconnected User',
        priority: 'major',
        step: 'IN PROGRESS',
        epic: true,
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4723',
        description: 'Create darwin experiment for the feature',
        priority: 'major',
        step: 'DONE',
        epic: true,
    },
    {
        project: 'FM Month in Review - FY25 Q3',
        title: 'MINT-4723',
        description: 'Create darwin experiment for the feature',
        priority: 'major',
        step: 'DONE',
        epic: true,
    },
    {
        project: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4606',
        description: 'Fetch data needed for takeover content and eligibility',
        priority: 'major',
        step: 'DONE',
        epic: false,
    },
    {
        project: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4605',
        description: 'Build bottom takeover Fabric component',
        priority: 'major',
        step: 'DONE',
        epic: false,
    },
    {
        project: 'FM Member Feedback - FY25 Q3',
        title: 'MINT-4604',
        description: 'Implement additional events for tracking Member Feedback',
        priority: 'major',
        step: 'DONE',
        epic: false,
    },
];

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    const panelNames = ['START', 'BLOCKED', 'IN PROGRESS', 'CODE REVIEW', 'TESTING', 'QE VALIDATED', 'DONE'];
    const shortcuts = ['Jasdeep', 'Vinita', 'Praveen', 'Nivas', 'Josh Cantero', 'Ryan', 'Joshua Cheng', 'Sidd'];
    res.render('main', { panelNames, shortcuts, user, tickets });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



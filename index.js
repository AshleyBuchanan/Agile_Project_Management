const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const user = {
    name: 'Jasdeep',
    team: 'FM BE and Web',
    projects:
        [
            'FM Member Feedback - FY25 Q3 5 issues',
            'FM Month in Review - FY25 Q3 5 issues'
        ]
};
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    const panelNames = ['START', 'BLOCKED', 'IN PROGRESS', 'CODE REVIEW', 'TESTING', 'QE VALIDATED', 'DONE'];
    res.render('main', { panelNames, user });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



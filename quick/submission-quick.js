const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, 'react/build')));

app.get('/submit', (request, response) => {
    response.json("TODO");
});

app.listen(8004, () => console.log("listening on 8004"));
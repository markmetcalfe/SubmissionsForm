const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/submit-quick', (req, res) => {
    console.log(req);
    res.json(req);
});

app.listen(8003, () => console.log("listening on 8003"));
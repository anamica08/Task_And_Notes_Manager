const express = require('express')
const { db } = require('./db/model')
const todo_route = require('./routes/todo')
const app = express()
app.use(express.json())
    //add data to html page and then serve it to browser
app.use('/', express.static(__dirname + '/front-end'));

app.use('/todos', todo_route);

db.sync()
    .then(() => {
        var port = process.env.PORT || 3232;
        app.listen(port);
    })
    .catch((err) => {
        console.error(err);
    })
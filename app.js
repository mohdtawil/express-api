const connection = require('./database/sqlConnections');

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override"),
    box = require('./routes/box'),
    cors = require('cors'),
    author = require('./routes/author'),
    genre = require('./routes/genre');
    

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/uploads', express.static('uploads'));
// parse application/json
app.use(bodyParser.json())
app.use(methodOverride("_method"));
app.use(cors({
    origin: '*'
}));


app.use('/images', express.static(__dirname + '/uploads'));

connection.connect((err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected!!");
    }
})

app.use(box);
app.use(author);
app.use(genre);



app.get("/" , (req , res) => {
    res.send("Home Page")
})

const port = 2091;
app.listen(port , () => {
    console.log("Server Conected!!");
})
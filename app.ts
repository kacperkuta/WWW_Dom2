import {promisify} from 'util';
import * as sqlite3 from 'sqlite3';
import path = require("path");


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.set('view engine', 'pug');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use("/script", express.static(path.join(__dirname, ".")));

class Quiz {
    id: number;
    wstep: string;
    zadania: string[];
    odpowiedzi: number[];
    kary: number[];
}

let quizzes = new Array<Quiz>();
let myQuiz: Quiz = null;

function renderQuizes(res, db) {
    db.all("SELECT * from quiz;", [], (err, rows) => {
        for (const {jsonContent} of rows) {
            let quiz : Quiz = JSON.parse(jsonContent);
            quizzes.push(quiz);
        }
        console.log(quizzes);
        res.render("choose_quiz", {quizzes: quizzes});
    });
}

app.get('/', (req, res) => {
   res.render("login", {powitanie: "Zaloguj się!"});
});

app.post('/', (req, res) => {
    sqlite3.verbose();
    const db = new sqlite3.Database('baza.db');
    db.get("SELECT * from user WHERE login = \"" + req.body.us + "\";", (err, result) => {
        if (result == null || result.password !== req.body.pas) {
            res.render("login", {powitanie: "Podaj poprawne dane:"});
        } else {
            renderQuizes(res, db);
        }
    })
});

app.get('/change_password', (req, res) => {
    res.render("change_password", {powitanie: "Zmień hasło:"});
});

app.post('/change_password', (req, res) => {
    sqlite3.verbose();
    const db = new sqlite3.Database('baza.db');
    db.get("SELECT * from user WHERE login = \"" + req.body.us + "\";", (err, result) => {
        if (result == null) {
            res.render("change_password", {powitanie: "Podaj poprawny login:"});
        } else {
            db.run("UPDATE user SET password = \"" + req.body.pas + "\" WHERE login = \"" + req.body.us + "\";", () => {
                res.redirect("/");
            });
        }
    })
});

app.get('/quiz/:id', (req, res) => {
    for (const quiz of quizzes) {
        if (quiz.id == req.params.id) {
            myQuiz = quiz;
            break;
        }
    }
    if (myQuiz == null) {
        renderQuizes(res, new sqlite3.Database('baza.db'));
    } else {
        res.render("quiz", {quiz: JSON.stringify(myQuiz)});
    }
});

app.post('/results', (req, res) => {
    res.render("results");
});


app.listen(3000);
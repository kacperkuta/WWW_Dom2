import * as sqlite3 from 'sqlite3';
import path = require("path");
import {isUndefined} from "util";


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

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

function proceedResults(anwsers, req) {
    let quizLength = req.session.myQuiz.wstep.length;
    let result = 0;
    let i = 0;
    while (i < quizLength) {
        if (anwsers[i] != req.session.myQuiz.odpowiedzi[i]) {
            result += req.session.myQuiz.kary[i];
        }
        i++;
    }
    return result;
}

function wrongAnwsers(anwsers, req) {
    let quizLength = req.session.myQuiz.wstep.length;
    var mistakes = "";
    var i = 0;
    while (i < quizLength) {
        if (anwsers[i] != req.session.myQuiz.odpowiedzi[i]) {
            mistakes += (i + 1).toString() + " ";
        }
        i++;
    }
    if (mistakes == "") {
        mistakes = "Wszystko dobrze :)";
    }
    return mistakes;
}

function renderQuizes(req, res, db) {
    req.session.quizzes = new Array<Quiz>();
    db.all("SELECT * from quiz;", [], (err, rows) => {
        for (const {jsonContent} of rows) {
            let quiz : Quiz = JSON.parse(jsonContent);
            req.session.quizzes.push(quiz);
        }
        if (req.session.wrong_choice == true) {
            res.render("choose_quiz", {quizzes: req.session.quizzes, info: 'Wybierz inny quiz, ten już rozwiązałeś'});
        } else {
            res.render("choose_quiz", {quizzes: req.session.quizzes, info: "Wybierz quiz"});
        }
    });
}

function checkToken(req, res) {
    sqlite3.verbose();
    const db = new sqlite3.Database('baza.db');
    let promise = new Promise(((resolve) => {
        db.get('SELECT token FROM session_tokens WHERE login = "' + req.session.user + '";', (err, result) => {
            if (isUndefined(result) || req.session.token !== result.token) {
                req.session.logged = false;
                res.redirect('/');
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }));
    return promise;
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
            req.session.user = req.body.us;
            req.session.logged = true;
            db.get('SELECT token from session_tokens where login = "' + req.body.us + '";', (err, result) => {
                req.session.token = result.token;
                renderQuizes(req, res, db);
            })
        }
    })
});

app.get('/choose_quiz', async (req, res) => {
    let tokenVerify = await checkToken(req, res);

    if (tokenVerify == true) {
        sqlite3.verbose();
        const db = new sqlite3.Database('baza.db');
        if (req.session.logged == true) {
            renderQuizes(req, res, db);
        } else {
            res.redirect("/");
        }
    }
});

app.get('/change_password', (req, res) => {
    res.render("change_password", {powitanie: "Zmień hasło:"});
});

app.post('/change_password', (req, res) => {
    let login = req.body.us;
    sqlite3.verbose();
    const db = new sqlite3.Database('baza.db');
    db.get("SELECT * from user WHERE login = \"" + login + "\";", (err, result) => {
        if (result == null) {
            res.render("change_password", {powitanie: "Podaj poprawny login:"});
        } else {
            db.run("UPDATE user SET password = \"" + req.body.pas + "\" WHERE login = \"" + login + "\";", () => {
                db.run("UPDATE session_tokens SET token = " + Math.floor(Math.random() * 1000000000) + ' WHERE login = "' + login + '";', (err) => {
                    res.redirect("/");
                })
            });
        }
    })
});

app.get('/quiz/:id', async (req, res) => {
    let tokenVerify = await checkToken(req, res);

    if (tokenVerify == true) {
        if (req.session.logged != true) {
            res.redirect('/');
        } else {
            sqlite3.verbose();
            const db = new sqlite3.Database('baza.db');

            req.session.wrong_choice = false;
            for (const quiz of req.session.quizzes) {
                if (quiz.id == req.params.id) {
                    req.session.myQuiz = quiz;
                    break;
                }
            }
            if (req.session.myQuiz == null) {
                renderQuizes(req, res, db);
            } else {
                db.get('SELECT * FROM solved WHERE login = "' + req.session.user + '" AND quiz_id = ' + req.session.myQuiz.id + ';', (err, result) => {
                    if (err != null) {
                        console.log(err);
                    } else {
                        if (result == null) {
                            req.session.wrong_choice = false;
                            res.render("quiz", {quiz: JSON.stringify(req.session.myQuiz)});
                        } else {
                            req.session.wrong_choice = true;
                            res.redirect("/choose_quiz");
                        }
                    }
                });
            }
        }
    } else {
        //
    }
});

app.post('/results', async (req, res) => {
    let tokenVerify = await checkToken(req, res);

    if (tokenVerify == true) {
        let anwsers : number[] = JSON.parse(req.body.anwsers);
        let times : number[] = JSON.parse(req.body.times);
        let my_result : number = proceedResults(anwsers, req) + times.reduce((a, b) => a+b);

        sqlite3.verbose();
        const db = new sqlite3.Database('baza.db');
        db.run('INSERT INTO bestres (id, res) VALUES (' + req.session.myQuiz.id + ', ' + my_result + ');', (err) => {
            if (err != null) {
                console.log(err);
            } else {
                let bestres : number[] = [0];
                db.all('SELECT res FROM bestres WHERE id = ' + req.session.myQuiz.id + ' ORDER BY res ASC LIMIT 5;', (err, rows) => {
                    let i = 0;
                    for (const {res} of rows) {
                        bestres[i] = res;
                        i++;
                    }
                    res.render("results", {
                        result: my_result,
                        mistakes: wrongAnwsers(anwsers, req),
                        penalties: proceedResults(anwsers, req),
                        bests: JSON.stringify(bestres)
                    });
                });
            }
        });
    } else {
    }
});

app.get('/end', async (req, res) => {

    let tokenVerify = await checkToken(req, res);

    if (tokenVerify == true) {
        sqlite3.verbose();
        const db = new sqlite3.Database('baza.db');
        db.run('INSERT INTO solved (login, quiz_id) VALUES ("' + req.session.user + '",' + req.session.myQuiz.id + ');', (err) => {
            if (err != null) {
                console.log(err);
            } else {
                res.redirect('/choose_quiz');
            }
        });
    } else {
    }
});


app.listen(3000);
import * as sqlite3 from 'sqlite3';

sqlite3.verbose();
const db = new sqlite3.Database('baza.db');
db.run("DROP TABLE user;", (err) => {
    console.log(err);
    db.run("DROP TABLE quiz;", (err) => {
        db.run("DROP TABLE bestres;", (err) => {
            console.log(err);
            db.run("CREATE TABLE bestres (id INT, res FLOAT);", (err) => {
                console.log(err);
            });
        });
        console.log(err);
        db.run("CREATE TABLE user (login VARCHAR(64) UNIQUE, password VARCHAR(64));", (err) => {
            console.log(err);
            db.run("INSERT INTO user (login, password) VALUES (\"user1\", \"user1\");", (err) => {
                console.log(err);
                db.run("INSERT INTO user (login, password) VALUES (\"user2\", \"user2\");", (err) => {
                    console.log(err);
                    db.run("CREATE TABLE quiz (jsonContent VARCHAR(4096) NOT NULL);", (err) => {
                        console.log(err);
                        db.run("INSERT INTO quiz (jsonContent) VALUES ('{\n    \"id\" : 1,\n    \"wstep\" : \"Quiz matematyczny 1\",\n    \"zadania\" : [\"2+2\", \"2+3\", \"1+7\", \"100+100\"],\n    \"odpowiedzi\" : [4, 5, 8, 200],\n    \"kary\" : [5, 4, 3, 15]\n}');", (err) => {
                            console.log(err);
                            db.run("INSERT INTO quiz (jsonContent) VALUES ('{\n    \"id\" : 2,\n    \"wstep\" : \"Quiz matematyczny 2\",\n    \"zadania\" : [\"2+2\", \"2+3\", \"1+7\", \"100+100\"],\n    \"odpowiedzi\" : [4, 5, 8, 200],\n    \"kary\" : [5, 4, 3, 15]\n}');", (err) => {
                                console.log(err);
                                db.run("INSERT INTO quiz (jsonContent) VALUES ('{\n    \"id\" : 3,\n    \"wstep\" : \"Quiz matematyczny 3\",\n    \"zadania\" : [\"2+2\", \"2+3\", \"1+7\", \"100+100\"],\n    \"odpowiedzi\" : [4, 5, 8, 200],\n    \"kary\" : [5, 4, 3, 15]\n}');", (err) => {
                                    console.log(err);
                                });
                            });
                        });
                    });
                });
            });
        });
    })
});



import * as sqlite3 from 'sqlite3';

sqlite3.verbose();
const db = new sqlite3.Database('baza.db');
db.run("DROP TABLE IF EXISTS user;", (err) => {
    
    db.run("DROP TABLE IF EXISTS quiz;", (err) => {
        db.run("DROP TABLE IF EXISTS bestres;", (err) => {
            
            db.run("CREATE TABLE bestres (id INT, res FLOAT);", (err) => {
                
                db.run('DROP TABLE IF EXISTS solved;', (err) => {
                    
                    db.run('CREATE TABLE solved (login VARCHAR(64), quiz_id INT);', (err) => {
                        
                        db.run("DROP TABLE IF EXISTS session_tokens;", (err) => {
                            
                            db.run("CREATE TABLE session_tokens (login VARCHAR(64), token INT);", (err) => {
                                
                                db.run('INSERT INTO session_tokens (login, token) VALUES ("user1", 1);', (err) => {
                                    
                                    db.run('INSERT INTO session_tokens (login, token) VALUES ("user3", 3);', (err) => {
                                        
                                        db.run('INSERT INTO session_tokens (login, token) VALUES ("user2", 2);', (err) => {
                                            
                                            db.run("CREATE TABLE user (login VARCHAR(64) UNIQUE, password VARCHAR(64));", (err) => {
                                                
                                                db.run("INSERT INTO user (login, password) VALUES (\"user1\", \"user1\");", (err) => {
                                                    
                                                    db.run("INSERT INTO user (login, password) VALUES (\"user2\", \"user2\");", (err) => {
                                                        
                                                        db.run("CREATE TABLE quiz (jsonContent VARCHAR(4096) NOT NULL);", (err) => {
                                                            
                                                            db.run("INSERT INTO quiz (jsonContent) VALUES ('{\n    \"id\" : 1,\n    \"wstep\" : \"Quiz matematyczny 1\",\n    \"zadania\" : [\"2+2\", \"2+3\", \"1+7\", \"100+100\"],\n    \"odpowiedzi\" : [4, 5, 8, 200],\n    \"kary\" : [5, 4, 3, 15]\n}');", (err) => {
                                                                
                                                                db.run("INSERT INTO quiz (jsonContent) VALUES ('{\n    \"id\" : 2,\n    \"wstep\" : \"Quiz matematyczny 2\",\n    \"zadania\" : [\"2+2\", \"2+3\", \"1+7\", \"100+100\"],\n    \"odpowiedzi\" : [4, 5, 8, 200],\n    \"kary\" : [5, 4, 3, 15]\n}');", (err) => {
                                                                    
                                                                    db.run("INSERT INTO quiz (jsonContent) VALUES ('{\n    \"id\" : 3,\n    \"wstep\" : \"Quiz matematyczny 3\",\n    \"zadania\" : [\"2+2\", \"2+3\", \"1+7\", \"100+100\"],\n    \"odpowiedzi\" : [4, 5, 8, 200],\n    \"kary\" : [5, 4, 3, 15]\n}');", (err) => {
                                                                        
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        })
                                    });
                                });
                            });
                        })
                    });
                })
            });
        });
    });
});




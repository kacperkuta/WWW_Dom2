import {expect} from 'chai';
import {driver, WebDriver} from 'mocha-webdriver';

import * as sqlite3 from 'sqlite3';


describe('testPierwszy', function () {
    it('powinien być komuniakt o błędzie', async function () {
        this.timeout(20000);

        await driver.get('http://localhost:3000/');

        await driver.find('input[type=username]').sendKeys('user1');
        await driver.find('input[type=password]').sendKeys('user1');
        await driver.find('input[type=submit]').click();

        await driver.get('http://localhost:3000/choose_quiz');

        await driver.get('http://localhost:3000/quiz/1');
        await driver.find("button[id=start]").click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=next]').click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=next]').click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=next]').click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=end]').click();
        await driver.find('button[id=confirm]').click();

        await driver.get('http://localhost:3000/end');

        await driver.get('http://localhost:3000/choose_quiz');
        await driver.get('http://localhost:3000/quiz/1');

        expect(await driver.find('h1[id=info]').getText()).to.include('Wybierz inny quiz, ten już rozwiązałeś');
    });
});

describe('testDrugi', function () {
    it('czasy rozwiązania zadań', async function () {
        this.timeout(20000);

        await driver.get('http://localhost:3000/');

        await driver.find('input[type=username]').sendKeys('user1');
        await driver.find('input[type=password]').sendKeys('user1');
        await driver.find('input[type=submit]').click();

        await driver.get('http://localhost:3000/choose_quiz');

        await driver.get('http://localhost:3000/quiz/2');
        await driver.find("button[id=start]").click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=next]').click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=next]').click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=next]').click();
        await driver.find("input[id=anwser]").sendKeys('1');
        await driver.find('button[id=end]').click();

        let text = await driver.find('input[id=times_field]').getAttribute('value');

        let array : number[] = JSON.parse(text);

        await driver.find('button[id=confirm]').click();

        let result :number = +await driver.find('p[id=results_par]').getText();
        let penalties :number = +await driver.find('p[id=penalties]').getText();

        expect(Math.round(array.reduce((a, b) => (a+b)))).to.equal(Math.round(result-penalties));
    });
});
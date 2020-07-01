var Timer = /** @class */ (function () {
    function Timer() {
        this.total = 0;
    }
    Timer.prototype.start_count = function () {
        this.startTime = new Date().getTime();
    };
    Timer.prototype.end_count = function () {
        this.endTime = new Date().getTime();
        this.total = this.total + this.endTime - this.startTime;
    };
    Timer.prototype.result = function () {
        return this.total / 1000;
    };
    return Timer;
}());
var Pair = /** @class */ (function () {
    function Pair() {
        this.first = 0;
        this.second = 0;
    }
    return Pair;
}());
var Result = /** @class */ (function () {
    function Result(length) {
        this.length = length;
        this.stats = new Array(length);
    }
    return Result;
}());
function displayTime() {
    intervalFun = setInterval(function () {
        actTime += 0.1;
        timerParagraph.innerHTML = (actTime.toFixed(1)).toString();
    }, 100);
}
function min(a, b) {
    if (a < b) {
        return a;
    }
    return b;
}
var Quiz = /** @class */ (function () {
    function Quiz() {
    }
    return Quiz;
}());

var dummyQuizParag = document.querySelector("p[id=dummy]");

var quizJson = dummyQuizParag.innerHTML;
var quiz = JSON.parse(quizJson);

var quizLength = quiz.zadania.length;
var actPos = 0;
var nextPos = 0;
var anwsers = new Array(quizLength);
var timer = new Array(quizLength);
var givenAnwsers = 0;
var actTime = 0;
var intervalFun;
var totalResult = 0;
var startButton = document.getElementById("startButton");
var start = document.querySelector("button[id=start]");
var quizDiv = document.querySelector("div[id=quiz]");
var anwserInput = document.querySelector("input[id=anwser]");
var stopButton = document.querySelector("button[id=end]");
var previousButton = document.querySelector("button[id=previous]");
var nextButton = document.querySelector("button[id=next]");
var cancelButton = document.querySelector("button[id=cancel]");
var entryParagrapgh = document.querySelector("p[id=entry]");
var taskParagrapgh = document.querySelector("p[id=task]");
var resultsDiv = document.getElementById("results");
var results = document.querySelector("p[id=results_par]");
var returnButton = document.querySelector("button[id=return]");
var mistakesParagraph = document.querySelector("p[id=mistakes]");
var penaltiesParagraph = document.querySelector("p[id=penalties]");
var timerParagraph = document.querySelector("p[id=timer_par]");
var saveWithStats = document.querySelector("button[id=saveWithStats]");
var saveNoStats = document.querySelector("button[id=saveNoStats]");
var statsParagraph = document.querySelector("p[id=stats]");
var taskHeader = document.querySelector("h2[id=task_header]");
var resultsFiled = document.querySelector("input[id=results_field]");
var sendButton = document.querySelector("input[id=send]");


function reset() {
    actPos = 0;
    givenAnwsers = 0;
    actTime = 0;
    var i = 0;
    while (i < quizLength) {
        timer[i] = new Timer();
        anwsers[i] = null;
        i++;
    }
    previousButton.style.visibility = "hidden";
    if (quizLength === 1) {
        nextButton.style.visibility = "hidden";
    }
    else {
        nextButton.style.visibility = "visible";
    }
    anwserInput.value = "";
    entryParagrapgh.innerHTML = quiz.wstep;
    taskParagrapgh.innerHTML = quiz.zadania[0];
    taskHeader.innerHTML = "Zadanie 1 z " + quizLength.toString();
    clearInterval(intervalFun);
}
start.addEventListener("click", function () {
    quizDiv.style.display = "inline";
    startButton.style.display = "none";
    reset();
    displayTime();
    timer[0].start_count();
});
function checkFields() {
    if (anwsers[actPos] != null && anwserInput.value === "") {
        givenAnwsers--;
    }
    else if (anwsers[actPos] == null && anwserInput.value !== "") {
        givenAnwsers++;
    }
    if (anwserInput.value === "") {
        anwsers[actPos] = null;
    }
    else {
        anwsers[actPos] = +anwserInput.value;
    }
    if (nextPos === 0) {
        previousButton.style.visibility = "hidden";
    }
    else {
        previousButton.style.visibility = "visible";
    }
    if (nextPos === quizLength - 1) {
        nextButton.style.visibility = "hidden";
    }
    else {
        nextButton.style.visibility = "visible";
    }
    if (anwsers[nextPos] != null) {
        anwserInput.value = anwsers[nextPos].toString();
    }
    else {
        anwserInput.value = "";
    }
    taskParagrapgh.innerHTML = quiz.zadania[nextPos];
    var taskH = "Zadanie " + (nextPos + 1).toString() + " z " + quizLength.toString();
    taskHeader.innerHTML = taskH;
    actPos = nextPos;
}
nextButton.addEventListener("click", function () {
    nextPos = actPos + 1;
    timer[actPos].end_count();
    timer[nextPos].start_count();
    checkFields();
});
previousButton.addEventListener("click", function () {
    nextPos = actPos - 1;
    timer[actPos].end_count();
    timer[nextPos].start_count();
    checkFields();
});
cancelButton.addEventListener("click", function () {
    quizDiv.style.display = "none";
    startButton.style.display = "flex";
    reset();
});
function proceedResults() {
    var result = 0;
    var i = 0;
    while (i < quizLength) {
        if (anwsers[i] != quiz.odpowiedzi[i]) {
            result += quiz.kary[i];
        }
        i++;
    }
    return result;
}
function wrongAnwsers() {
    var mistakes = "";
    var i = 0;
    while (i < quizLength) {
        if (anwsers[i] != quiz.odpowiedzi[i]) {
            mistakes += (i + 1).toString() + " ";
        }
        i++;
    }
    if (mistakes == "") {
        mistakes = "Wszystko dobrze :)";
    }
    return mistakes;
}
function countTime() {
    var i = 0;
    var total = 0;
    while (i < quizLength) {
        total = total + timer[i].result();
        i++;
    }
    return total;
}
function bestResults() {
    var storLen = localStorage.length;
    var results = new Array(storLen);
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = JSON.parse(localStorage.getItem(key));
        results[i] = value.total;
    }
    var sortedResults = results.sort(function (n1, n2) { return n1 - n2; });
    var bestResults = "";
    for (var i = 0; i < min(3, sortedResults.length); i++) {
        bestResults += sortedResults[i].toString();
        bestResults += "<br>";
    }
    if (bestResults === "") {
        bestResults += "Zagraj, aby zobaczyć wyniki";
    }
    return bestResults;
}
stopButton.addEventListener("click", function () {
    nextPos = actPos;
    checkFields();
    if (givenAnwsers === quizLength) {
        timer[actPos].end_count();

        resultsFiled.innerHTML = JSON.stringify(anwsers);
        sendButton.click();

        var result = proceedResults();

        totalResult = result + countTime();
        resultsDiv.style.display = "inline";
        results.innerHTML = totalResult.toString();
        var mistakes = wrongAnwsers();
        mistakesParagraph.innerHTML = mistakes;
        penaltiesParagraph.innerHTML = result.toString();
        statsParagraph.innerHTML = bestResults();
        quizDiv.style.display = "none";
    }
});
function returnAction() {
    resultsDiv.style.display = "none";
    quizDiv.style.display = "none";
    startButton.style.display = "flex";
    reset();
}
returnButton.addEventListener("click", function () {
    returnAction();
});
function createStats() {
    var stats = new Result(quizLength);
    stats.total = totalResult;
    var i = 0;
    while (i < quizLength) {
        stats.stats[i] = timer[i].result();
        i++;
    }
    localStorage.setItem(localStorage.length.toString(), JSON.stringify(stats));
}

saveWithStats.addEventListener("click", function () {
    createStats();
    returnAction();
});


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
var returnButton = document.querySelector("button[id=return]");
var timerParagraph = document.querySelector("p[id=timer_par]");
var taskHeader = document.querySelector("h2[id=task_header]");
var sendButton = document.querySelector("input[id=send]");
var confirmButton = document.querySelector("button[id=confirm]");



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

stopButton.addEventListener("click", function () {
    nextPos = actPos;
    checkFields();
    if (givenAnwsers === quizLength) {
        timer[actPos].end_count();

        var times = [];
        for (let i = 0; i < quizLength; i++) {
            times[i] = timer[i].result();
        }

        document.getElementById("results_field").setAttribute('value', JSON.stringify(anwsers));
        document.getElementById("times_field").setAttribute('value', JSON.stringify(times));
        confirmButton.style.display = 'flex';
    }
});

confirmButton.addEventListener("click", function () {
    sendButton.click();
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




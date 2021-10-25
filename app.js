//global variable
let Data = class {
  constructor(userid, questionNumber, correctness, time) {
    this.userid = userid;
    this.questionNumber = questionNumber;
    this.correctness = correctness;
    this.time = time;
  }
};

let database = new Array();
let captcha = new Array();
let timeLimit = 200;
let timeId = null;

function Confirm() {
  var userid = document.getElementById("userid");
  userid = userid.value;
  window.location.href = 'setup.html?userid=' + userid;

  var f = "sometextfile.txt";

  writeTextFile(f, "Spoon")
  writeTextFile(f, "Cheese monkey")
  writeTextFile(f, "Onion")

  function writeTextFile(afilename, output)
  {
    var txtFile =new File(afilename);
    txtFile.writeln(output);
    txtFile.close();
  }
}

function Welcome() {
  const welcome = document.getElementById("welcome");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userid = urlParams.get('userid')
  welcome.innerHTML = "Welcome, Paticipant " + userid + "!";
}

function Start(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userid = urlParams.get('userid')
  var seed = Math.round(Math.random())
  if (seed == 1) {
    window.location.href = 'captcha.html?userid=' + userid + '&part=1&question=Image-Based';
  }
  else {
    window.location.href = 'captcha.html?userid=' + userid + '&part=1&question=Text-Based';
  }
}

function Break() {
  var timer = document.getElementById("timer");
  var time = Number(timer.innerHTML);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userid = urlParams.get('userid')
  var questionType = urlParams.get('question')
  var part = Number(urlParams.get('part'))

  timeId = setInterval(function(){
    time -- ;
    timer.innerText = time/10
    if (time <= 0) {
      clearInterval(timeId);
      if (questionType == "Text-Based") {
        window.location.href = 'captcha.html?userid=' + userid + '&part=2&question=Image-Based';
      }
      else {
        window.location.href = 'captcha.html?userid=' + userid + '&part=2&question=Text-Based';
      }
    }
  }, 100);

}

function CreateCAPTCHA() {
  const activeCaptcha = document.getElementById("captcha");
  for (q = 0; q < 6; q++) {
    if (q % 2 == 0) {
      captcha[q] = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    } else {
      captcha[q] = Math.floor(Math.random() * 10 + 0);
    }
  }
  theCaptcha = captcha.join("");
  activeCaptcha.innerHTML = `${theCaptcha}`;
  //timer
  var timer = document.getElementById("timer");
  var time = timer.innerHTML
  timeId = setInterval(function(){
    time ++ ;
    timer.innerText = time/10 }, 100);
  //question + number
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var questionType = urlParams.get('question');
  var question = document.getElementById("question");
  question.innerHTML = questionType;
  var questionNumber = document.getElementById("number");
  questionNumber.innerHTML = String(Number(questionNumber.innerHTML) + 1)
}

function ValidateCAPTCHA(value) {
  const errCaptcha = document.getElementById("errCaptcha");
  const reCaptcha = document.getElementById("reCaptcha");
  const timer = document.getElementById("timer");
  var questionNumber = document.getElementById("number").innerHTML;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userid = urlParams.get('userid')
  var questionType = urlParams.get('question')
  var part = Number(urlParams.get('part'))


  var correctness = null;
  var time = timer.innerHTML;
  recaptcha = reCaptcha.value;
  timer.innerHTML = 0;

  if (value == 'Submit'){
    let ValidateCAPTCHA = 0;
    for (var z = 0; z < 6; z++) {
      if (recaptcha.charAt(z) == captcha[z]) {
        ValidateCAPTCHA++;
      }
    }
    if (ValidateCAPTCHA == 6 && recaptcha.length == 6) {
      errCaptcha.innerHTML = "Correct";
      correctness = "O";
    }
    else {
      errCaptcha.innerHTML = "Wrong";
      correctness = "X";
    }
  }
  else {
    var correctness = "-"
  }
  clearInterval(timeId);

  //save data
  var data = new Data(userid, questionNumber, correctness, time);
  database.push(data)
  //next question
  var questionNumber = Number(document.getElementById("number").innerHTML);
  if (questionNumber%5 ==0) {
    window.localStorage.setItem('database' + questionType, JSON.stringify(database));
    if (part == 1) {
      window.location.href = 'break.html?userid=' + userid + '&question=' + questionType
    }
    else {
      window.location.href = 'end.html?userid=' + userid + '&question=' + questionType
    }
  }
  CreateCAPTCHA()
}

function Result() {
  var imageData = JSON.parse(window.localStorage.getItem('databaseImage-Based'));
  var textData = JSON.parse(window.localStorage.getItem('databaseText-Based'));
  console.log(imageData)
  console.log(textData)
}

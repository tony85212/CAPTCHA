//global variable
let Data = class {
  constructor(uid, questionNumber, correctness, time) {
    this.uid = uid;
    this.questionNumber = questionNumber;
    this.correctness = correctness;
    this.time = time;
  }
};
let database = new Array();
let captcha = new Array();
let timeId = null;

let text = ['22d5n', '23mdg', '23n88', '226md', '2356g'];
let obj = ['dog', 'cat']
let image = [[1, 5, 6], [1, 3, 7]]
let select = new Array();
let num = 0
//index - setup
function Confirm() {
  var uid = document.getElementById("uid");
  uid = uid.value;
  window.location.href = 'setup.html?uid=' + uid;
}

//welcome
function Welcome() {
  //get variable
  const welcome = document.getElementById("welcome");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get('uid')
  welcome.innerHTML = "Welcome, Paticipant " + uid + "!";
}

//welcomt - captcha
function Start(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get('uid')
  var seed = Math.round(Math.random())
  if (seed == 1) {
    window.location.href = 'imagecaptcha.html?uid=' + uid + '&part=1&captcha=Image-Based';
  }
  else {
    window.location.href = 'textcaptcha.html?uid=' + uid + '&part=1&captcha=Text-Based';
  }
}

//captcha to break
function Break() {
  //get variable
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get('uid')
  var questionType = urlParams.get('captcha')
  var part = Number(urlParams.get('part'))
  //setting timer
  var timer = document.getElementById("timer");
  var time = Number(timer.innerHTML);

  timeId = setInterval(function(){
    time -- ;
    timer.innerText = Math.floor(time/10);
    if (time <= 0) {
      clearInterval(timeId);
      if (questionType == "Text-Based") {
        window.location.href = 'imagecaptcha.html?uid=' + uid + '&part=2&captcha=Image-Based';
      }
      else {
        window.location.href = 'textcaptcha.html?uid=' + uid + '&part=2&captcha=Text-Based';
      }
    }
  }, 100);

}

function TextCreateCAPTCHA() {
  //get variaable question + number
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var questionType = urlParams.get('captcha');
  var question = document.getElementById("question");
  var questionNumber = document.getElementById("number");
  num = Number(questionNumber.innerHTML);
  //activev captcha
  const activeCaptcha = document.getElementById("captcha");
  activeCaptcha.src="text-based/" + text[num] + ".png";
  questionNumber.innerHTML = String(num + 1);
  //timer
  var timer = document.getElementById("timer");
  var time = timer.innerHTML
  timeId = setInterval(function(){
    time -- ;
    if (time <= 0){
      document.getElementById("submit").click();
    }
    timer.innerText = time/10 }, 100);
}

function TextValidateCAPTCHA(value) {
  const reCaptcha = document.getElementById("reCaptcha");
  const timer = document.getElementById("timer");
  var questionNumber = document.getElementById("number").innerHTML;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get('uid')
  var questionType = urlParams.get('captcha')
  var part = Number(urlParams.get('part'))

  var correctness = null;
  var time = timer.innerHTML;
  recaptcha = reCaptcha.value;
  timer.innerHTML = 300;
  if (value == 'Submit'){
    if (recaptcha === text[num]) {
      correctness = "O";
    }
    else {
      correctness = "X";
    }
  }
  else {
    var correctness = "-"
  }
  clearInterval(timeId);
  reCaptcha.value = '';

  //save data
  var data = new Data(uid, questionNumber, correctness, time);
  database.push(data)
  //next question
  var questionNumber = Number(document.getElementById("number").innerHTML);
  if (questionNumber%text.length == 0) {
    window.localStorage.setItem('database' + questionType, JSON.stringify(database));
    if (part == 1) {
      window.location.href = 'break.html?uid=' + uid + '&captcha=' + questionType
    }
    else {
      window.location.href = 'end.html?uid=' + uid + '&captcha=' + questionType
    }
  }
  TextCreateCAPTCHA()
}

function ImageCreateCAPTCHA() {
  //get variaable question + number
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var questionType = urlParams.get('captcha');
  var question = document.getElementById("question");

  var questionNumber = document.getElementById("number");
  num = Number(questionNumber.innerHTML);
  var object = document.getElementById("object");
  object.innerHTML = "Select all images with " + obj[num]
  //activev captcha
  for (var i = 1; i < 10; i++){
    const activeCaptcha = document.getElementById(String(i));
    activeCaptcha.src="image-based/" + String(i + num*9) + ".jpg";
  }
  questionNumber.innerHTML = String(num + 1);
  //timer
  var timer = document.getElementById("timer");
  var time = timer.innerHTML
  timeId = setInterval(function(){
    time -- ;
    if (time <= 0){
      document.getElementById("submit").click();
    }
    timer.innerText = time/10 }, 100);
}
function Mark(el) {
  if (el.alt == 'unclick') {
    el.style.border = "8px solid green";
    el.alt = 'click';
    select.push(Number(el.id));
  }
  else {
    el.style.removeProperty('border');
    el.alt = 'unclick';
    for( var i = 0; i < select.length; i++){
      if ( select[i] === Number(el.id)) {
        select.splice(i, 1);
      }
    }
  }
}

function ImageValidateCAPTCHA(value) {
  const reCaptcha = select;
  const timer = document.getElementById("timer");
  var questionNumber = document.getElementById("number").innerHTML;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get('uid')
  var questionType = urlParams.get('captcha')
  var part = Number(urlParams.get('part'))

  var correctness = null;
  var time = timer.innerHTML;
  timer.innerHTML = 300;
  if (value == 'Submit'){
    if(JSON.stringify(reCaptcha.sort())==JSON.stringify(image[num].sort())) {
      correctness = "O";
    }
    else {
      correctness = "X";
    }
  }
  else {
    var correctness = "-"
  }
  clearInterval(timeId);
  for (let i = 1; i < 10; i++) {
    document.getElementById(i.toString()).style.removeProperty('border');
    document.getElementById(i.toString()).alt = "unclick";
  }
  select = [];

  //save data
  var data = new Data(uid, questionNumber, correctness, time);
  database.push(data)
  //next question
  var questionNumber = Number(document.getElementById("number").innerHTML);
  if (questionNumber%image.length == 0) {
    window.localStorage.setItem('database' + questionType, JSON.stringify(database));
    if (part == 1) {
      window.location.href = 'break.html?uid=' + uid + '&captcha=' + questionType
    }
    else {
      window.location.href = 'end.html?uid=' + uid + '&captcha=' + questionType
    }
  }
  ImageCreateCAPTCHA();
}

// returns a csv from of array
function CSV(array) {
    // use first element to choose the keys and the order
    var keys = Object.keys(array[0]);
    // build header
    var result = keys.join(",") + "\n";
    // add the rows
    array.forEach(function(obj){
        result += keys.map(k => obj[k]).join(",") + "\n";
    });
    return result;
}
// save file
function DownloadFile() {

  var imageData = JSON.parse(window.localStorage.getItem('databaseImage-Based'));
  var textData = JSON.parse(window.localStorage.getItem('databaseText-Based'));
  const data = imageData.concat(textData)
  var csv = CSV(data)
  //document.write(csv);

  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';

  //provide the name for the CSV file to be downloaded
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var questionType = urlParams.get('captcha');
  const uid = urlParams.get('uid');
  var filename = uid + '_';

  if (questionType == 'Text-Based') {
    filename += 'image-text.csv';
  }
  else {
    filename += 'text-image.csv'
  }
  hiddenElement.download = filename;
  hiddenElement.click();
}

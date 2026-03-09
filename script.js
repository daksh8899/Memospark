let symbols=[];

const easyCards=["🍎","🍎","🍌","🍌","🍒","🍒","🍇","🍇"];

const mediumCards=[
"🍎","🍌","🍒","🍇",
"🍉","🍓","🍎","🍌",
"🍒","🍇","🍉","🍓"
];

const hardCards=[
"🍎","🍌","🍒","🍇",
"🍉","🍓","🍍","🥝",
"🍎","🍌","🍒","🍇",
"🍉","🍓","🍍","🥝"
];

let board=document.getElementById("board");

let firstCard=null;
let secondCard=null;
let lockBoard=false;

let moves=0;
let matches=0;
let time=0;

let timerInterval=null;   // FIX: store timer interval

const movesDisplay=document.getElementById("moves");
const timeDisplay=document.getElementById("time");

function startGame(){

let difficulty=document.getElementById("difficulty").value;

if(difficulty==="easy") symbols=easyCards;
if(difficulty==="medium") symbols=mediumCards;
if(difficulty==="hard") symbols=hardCards;

board.innerHTML="";

moves=0;
matches=0;
time=0;

movesDisplay.textContent=0;
timeDisplay.textContent=0;

clearInterval(timerInterval);  // reset timer

timerInterval=setInterval(()=>{

time++;
timeDisplay.textContent=time;

},1000);

let shuffled=[...symbols].sort(()=>0.5-Math.random());

shuffled.forEach(symbol=>{

let card=document.createElement("div");

card.classList.add("card");

card.innerHTML=`

<div class="card-inner">

<div class="card-front">?</div>

<div class="card-back">${symbol}</div>

</div>

`;

card.dataset.symbol=symbol;

card.addEventListener("click",flipCard);

board.appendChild(card);

});

}

function flipCard(){

if(lockBoard) return;
if(this===firstCard) return;

this.classList.add("flipped");

if(!firstCard){

firstCard=this;
return;

}

secondCard=this;

moves++;
movesDisplay.textContent=moves;

checkMatch();

}

function checkMatch(){

if(firstCard.dataset.symbol===secondCard.dataset.symbol){

matches++;

createParticles(secondCard);

if(matches===symbols.length/2){

winGame();

}

resetTurn();

}else{

lockBoard=true;

setTimeout(()=>{

firstCard.classList.remove("flipped");
secondCard.classList.remove("flipped");

resetTurn();

},800);

}

}

function resetTurn(){

firstCard=null;
secondCard=null;
lockBoard=false;

}

function createParticles(card){

let rect=card.getBoundingClientRect();

for(let i=0;i<12;i++){

let particle=document.createElement("div");

particle.classList.add("particle");

let x=(Math.random()-0.5)*120+"px";
let y=(Math.random()-0.5)*120+"px";

particle.style.left=rect.left+rect.width/2+"px";
particle.style.top=rect.top+rect.height/2+"px";

particle.style.setProperty("--x",x);
particle.style.setProperty("--y",y);

document.body.appendChild(particle);

setTimeout(()=>{

particle.remove();

},800);

}

}

function winGame(){

clearInterval(timerInterval);   // FIX: stop timer when game ends

document.getElementById("winMessage").classList.remove("hidden");

document.getElementById("finalTime").textContent=time;

saveScore(time);

}

function restartGame(){

location.reload();

}

function saveScore(score){

let scores=JSON.parse(localStorage.getItem("leaderboard")) || [];

scores.push(score);

scores.sort((a,b)=>a-b);

scores=scores.slice(0,5);

localStorage.setItem("leaderboard",JSON.stringify(scores));

displayLeaderboard();

}

function displayLeaderboard(){

let scores=JSON.parse(localStorage.getItem("leaderboard")) || [];

let list=document.getElementById("leaderboardList");

list.innerHTML="";

scores.forEach(score=>{

let li=document.createElement("li");

li.textContent=score+" seconds";

list.appendChild(li);

});

}

displayLeaderboard();
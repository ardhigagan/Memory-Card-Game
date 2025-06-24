const landing = document.getElementById('landing');
const gameContainer = document.getElementById('gameContainer');
const startBtn = document.getElementById('startGameBtn');
const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart');

// Sound effects
const matchSound = new Audio('sounds/match.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const winSound = new Audio('sounds/win.mp3');

// Game variables
const logos = ['html', 'css', 'js', 'python', 'java', 'c++', 'c', 'go', 'sql', 'git'];
let cardValues = [...logos, ...logos];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let timer;
let seconds = 0;
let boardLocked = false;

// Start button event
startBtn.addEventListener('click', () => {
  landing.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  startGame();
});

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Score and timer
function updateScore() {
  scoreDisplay.textContent = `Moves: ${moves}`;
}

function updateTimer() {
  seconds++;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  timerDisplay.textContent = `Time: ${mins}:${secs}`;
}

function startTimer() {
  clearInterval(timer);
  seconds = 0;
  timer = setInterval(updateTimer, 1000);
}

// Create card elements
function createCard(value) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.value = value;

  const front = document.createElement('div');
  front.classList.add('front');
  front.textContent = '?';

  const back = document.createElement('div');
  back.classList.add('back');
  const img = document.createElement('img');
  img.src = `./logos/${value}.png`;
  img.alt = value;
  back.appendChild(img);

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

// Handle card click
function handleCardClick(card) {
  if (
    flippedCards.length < 2 &&
    !card.classList.contains('flipped') &&
    !card.classList.contains('matched') &&
    !boardLocked
  ) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      updateScore();
      checkForMatch();
    }
  }
}

// Match check
function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.value === card2.dataset.value) {
    matchSound.play();
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards += 2;
    flippedCards = [];

    // ✅ Check for win
    if (matchedCards === cardValues.length) {
      clearInterval(timer);
      setTimeout(() => {
        winSound.play();
        alert(`🎉 You matched all cards in ${moves} moves!🎉`);
      }, 500);
    }

  } else {
    boardLocked = true;
    setTimeout(() => {
      wrongSound.play();
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      boardLocked = false;
    }, 800);
  }
}


// Game reset
function resetGame() {
  clearInterval(timer);
  gameBoard.innerHTML = '';
  flippedCards = [];
  matchedCards = 0;
  moves = 0;
  cardValues = [...logos, ...logos];
  startGame();
}

restartButton.addEventListener('click', resetGame);

// Start game
function startGame() {
  shuffle(cardValues);
  updateScore();
  timerDisplay.textContent = 'Time: 00:00';
  startTimer();
  gameBoard.innerHTML = '';
  cardValues.forEach(value => {
    const card = createCard(value);
    gameBoard.appendChild(card);
  });
}

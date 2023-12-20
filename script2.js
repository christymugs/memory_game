const pictures = [
    'images/hannah.jpg', 'images/ant.jpg', 'images/phineas.jpg', 'images/jessie.jpg',
    'images/kc.jpg', 'images/wizards.jpg', 'images/girl.jpg', 'images/austin.jpg',
    'images/moana.jpg', 'images/aladdin.jpg', 'images/cars.jpg', 'images/beauty.jpg'
  ];
  
  let selectedPictures = [];
  let timer;
  let seconds;
  let flippedCards = 0;
  let difficultyLevel = 8; 
  let startTime;
  
  function selectDifficulty(level) {
    difficultyLevel = level;
  }
  
  function startGame() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('start-btn').style.display = 'none';
    selectDifficulty(parseInt(prompt('Choose difficulty level (8, 10, or 12):'), 10));
    generateBoard();
    startMemorizationTimer();
  }
  
  function generateBoard() {
    const gameBoard = document.getElementById('game-board');
    const shuffledPictures = shuffleArray(pictures);
  
    selectedPictures = [...shuffledPictures.slice(0, difficultyLevel), ...shuffledPictures.slice(0, difficultyLevel)];
  
    const shuffledSelectedPictures = shuffleArray(selectedPictures);
  
    for (let i = 0; i < shuffledSelectedPictures.length; i++) {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-id', i);
      card.addEventListener('click', flipCard);
  
      const image = document.createElement('img');
      image.src = shuffledSelectedPictures[i];
      image.alt = 'card';
  
      image.style.maxWidth = '100%';
      image.style.maxHeight = '100%';
  
      card.appendChild(image);
  
      gameBoard.appendChild(card);
    }
  }  
  
  function flipCard() {
    if (flippedCards === 2) {
      return;
    }
  
    if (this.classList.contains('flipped') || this.classList.contains('matched')) {
      return;
    }
  
    this.classList.add('flipped');
    const selectedId = this.getAttribute('data-id');
    checkMatch(selectedId);
  }
  
  function checkMatch(selectedId) {
    const cards = document.querySelectorAll('.card');
    const selectedCard = cards[selectedId];
    selectedCard.innerHTML = `<img src="${selectedPictures[selectedId]}" alt="card">`;
  
    flippedCards++;
  
    if (flippedCards === 2) {
      const flipped = document.querySelectorAll('.flipped');
      const [firstCard, secondCard] = flipped;
  
      const firstCardId = firstCard.getAttribute('data-id');
      const secondCardId = secondCard.getAttribute('data-id');
  
      if (selectedPictures[firstCardId] === selectedPictures[secondCardId]) {
        flipped.forEach(card => {
          card.classList.add('matched');
          card.classList.remove('flipped');
        });
        flippedCards = 0;
        checkWin();
      } else {
        setTimeout(() => {
          flipped.forEach(card => {
            card.classList.remove('flipped');
            card.innerHTML = '';
          });
          flippedCards = 0;
        }, 1000);
      }
    }
  }
  
  function startMemorizationTimer() {
    showImagesForMemorization();

    setTimeout(() => {
      hideImages();
      startSolvingTimer();
    }, getMemorizationTime());
  }
  
  function showImagesForMemorization() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      const image = document.createElement('img');
      image.src = selectedPictures[index];
      card.innerHTML = '';
      card.appendChild(image);
    });
  }
  
  function hideImages() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => (card.textContent = ''));
  }
  
  function startSolvingTimer() {
    startTime = Date.now();
    seconds = getTimerSeconds(difficultyLevel);
    timer = setInterval(updateTimer, 1000);
  }
  
  function updateTimer() {
    document.getElementById('timer').textContent = seconds;
    seconds--;
  
    if (seconds < 0) {
      clearInterval(timer);
      alert('Time is up! Game over.');
      resetGame();
    }
  }
  
  function checkWin() {
    const matchedCards = document.querySelectorAll('.matched');
    if (matchedCards.length === selectedPictures.length) {
      clearInterval(timer);
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      
      triggerConfetti();
  
      setTimeout(() => {
        alert(`Congratulations! You solved the puzzle in ${timeTaken} seconds.`);
        resetGame();
      }, 2000);
    }
  }
  
  function triggerConfetti() {
    particlesJS('confetti', {
      particles: {
        number: {
          value: 150,
        },
        size: {
          value: 3,
        },
      },
      interactivity: {
        events: {
          onhover: {
            enable: true,
            mode: 'repulse',
          },
        },
      },
    });
  }
  
  
  function resetGame() {
    document.getElementById('instructions').style.display = 'block';
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('game-board').innerHTML = '';
    document.getElementById('timer').textContent = 0;
  
    const matchedCards = document.querySelectorAll('.matched');
    matchedCards.forEach(card => card.classList.remove('matched'));
  
    flippedCards = 0;
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function getMemorizationTime() {
    switch (difficultyLevel) {
      case 8:
        return 3000;
      case 10:
        return 5000;
      case 12:
        return 8000; 
      default:
        return 3000;
    }
  }
  
  function getTimerSeconds(numPictures) {
    switch (numPictures) {
      case 8:
        return 120;
      case 10:
        return 150;
      case 12:
        return 180;
      default:
        return 120;
    }
  }
  
class Card {
  constructor() {
    this.id = 0;
    this.animalNr = 0;
    this.animalPath = ``;
    this.choice = ``;
  }
  setAnimal(animalNr, choice) {
    this.animalPath = `images${choice === "farm_animals" ? "_2" : ""}/${this.animalNr}.jpg`;
    choice === "farm_animals" ?? this.animalPath;
  }
}

class BlackSquare {
  constructor() {
    this.tileNr = 0;
  }
}

let animalsRandomNumbers = [],
  animalsTab = [],
  curtainTab = [],
  animalPairs = [], // visible clicked 2 pairs animal
  temp = []; // temportary table to comparison 2 animals
let clickerNr = 0;
let myAnimalsChoice = "";

// GENERATOR RANDOM UNIQUE NUMBER for all Animals
randomNumber = () => {
  let temp = [];
  while (animalsRandomNumbers.length < 9) {
    const num = Math.floor(Math.random() * 9);
    if (!animalsRandomNumbers.includes(num)) {
      animalsRandomNumbers.push(num);
      temp.push(num);
    }
  }
  animalsRandomNumbers = animalsRandomNumbers.concat(temp);
};

// SET ANIMALS STRUCTURE IN HTML
setAnimals = () => {
  // create table of animals 'Card'
  animalsRandomNumbers.forEach((el, index) => {
    const animal = new Card();
    animalsTab.push(animal);
    animal.id = index;
    animal.animalNr = el;
    animal.setAnimal("", myAnimalsChoice);
  });
  // fill html animals pictures
  animalsTab.forEach((div) => {
    element = document.createElement("div");
    element.classList.add("tile_animal");
    element.style.backgroundImage = `url(${div.animalPath})`;
    document.querySelector(".animals").appendChild(element);
  });
};

// SET CURTAIN ON ANIMALS
setCurtain = () => {
  animalsRandomNumbers.forEach((index) => {
    const curtainTile = new BlackSquare();
    curtainTile.tileNr = index;
    curtainTab.push(curtainTile);
    // create DOM element
    element = document.createElement("div");
    element.classList.add("tile_hidding");
    element.setAttribute("id", curtainTile.tileNr);
    document.querySelector(".curtain").appendChild(element);
  });
};

// compare selected 2 tiles
comparison = (tab) => {
  clickerNr += 2;
  const curtain = document.querySelector(".curtain");
  curtain.classList.add("noClick");
  if (tab[0].clickId === tab[1].clickId) {
    animalPairs.push(tab[0], tab[1]);
    curtain.classList.remove("noClick");
    if (animalPairs.length === animalsTab.length) showInfo();
  } else {
    setTimeout(() => {
      tab[0].div.style.opacity = 1;
      tab[1].div.style.opacity = 1;
      tab[0].div.classList.remove("noClick");
      tab[1].div.classList.remove("noClick");
      curtain.classList.remove("noClick");
    }, 1000);
  }
  temp = [];
};

// User game time
gameTime = () => {
  const endTime = Date.now();
  const time = Math.floor((endTime - startTime) / 1000);
  return time;
};

// Player choice Farm or Forest animals and start game!
gameButtonHandler = () => {
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const myChoice = e.target.id;
      myChoice === "farm_animals" ? (myAnimalsChoice = myChoice) : (myAnimalsChoice = "forest_animals");
      element.style.visibility = "hidden";
      startTime = new Date().getTime();
      gameStart();
    });
  });
};

// Short info on Start and End game
showInfo = () => {
  element = document.createElement("div");
  document.querySelector(".board_game").appendChild(element);
  if (animalPairs.length === 0) {
    element.classList.add("info");
    element.style.color = "yellow";
    element.innerHTML = `<h2>MEMORY GAME</h2>
    <p>Let's Play!</p></br> 
    <p>Choose animals</p>
    <p><button id="farm_animals">Farm</button>
    <button id="forest_animals">Forest</button> </p>`;
    // Start Game button handler
    gameButtonHandler();
  } else if (animalPairs.length === animalsTab.length) {
    document.querySelector(".animals").style.filter = "blur(8px)";
    element.classList.add("info");
    element.style.color = "yellow";
    element.innerHTML = ` <h2>GAME OVER</h2></br> <p>Congratulations!</p> <p>Your time is ${gameTime()} sec.</p> 
    <p>You only used ${clickerNr} clicks</p>`;
    setTimeout(() => location.reload(), 6000);
  }
};

gameStart = () => {
  randomNumber();
  setAnimals();
  setCurtain();
  document.querySelectorAll("div.tile_hidding").forEach((tile) => {
    tile.addEventListener("click", (e) => {
      let div = e.target;
      const clickId = parseInt(e.target.id);
      temp.push({ clickId, div });
      div.style.opacity = 0;
      div.classList.add("noClick");
      if (temp.length === 2) {
        tile.classList.add("noClick");
        comparison(temp);
        temp = [];
      }
    });
  });
};

showInfo();

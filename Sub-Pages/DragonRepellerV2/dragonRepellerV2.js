
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["fists"];

const text = document.querySelector(".text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const levelText = document.querySelector("levelText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: 'fists', power: 5 },
  { name: 'wooden sword', power: 15},
  { name: 'dagger', power: 30 },
  { name: 'javelin', power: 50 },
  { name: 'sword', power: 100 },
  { name: '2h sword', power: 150 },
];

/*Leveling
let currentXp = 0;
let earnedXp = 0;
let nextLevel;
let previousLevel;
const level0 = currentXp("25");
const level1 = currentXp("50");
function calculateProgress(currentXp, nextLevel){
  return(curentXp-previousLevel) / (nextLevel - previousLevel) * 100;
}*/

/*Locations*/
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave"],
    "button functions": [goStore, goCave],
    text: "You are in the town square. You see a sign that says \"Store\".",
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Leave Store"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."

  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Return to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Fight Another", "Go to town square", "Go to town square"],
    "button functions": [goCave, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["Start Over"],
    "button functions": [restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?"], 
    "button functions": [restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
const button1 = document.querySelector('#button1');
button1.onclick = goStore;
const button2 = document.querySelector("#button2");
button2.onclick = goCave;
const button3 = document.querySelector("#button3");
button3.onclick = fightYoungDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
  }

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

/*Store Functions*/
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}
function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}
/*Monsters*/
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "young dragon",
    level: 20,
    health: 300
  }
]
/*Monster Functions*/
function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 0.5;
  goFight();
}

function fightYoungDragon() {
  fighting = 1.5;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

/*Battle Engagement*/
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * currentXp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  currentCp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = currentXp;
  update(locations[4]);
}

/*Game Over*/
function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  currentXp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["fists"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = currentXp;
  levelText.innerText = levelXp;
  goTown();
}
/*Easter Egg for Random Chance*/
function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
/*Inventory*/
function inventoryBody(){
  let inventoryBody = document.querySelector("#inventoryBody");
  inventoryBody.innerText = inventory.name;
}
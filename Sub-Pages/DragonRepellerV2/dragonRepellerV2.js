/* Initial Variables */
let fighting;
let monsterHealth;
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

/* Current State */
let startingState = {
  xp: 0,
  health: 100,
  gold: 50,
  currentWeapon: 0,
  inventory: ["stick"],
  locationId: 1
}

let player = {};
Object.assign(player, startingState);

const buttons = [
{
  buttonId: 1,
  buttonText: "Go to Store",
  buttonFunction: goStore,
},
{
  buttonId: 2,
  buttonText: "Go to Cave",
  buttonFunction: goCave,
},
{
  buttonId: 3,
  buttonText: "Fight Dragon",
  buttonFunction: fightDragon,
},
{
  buttonId: 4,
  buttonText: "Buy Health",
  buttonFunction: buyHealth,
},
{
  buttonId: 5,
  buttonText: "Buy Weapon",
  buttonFunction: buyWeapon
},
{
  buttonId: 6,
  buttonText: "Go to Town",
  buttonFunction: goTown
}
];

/* Weapons */
const weapons = [
  { name: 'fists', power: 5 },
  { name: 'wooden sword', power: 15},
  { name: 'bronze sword', power: 30 },
  { name: 'iron sword', power: 50 },
  { name: 'steel sword', power: 75 },
  { name: 'rainbow sword', power: 100}
];

/* Monsters */
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
    fightingMultiplier: 0,
    attackValue: function() {
      const hit = (this.level * 5) - (Math.floor(Math.random() * this.level));
      console.log(hit);
      return hit > 0 ? hit : 0;
    },
    isMonsterHit: function() {
      return Math.random() > .2 || health < 20;
    }
  },
  {
    name: "goblin",
    level: 5,
    health: 75,
    fightingMultiplier: 1.5,
    attackValue: function() {
      const hit = (this.level * 5) - (Math.floor(Math.random() * this.level));
      console.log(hit);
      return hit > 0 ? hit : 0;
    }
  },
  {
    name: "werewolf",
    level: 8,
    health: 60,
    fightingMultiplier: 1,
    attackValue: function() {
      const hit = (this.level * 5) - (Math.floor(Math.random() * this.level));
      console.log(hit);
      return hit > 0 ? hit : 0;
    },
    isMonsterHit: function() {
      return Math.random() > .2 || this.health < 20;
    }
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
    fightingMultiplier: 2,
    attackValue: function() {
      const hit = (this.level * 5) - (Math.floor(Math.random() * this.level));
      console.log(hit);
      return hit > 0 ? hit : 0;
    },
    isMonsterHit: function() {
      return Math.random() > .2 || this.health < 20;
    }
  }
]

/* Locations */
const locations = [
  {
    name: "town square",
    locationId: 1,
    availableButtons: [1, 2],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    locationId: 2,
    availableButtons: [4, 5, 6],
    text: "You enter the store."
  },
  {
    name: "cave",
    locationId: 4,
    availableButtons: ["Fight slime", "Fight fanged beast", "Go to town square"],
    buttonFunctions: [monsters[0], monster[1], locations[0]],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    locationId: 5,
    buttonText: ["Attack", "Dodge", "Run"],
    buttonFunctions: [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    locationId: 6,
    buttonText: ["Go to town square", "Go to town square", "Go to town square"],
    buttonFunctions: [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    locationId: 7,
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"],
    buttonFunctions: [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    locationId: 8,
    buttonText: ["REPLAY?", "REPLAY?", "REPLAY?"], 
    buttonFunctions: [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    locationId: 9,
    buttonText: ["2", "8", "Go to town square?"],
    buttonFunctions: [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

/* Location Updates */
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location[button1.dataset.id].text;
  button2.innerText = location.buttonText[1];
  button3.innerText = location.buttonText[2];
  button1.onclick = location.buttonFunctions[0];
  button2.onclick = location.buttonFunctions[1];
  button3.onclick = location.buttonFunctions[2];
  text.innerHTML = location.text;
}

/* Travel Functions */
let travel = {
  toTown: function() {
    update(locations[0]);
  },
  toStore: function() {
    update(locations[1]);
  },
  toCave: function() {
    update(locations[2]);
  }
}

/* Player Actions */
let fight = {
  goFight: function (monsterId) {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
  },
  attack: function() {
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
  },
  dodge: function() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
  },
  defeatMonster: function() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
  }
}

/* Initialize Buttons */
button1.onclick = travel.toStore;
button2.onclick = travel.toCave;
button3.onclick = fight.goFight;

/* Shop Options */
let storeActions = {
  buyHealth: function() {
    if (gold >= 10) {
      gold -= 10;
      health += 10;
      goldText.innerText = gold;
      healthText.innerText = health;
    } else {
      text.innerText = "You do not have enough gold to buy health.";
    }
  },
  buyWeapon: function() {
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
  },
  sellWeapon: function() {
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
}

/*Game Actions*/
let gameActions = {
  
 lose: function() {
  update(locations[5]);
},
winGame: function() {
  update(locations[6]);
},
  restart: function() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}
}

/* Easter Egg */
let easterEggTrigger = {
  easterEgg: function() {
    update(locations[7]);
  },
  pickTwo: function() {
    pick(2);
  },
  pickEight: function() {
    pick(8);
  },
  pick: function(guess) {
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
}

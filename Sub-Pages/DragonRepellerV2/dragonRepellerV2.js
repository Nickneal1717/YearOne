/* Initial Variables */
let fighting;
let monsterHealth;
let currentLocation = document.querySelector(".currentLocation");
let dialogText = document.querySelector(".dialogText");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector(".monsterStats");
const monsterName = document.querySelector("#monsterName");
const monterLevel = document.querySelector("#monsterLevel");
const monsterHealthText = document.querySelector("#monsterHealth");
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");

/* Travel Functions */
let travel = {
  toStore: function() {
    update(locations[0]);
  },
  toCave: function() {
    update(locations[1]);
  },
  toTown: function() {
    update(locations[2]);
  }
}

/* Shop Options */
let storeActions = {
  buyHealth: function() {
    if (gold >= 10) {
      gold -= 10;
      health += 10;
      goldText.innerText = gold;
      healthText.innerText = health;
    } else {
      dialogText.innerText = "You do not have enough gold to buy health.";
    }
  },
  buyWeapon: function() {
    if (currentWeapon < weapons.length - 1) {
      if (gold >= 30) {
        gold -= 30;
        currentWeapon++;
        goldText.innerText = gold;
        let newWeapon = weapons[currentWeapon].name;
        dialogText.innerText = "You now have a " + newWeapon + ".";
        inventory.push(newWeapon);
        dialogText.innerText += " In your inventory you have: " + inventory;
      } else {
        dialogText.innerText = "You do not have enough gold to buy a weapon.";
      }
    } else {
      dialogText.innerText = "You already have the most powerful weapon!";
      button2.innerText = "Sell weapon for 15 gold";
      button2.onclick = sellWeapon;
    }
  },
  sellWeapon: function() {
    if (inventory.length > 1) {
      gold += 15;
      goldText.innerText = gold;
      let currentWeapon = inventory.shift();
      dialogText.innerText = "You sold a " + currentWeapon + ".";
      dialogText.innerText += " In your inventory you have: " + inventory;
    } else {
      dialogText.innerText = "Don't sell your only weapon!";
    }
  }
}


availableButtons = [
{
  buttonId: 4,
  buttonText: "Buy Health",
  buttonFunction: storeActions.buyHealth,
},
{
  buttonId: 5,
  buttonText: "Buy Weapon",
  buttonFunction: storeActions.buyWeapon
}
]


/* Weapons */
const weapons = [
  { name: 'fists', power: 5 },
  { name: 'wooden sword', power: 15},
  { name: 'bronze sword', power: 30 },
  { name: 'iron sword', power: 50 },
  { name: 'steel sword', power: 75 },
  { name: 'rainbow sword', power: 100}
]

/* Current State */
let startingState = {
  xp: xpText,
  health: healthText,
  gold: goldText,
  currentWeapon: 0,
  inventory: [weapons[0]],
}

let player = {};
Object.assign(player, startingState)

/* Battle Actions */
let fight = {
  goFight: function (monsterId) {
    update(battle[0]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
    button3.display.style = "none"
  },
  attack: function() {
    dialogText.innerText = "The " + monsters[fighting].name + " attacks.";
    dialogText.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
      monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
    } else {
      dialogText.innerText += " You miss.";
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
    /*if (Math.random() <= .1 && inventory.length !== 1) {
    dialogText.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
    }*/
  },
  defeatMonster: function() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    button2.display.style = "none",
    update(battle[1]);
  }
}

/* Monsters */
const monsters = [
  {
    name: "giant rat",
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
    locationId: 0,
    locationName: "store",
    buttonText: ["Go to Town"],
    buttonFunction: travel.toStore,
    dialogText: "You enter the store.",
  },
  {
    locationId: 1,
    locationName: "town square",
    buttonText: ["Go to Shop","Go to Cave"],
    buttonFunction: [travel.toTown, travel.toCave],
    dialogText: "You are in the town square. To your left you see a building with a sign that says \"Store\". To you right you see a sign post that says \"Cave\".",
  },
  {
    locationId: 2,
    name: "cave",
    buttonText: ["Fight slime", "Fight goblin", "Go to Town"],
    buttonFunction: [monsters[0], monsters[1], travel.toTown],
    dialogText: "You enter the cave. You see monster everywhere. You will need to choose a starting point for your quest.",
  }
]

/* Initialize Buttons */
button1.onclick = travel.toStore;
button2.onclick = travel.toCave;
button3.onclick = fight.goFight;

/* Location Updates */
function update(updateLocation) {
  monsterStatsContainer.style.display = "none";
  button1.innerText = updateLocation["buttonText"][0];
  button2.innerText = updateLocation["buttonText"][1];
  button3.innerText = updateLocation["buttonText"][2];
  button1.onclick = updateLocation["buttonFunction"][0];
  button2.onclick = updateLocation["buttonFunction"][1];
  button3.onclick = updateLocation["buttonFunction"][2];
  dialogText.innerHTML = updateLocation["dialogText"];
}

/*Game Actions*/
let gameActions = {
  
  lose: function() {
   update(battle[2]);
 },
 winGame: function() {
   update(battle[3]);
 },
   restart: function() {
    Object.assign(player, startingState)
 }
 }

 /* Easter Egg */
let easterEggTrigger = {
  easterEgg: function() {
    update(battle[4]);
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
      dialogText.innerText += numbers[i] + "\n";
    }
    if (numbers.includes(guess)) {
      dialogText.innerText += "Right! You win 20 gold!";
      gold += 20;
      goldText.innerText = gold;
    } else {
      dialogText.innerText += "Wrong! You lose 10 health!";
      health -= 10;
      healthText.innerText = health;
      if (health <= 0) {
        lose();
      }
    }
  }
}



/* Battle */
const battle = [
  {
    name: "fight",
    buttonText: ["Attack", "Run"],
    buttonFunctions: [fight.attack, travel.toTown],
    text: `You are fighting a ${monsters.name}.`
  },
  {
    name: "kill monster",
    buttonText: ["Go to town square"],
    buttonFunctions: [travel.toTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    buttonText: ["REPLAY?"],
    buttonFunctions: [gameActions.restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    buttonText: ["REPLAY?"], 
    buttonFunctions: [gameActions.restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  /*{
    name: "easter egg",
    buttonText: ["2", "8", "Go to town square?"],
    buttonFunctions: [easterEggTrigger.pickTwo, easterEggTrigger.pickEight, travel.toTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }*/
]


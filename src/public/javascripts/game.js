// vikas was here!

function startGame() {
	drawBoard();

	const gameDiv = document.getElementById('game');
	const introDiv = document.getElementById('intro');
	const input = document.getElementById('diceValues');
	const goButton = introDiv.getElementsByTagName('button')[0];
	const startButton = document.getElementById('start');
	const rollButton = document.getElementById('roll');
	const pinButton = document.getElementById('pin');
	const closeButton = document.getElementsByClassName('closeButton')[0];

	const inputDice = getInputDice(input);
	let playerDice = Array(5);
	const playerSelected = Array(playerDice.length).fill(false);

	goButton.addEventListener('click', () => {
		introDiv.classList.add('hidden');
		gameDiv.classList.remove('hidden');
	});

	startButton.addEventListener('click', () => {
		rollButton.disabled = false;
		startButton.disabled = true;

		setupGame(inputDice);
	});

	rollButton.addEventListener('click', () => {
		rollButton.disabled = true;
		pinButton.disabled = false;
		playerRoll(inputDice, playerSelected, playerDice);
	});

	pinButton.addEventListener('click', () => {
		pinButton.disabled = true;
		rollButton.disabled = false;
		playerPin(playerSelected, playerDice);
	});

	closeButton.addEventListener('click', () => {
		toggleError();
	});
}

function playerRoll(inputDice, playerSelected, playerDice) {
	const numUnpinned = playerSelected.reduce((sum, selected) => {
		return selected ? sum : sum + 1;
	}, 0);

	for (let i = 0; i < 5; i++) {
		if (!playerSelected[i]) {
			playerDice[i] = rollDie();
		}
	}

	console.log(playerDice);
	updateBoard(playerDice, playerSelected);
}

function playerPin(playerSelected, playerDice) {
	const diceDiv = document.getElementById('dice');
	let numPinned = 0;
	
	diceDiv.childNodes.forEach((dieDiv, i) => {
		if (dieDiv.classList.contains('pinned') && !dieDiv.classList.contains('fixed')) {
			playerSelected[i] = true;
			dieDiv.classList.add('fixed');
			numPinned += 1;
		}
	});

	if (numPinned == 0) {
		toggleError(); // TODO: Implement error handling
		
		const rollButton = document.getElementById('roll');
		const pinButton = document.getElementById('pin');
		rollButton.disabled = true;
		pinButton.disabled = false;
	} else {
		const playerScore = playerDice.reduce((sum, value, i) => {
			return playerSelected[i] ? (value === 3 ? sum : sum + value) : sum;
		}, 0);

		diceDiv.childNodes.forEach((dieDiv, i) => {
			if (!dieDiv.classList.contains('pinned')) {
				dieDiv.textContent = '';
			}
		});

		updatePlayerScore(playerSelected, playerDice, playerScore);
	}
}

function updateBoard(playerDice, playerSelected) {
	for (let i = 0; i < 5; i++) {
		const dieDiv = document.getElementById(`die${i}`);
		dieDiv.textContent = String(playerDice[i]);
	}
}

function updatePlayerScore(playerSelected, playerDice, playerScore) {
	const playerScoreDiv = document.getElementById('playerScore');
	playerScoreDiv.textContent = `You: [${playerDice.filter((die, i) => { return playerSelected[i] })}] = ${playerScore}`;
}

function updateComputerScore(computerSelected, computerScore) {
	const computerScoreDiv = document.getElementById('computerScore');
	computerScoreDiv.textContent = `Computer: [${computerSelected}] = ${computerScore}`;

}

// function playerMove(inputDice, playerDice, playerSelected) {
// 	let unpinned = 0;

// 	for (let key in playerSelected) {
// 		if (!playerSelected[key]) {
// 			delete playerSelected[key];
// 			unpinned += 1;
// 		}
// 	}

// 	const roll = rollDice(inputDice, unpinned);

// 	roll.forEach(die => {
// 		playerSelected[die] = false;
// 	});

// 	// return playerScore;
// }

function setupGame(inputDice) {
	const computerSelected = [];
	const computerScore = computerMove(inputDice, computerSelected);
	updateComputerScore(computerSelected, computerScore);
}

function computerMove(inputDice, computerSelected) {
	let computerDice = rollDice(inputDice, 5);

	while (computerDice.length > 0) {
		const selected = computerDice.includes(3) ?
			computerDice.splice(computerDice.indexOf(3), 1)[0] : computerDice.splice(computerDice.indexOf(Math.min(...computerDice)), 1)[0];
		computerSelected.push(selected);
		computerDice = rollDice(inputDice, computerDice.length);
	}

	const computerScore = computerSelected.reduce((sum, value) => {
		return value === 3 ? sum : sum + value;
	}, 0);

	return computerScore;
}

function rollDice(inputDice, amount) {
	let dice = [];

	if (inputDice && inputDice.length > 0) {
		if (inputDice.length < amount) {
			dice.push(...inputDice.splice(0, inputDice.length));
		} else {
			dice.push(...inputDice.splice(0, amount));
		}
	}

	if (dice.length == amount) {
		return dice;
	}

	for (let i = dice.length; i < amount; i++) {
		dice.push(rollDie());
	}

	return dice;
}

function rollDie() {
	return Math.floor(Math.random() * 6) + 1;
}

function getInputDice(input) {
	return input.value ? input.value.split(',').map(value => { return Number(value) }) : [];
}

function drawBoard() {

	// create dice blocks

	const gameDiv = document.getElementById('game');
	const diceDiv = document.createElement('div');
	diceDiv.id = 'dice';

	for (let i = 0; i < 5; i++) {
		const dieDiv = document.createElement('div');
		dieDiv.id = `die${i}`;
		dieDiv.classList.add('die');
		dieDiv.style.border = 'medium solid black'

		dieDiv.addEventListener('click', () => {
			const startButton = document.getElementById('start');
			const rollButton = document.getElementById('roll');

			if (startButton.disabled && rollButton.disabled && !dieDiv.classList.contains('fixed')) {
				dieDiv.classList.toggle('pinned');
			} else {
				toggleError(); // TODO: implement error handling
			}
		});

		diceDiv.appendChild(dieDiv);
	}

	gameDiv.appendChild(diceDiv);

	// create buttons

	const buttonsDiv = document.createElement('div');
	buttonsDiv.id = 'buttons';

	const startButton = document.createElement('button');
	startButton.textContent = 'Start';
	startButton.id = 'start';
	buttonsDiv.appendChild(startButton);

	const rollButton = document.createElement('button');
	rollButton.textContent = 'Roll';
	rollButton.id = 'roll';
	rollButton.disabled = true;
	buttonsDiv.appendChild(rollButton);

	const pinButton = document.createElement('button');
	pinButton.textContent = 'Pin';
	pinButton.id = 'pin';
	pinButton.disabled = true;
	buttonsDiv.appendChild(pinButton);

	gameDiv.appendChild(buttonsDiv);

	// create scores

	const scoresDiv = document.createElement('div');
	scoresDiv.id = 'scores';

	const computerScore = document.createElement('p');
	computerScore.id = 'computerScore';
	scoresDiv.appendChild(computerScore);

	const playerScore = document.createElement('p');
	playerScore.id = 'playerScore';
	scoresDiv.appendChild(playerScore);

	gameDiv.appendChild(scoresDiv);
}

function toggleError() {
	const errorDiv = document.getElementById('error-message')
	errorDiv.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', (event) => { 
	toggleError();
	startGame();
});
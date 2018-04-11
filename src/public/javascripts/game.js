// vikas was here!

function startGame() {
	drawBoard();

	const gameDiv = document.getElementById('game');
	const introDiv = document.getElementById('intro');
	const input = document.getElementById('diceValues');
	const goButton = introDiv.getElementsByTagName('button')[0];
	const startButton = document.getElementById('start');

	goButton.addEventListener('click', () => {
		introDiv.classList.add('hidden');
		gameDiv.classList.remove('hidden');
	});

	startButton.addEventListener('click', () => {
		const rollButton = document.getElementById('roll');
		rollButton.disabled = false;
		startButton.disabled = true;

		const inputDice = getInputDice(input);

		playGame(inputDice);
	});
}

function playGame(inputDice, playerSelected = [], computerSelected = []) {
	const computerDice = rollDice(inputDice, 5);
	const computerScore = computerMove(inputDice, computerDice, computerSelected);

	const playerDice = rollDice(inputDice, 5);
	const playerScore = playerSelected.reduce((sum, value) => {
		return value === 3 ? sum : value + sum;
	}, 0);

	updateScore(playerSelected, computerSelected, playerScore, computerScore);
}

function computerMove(inputDice, computerDice, computerSelected) {
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

function updateScore(playerSelected, computerSelected, playerScore, computerScore) {
	const computerScoreDiv = document.getElementById('computerScore');
	const playerScoreDiv = document.getElementById('playerScore');

	computerScoreDiv.textContent = `Computer: [${computerSelected}] = ${computerScore}`;
	playerScoreDiv.textContent = `You: [${playerSelected}] = ${playerScore}`;
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

	console.log(dice);

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
	return input.value.split(',').map(value => { return Number(value) });
}

function drawBoard() {

	// create dice blocks

	const gameDiv = document.getElementById('game');
	const diceDiv = document.createElement('div');
	diceDiv.id = 'dice';

	for (let i = 0; i < 5; i++) {
		const dieDiv = document.createElement('div');
		dieDiv.classList.add('die');
		dieDiv.style.border = 'medium solid black'
		diceDiv.appendChild(dieDiv);
	}

	gameDiv.appendChild(diceDiv);

	// create buttons

	const buttonsDiv = document.createElement('div');
	buttonsDiv.id = 'buttons';

	const startButtonDiv = document.createElement('button');
	startButtonDiv.textContent = 'Start';
	startButtonDiv.id = 'start';
	buttonsDiv.appendChild(startButtonDiv);

	const rollButtonDiv = document.createElement('button');
	rollButtonDiv.textContent = 'Roll';
	rollButtonDiv.id = 'roll';
	rollButtonDiv.disabled = true;
	buttonsDiv.appendChild(rollButtonDiv);

	const pinButtonDiv = document.createElement('button');
	pinButtonDiv.textContent = 'Pin';
	pinButtonDiv.id = 'pin';
	pinButtonDiv.disabled = true;
	buttonsDiv.appendChild(pinButtonDiv);

	gameDiv.appendChild(buttonsDiv);

	// create scores

	const scoresDiv = document.createElement('div');
	scoresDiv.id = 'scores';

	const computerScoreDiv = document.createElement('p');
	computerScoreDiv.id = 'computerScore';
	scoresDiv.appendChild(computerScoreDiv);

	const playerScoreDiv = document.createElement('p');
	playerScoreDiv.id = 'playerScore';
	scoresDiv.appendChild(playerScoreDiv);

	gameDiv.appendChild(scoresDiv);
}

function handleError() {
	const errorDiv = document.getElementById('error-message')
	errorDiv.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', (event) => { 
	handleError();
	startGame();
});
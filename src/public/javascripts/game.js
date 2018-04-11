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
		
		const dice = getInitialDice(input);
		console.log(dice);
	});

	startButton.addEventListener('click', () => {

	});


}

function handleError() {
	const errorDiv = document.getElementById('error-message')
	errorDiv.classList.add('hidden');
}

function getInitialDice(input) {
	let dice = [];

	if (!input.value) {
		dice = rollDice(5);
	} else {
		const rawValues = input.value.split(',').map(value => { return Number(value) });

		while (rawValues.length > 0) {
			dice.push(rawValues.splice(0, 5));
		}

		if (dice[dice.length - 1].length < 5) {
			dice[dice.length - 1].push.apply(dice[dice.length - 1], rollDice(5 - dice[dice.length - 1].length));
		}
	}

	return dice;
}

function rollDice(amount) {
	const dice = [];

	for (let i = 0; i < amount; i++) {
		dice.push(rollDie());
	}

	return dice;
}

function rollDie() {
	return Math.floor(Math.random() * 6) + 1;
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
}

document.addEventListener('DOMContentLoaded', (event) => { 
	handleError();
	startGame();
});
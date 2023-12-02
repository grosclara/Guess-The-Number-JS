// @ts-nocheck
import "./style.css";

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1));
};

class Game {
  constructor(min, max) {
    this.min = min;
    this.max = max;
    this.targetNumber = getRandomNumber(this.min, this.max);
    this.score = 0;
  }

  init() {
    this.gameContainer = document.querySelector("#game-container");
    this.gameContainer.classList.remove("hidden");

    this.form = document.querySelector("#guess-form");
    this.form.addEventListener("submit", (e) => this.submitGuess(e));

    this.restartButton = document.querySelector("#restart");
    this.restartButton.addEventListener("click", () => this.restart());

    this.attempts = document.querySelector("#attempts");
    this.message = document.querySelector("#message");
    this.scoreText = document.querySelector("#score");

    this.start();
  }

  submitGuess(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const guess = new FormData(form).get("guess");

    if (!this.validateGuess(guess)) {
      this.message.innerHTML = `❌ Invalid guess, you should enter a number between ${this.min} and ${this.max}!`;
      this.message.classList.remove("invisible");

      this.resetForm();
      return;
    }

    this.updateScore();
    this.updateBar(Number(guess));

    this.compareNumberWithTarget(Number(guess));
  }

  start() {
    this.targetNumber = getRandomNumber(this.min, this.max);
    console.log("Target number: ", this.targetNumber);

    this.resetScore();
  }

  restart() {
    this.resetForm();
    this.resetAttempts();

    this.message.classList.add("invisible");
    this.restartButton.classList.add("invisible");

    this.start();
  }

  compareNumberWithTarget(number) {
    if (number !== this.targetNumber) {
      this.message.innerHTML = `🔴 My number is ${
        number > this.targetNumber ? "below" : "over"
      } ${number}.`;
      this.message.classList.remove("invisible");

      this.form.reset();
      return;
    }

    this.message.innerHTML = `🟢 You found my secret number in ${this.score} attempts! It's ${this.targetNumber}! 🥳`;
    this.message.classList.remove("invisible");

    this.form.lastElementChild.setAttribute("disabled", "");

    this.restartButton.classList.remove("invisible");
  }

  validateGuess(value) {
    return value && !Number.isNaN(value) && value >= 0 && value <= 500;
  }

  resetAttempts() {
    while (this.attempts.hasChildNodes())
      this.attempts.removeChild(this.attempts.firstChild);
  }

  resetForm() {
    this.form.reset();
    this.form.lastElementChild.removeAttribute("disabled");
  }

  resetScore() {
    this.score = 0;
    this.scoreText.innerHTML = `Score: ${this.score}`;
  }

  updateScore() {
    this.score++;
    this.scoreText.innerHTML = `Score: ${this.score}`;
  }

  updateBar(number) {
    const attempt = document.createElement("p");
    attempt.append(`${number !== this.targetNumber ? "❌" : "🟢"}`);
    attempt.classList.add("absolute", "min-w-min");

    this.attempts.appendChild(attempt);
    attempt.style.left = `${
      ((number - attempt.offsetWidth / 2) / this.max) * 100
    }%`;
  }
}

const game = new Game(0, 500);

const startGame = () => {
  const startContainer = document.querySelector("#start-container");
  startContainer.classList.add("hidden");

  game.init();
};

const startButton = document.querySelector("#start");
startButton.addEventListener("click", startGame);

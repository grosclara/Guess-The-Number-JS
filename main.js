// @ts-nocheck
import "./style.css";

class Game {
  constructor() {
    this.targetNumber = null;
    this.score = null;
  }

  init() {
    this.gameContainer = document.querySelector("#game");

    // Attach events
    this.form = document.querySelector("#form");
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = new FormData(e.currentTarget).get("number");
      this.onSubmit(value);
    });
    this.replayButton = document.querySelector("#replay");
    this.replayButton.addEventListener("click", () => this.onReplay());
    this.bar = document.querySelector("#bar");
    this.result = document.querySelector("#answer");

    this.showGame();
    this.play();
  }

  showGame() {
    this.startButton = document.querySelector("#start");
    this.startButton.addEventListener("click", () => {
      document.querySelector("#welcome").classList.add("hidden");
      this.gameContainer.classList.remove("hidden");
    });
  }

  play() {
    this.resetTargetNumber();
    this.resetScore();
  }

  endGame() {
    this.result.innerHTML = `🟢 You found my secret number in ${this.score} attempts! It's ${this.targetNumber}! 🥳`;

    Array.from(this.form.firstElementChild.children).forEach((formElement) => {
      formElement.setAttribute("disabled", "");
    });

    this.replayButton.classList.remove("hidden");
  }

  onSubmit(value) {
    this.warningMsg = document.querySelector("#warning");
    if (this.warningMsg.classList.contains("text-red-500"))
      this.warningMsg.classList.replace("text-red-500", "text-gray-500");

    if (!this.validateInput(value)) {
      this.warningMsg.classList.replace("text-gray-500", "text-red-500");
      console.log(this.warningMsg);
      this.resetForm();
      return;
    }

    this.updateScore();
    this.updateBar(Number(value));

    this.compareNumberWithTarget(Number(value));
  }

  onReplay() {
    this.resetForm();
    this.resetBar();

    this.result.classList.add("invisible");
    this.replayButton.classList.add("hidden");

    this.play();
  }

  compareNumberWithTarget(number) {
    this.result.classList.remove("invisible");

    if (number !== this.targetNumber) {
      this.result.innerHTML = `🔴 My number is ${
        number > this.targetNumber ? "below" : "over"
      } ${number}.`;
      this.form.reset();
      return;
    }

    this.endGame();
  }

  validateInput(value) {
    return value && !Number.isNaN(value) && value >= 0 && value <= 500;
  }

  resetTargetNumber() {
    this.targetNumber = Math.floor(Math.random() * (500 + 1));
    console.log("Target number: ", this.targetNumber);
  }

  resetBar() {
    while (this.bar.hasChildNodes()) this.bar.removeChild(this.bar.firstChild);
  }

  resetForm() {
    this.form.reset();
    Array.from(this.form.firstElementChild.children).forEach((formElement) => {
      formElement.removeAttribute("disabled", "");
    });
  }

  resetScore() {
    this.score = 0;
    const scoreSpan = document.querySelector("#score");
    scoreSpan.innerHTML = `Score: ${this.score}`;
  }

  updateScore() {
    this.score++;
    const scoreSpan = document.querySelector("#score");
    scoreSpan.innerHTML = `Score: ${this.score}`;
  }

  updateBar(number) {
    const pin = document.createElement("p");
    pin.append(`${number !== this.targetNumber ? "❌" : "🟢"}`);
    pin.classList.add("absolute");

    this.bar.appendChild(pin);
    pin.style.left = `${((number - pin.offsetWidth / 2) / 500) * 100}%`;
  }
}

const game = new Game();
game.init();

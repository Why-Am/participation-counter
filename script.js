const nameInput = document.querySelector("#name-input");
const generateButton = document.querySelector("#generate-button");
const leftBottom = document.querySelector("#left-bottom");
const pauseNextInLineButton = document.querySelector(
    "#pause-next-in-line-button"
);
const mainContent = document.querySelector("#main-content");

class Card {
    constructor(name, index, count = 0) {
        this.name = name;
        this.count = count;
        this.index = index;

        this.nameElement = document.createElement("h2");
        this.nameElement.textContent = this.name;

        this.countElement = document.createElement("div");
        this.countElement.textContent = this.count;

        this.subtractButton = document.createElement("button");
        this.subtractButton.textContent = "-";
        this.subtractButton.setAttribute("class", "subtract-button");

        this.cardElement = document.createElement("div");
        this.cardElement.setAttribute("class", "card");
        this.cardElement.appendChild(this.nameElement);
        this.cardElement.appendChild(this.countElement);
        this.cardElement.appendChild(this.subtractButton);

        this.cardElement.addEventListener("click", (e) => {
            switch (e.target.getAttribute("class")) {
                case "subtract-button":
                    this.decrementCount();
                    break;
                default:
                    this.incrementCount();
            }
        });

        mainContent.appendChild(this.cardElement);
    }

    incrementCount() {
        ++this.count;
        this.countElement.textContent = this.count;

        if (nextInLineOn) cards[nextIndex].unhighlight();
        setNextIndex(this.index + 1);
        if (nextInLineOn) cards[nextIndex].highlight();

        updateLocalStorage();
    }

    decrementCount() {
        if (this.count > 0) {
            --this.count;
            this.countElement.textContent = this.count;
            updateLocalStorage();
        }
    }

    highlight() {
        this.cardElement.classList.add("highlight");
    }

    unhighlight() {
        this.cardElement.classList.remove("highlight");
    }

    resetCount() {
        this.count = 0;
        this.countElement.textContent = this.count;
    }

    pause() {
        this.cardElement.classList.add("highlight-paused");
    }

    unpause() {
        this.cardElement.classList.remove("highlight-paused");
    }
}

function updateLocalStorage() {
    const formattedCards = cards.map((card) => ({
        name: card.name,
        count: card.count,
        index: card.index,
    }));

    const data = {
        cards: formattedCards,
        nextInLineOn,
        nextIndex,
        nextInLinePaused,
    };

    localStorage.clear();
    localStorage.setItem("data", JSON.stringify(data));
}

function tryLoadLocalStorage() {
    if (localStorage.getItem("data") === null) {
        cards = [];
        nextInLinePaused = false;
        nextInLineOn = true;
        nextIndex = 0;
    } else {
        // Load stored data
        const data = JSON.parse(localStorage.getItem("data"));
        cards = data.cards.map(
            (card) => new Card(card.name, card.index, card.count)
        );
        nextIndex = data.nextIndex;
        setNextInLineOnTo(data.nextInLineOn);
        setNextInLinePausedTo(data.nextInLinePaused);
    }
}

function generateCards() {
    mainContent.textContent = "";
    cards = [];

    names = nameInput.value.trim().split("\n");

    for (let i = 0; i < names.length; ++i) {
        if (names[i] === "") continue;

        cards.push(new Card(names[i], i));
    }

    nextIndex = 0;
    setNextInLineOnTo(nextInLineOn);
    updateLocalStorage();
}

function setNextInLineOnTo(value) {
    nextInLineOn = value;
    pauseNextInLineButton.disabled = !nextInLineOn;
    if (value) {
        for (let card of cards) {
            if (nextIndex === card.index) {
                card.highlight();
            } else {
                card.unhighlight();
            }
        }
    } else {
        for (let card of cards) {
            card.unhighlight();
        }
    }
    updateLocalStorage();
}

function toggleNextInLine() {
    setNextInLineOnTo(!nextInLineOn);
}

function resetCounters() {
    for (let card of cards) {
        card.resetCount();
    }
}

function delegateLeftBottomButtons(e) {
    switch (e.target.id) {
        case "pause-next-in-line-button":
            togglePauseNextInLine();
            break;
        case "toggle-next-in-line-button":
            toggleNextInLine();
            updateLocalStorage();
            break;
        case "reset-counters-button":
            resetCounters();
            break;
        case "clear-local-storage-button":
            localStorage.clear();
            alert(
                "Local storage cleared.\nNote: if this wasn't intentional, just modify a card and it will re-save"
            );
            break;
    }
}

function setNextIndex(val) {
    if (!nextInLinePaused) nextIndex = val % cards.length;
}

function togglePauseNextInLine() {
    setNextInLinePausedTo(!nextInLinePaused);
}

function setNextInLinePausedTo(value) {
    pauseNextInLineButton.textContent = value
        ? "Resume next-in-line"
        : "Pause next-in-line";
    if (value) cards[nextIndex].pause();
    else cards[nextIndex].unpause();
    nextInLinePaused = value;
    updateLocalStorage();
}

let cards;
let nextIndex;
let nextInLineOn;
let nextInLinePaused;

tryLoadLocalStorage();

generateButton.addEventListener("click", generateCards);

leftBottom.addEventListener("click", delegateLeftBottomButtons);

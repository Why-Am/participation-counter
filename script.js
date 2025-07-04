const nameInput = document.querySelector("#name-input");
const generateButton = document.querySelector("#generate-button");
const leftBottom = document.querySelector("#left-bottom");
const skipNextInLineButton = document.querySelector(
    "#skip-next-in-line-button"
);
const mainContent = document.querySelector("#main-content");

let cards;
let nextInLineOn;

if (localStorage.getItem("data") === null) {
    cards = [];
    setNextInLineOn(true);
} else {
    // Load stored data
    const data = JSON.parse(localStorage.getItem("data"));
    cards = data.cards.map((card) => new Card(card.name, card.count));
    setNextInLineOn(data.nextInLineOn);
}

generateButton.addEventListener("click", (e) => {
    for (const name of nameInput.value.trim().split("\n")) {
        if (name === "") {
            continue;
        }
        cards.push(new Card(name));
    }
    updateLocalStorage();
});

leftBottom.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "skip-next-in-line-button":
            // TODO
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
});

function Card(name, count = 0) {
    if (!new.target) {
        throw Error("Use 'new' keyword");
    }

    this.name = name;
    this.nameElement = document.createElement("h2");
    this.nameElement.textContent = this.name;

    this.count = count;
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

    this.incrementCount = function () {
        ++this.count;
        this.countElement.textContent = this.count;
        updateLocalStorage();
    };

    this.decrementCount = function () {
        if (this.count > 0) {
            --this.count;
            this.countElement.textContent = this.count;
            updateLocalStorage();
        }
    };

    mainContent.appendChild(this.cardElement);

    this.cardElement.addEventListener("click", (e) => {
        switch (e.target.getAttribute("class")) {
            case "subtract-button":
                this.decrementCount();
                break;
            default:
                this.incrementCount();
        }
    });
}

function updateLocalStorage() {
    const formattedCards = cards.map((card) => ({
        name: card.name,
        count: card.count,
    }));

    const data = {
        cards: formattedCards,
        nextInLineOn: nextInLineOn,
    };

    localStorage.clear();
    localStorage.setItem("data", JSON.stringify(data));
}

function setNextInLineOn(value) {
    nextInLineOn = value;
    skipNextInLineButton.disabled = !nextInLineOn;
    // TODO
}

function toggleNextInLine() {
    setNextInLineOn(!nextInLineOn);
}

function resetCounters() {
    // TODO
}

const nameInput = document.querySelector("#name-input");
const generateButton = document.querySelector("#generate-button");
const clearLocalStorageButton = document.querySelector(
    "#clear-local-storage-button"
);
const mainContent = document.querySelector("#main-content");

let cards;

if (localStorage.getItem("cards") === null) {
    cards = [];
} else {
    cards = JSON.parse(localStorage.getItem("cards"));
    cards = cards.map((card) => new Card(card.name, card.count));
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

clearLocalStorageButton.addEventListener("click", (e) => {
    localStorage.clear();
    alert(
        "Local storage cleared. Any changes made will re-save to local storage."
    );
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
    localStorage.clear();
    localStorage.setItem("cards", JSON.stringify(formattedCards));
}

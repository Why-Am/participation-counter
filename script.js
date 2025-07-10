const body = document.querySelector("body");
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

        this.removeButtonDiv = document.createElement("div");
        this.removeButtonDiv.setAttribute("class", "remove-button-div");

        this.removeButton = document.createElement("button");
        this.removeButton.textContent = "x";
        this.removeButton.setAttribute("class", "remove-button");

        this.removeButtonDiv.appendChild(this.removeButton);

        this.nameElement = document.createElement("h2");
        this.nameElement.textContent = this.name;

        this.countElement = document.createElement("div");
        this.countElement.textContent = this.count;

        this.subtractButton = document.createElement("button");
        this.subtractButton.textContent = "-";
        this.subtractButton.setAttribute("class", "subtract-button");

        this.cardElement = document.createElement("div");
        this.cardElement.setAttribute("class", "card");
        this.cardElement.classList.add("unselectable");
        this.cardElement.appendChild(this.removeButtonDiv);
        this.cardElement.appendChild(this.nameElement);
        this.cardElement.appendChild(this.countElement);
        this.cardElement.appendChild(this.subtractButton);

        this.cardElement.addEventListener("click", (e) => {
            switch (e.target.getAttribute("class")) {
                case "subtract-button":
                    this.decrementCount();
                    break;
                case "remove-button":
                    removeCard(this.index);
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

        cards[nextInLine.index].unhighlight();
        setNextIndex(this.index + 1);
        cards[nextInLine.index].highlight();

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
        if (nextInLine.on) this.cardElement.classList.add("highlight");
    }

    unhighlight() {
        this.cardElement.classList.remove("highlight");
    }

    resetCount() {
        this.count = 0;
        this.countElement.textContent = this.count;
    }

    pause() {
        if (nextInLine.on) this.cardElement.classList.add("highlight-paused");
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
        nextInLine,
    };

    localStorage.clear();
    localStorage.setItem("data", JSON.stringify(data));
}

function tryLoadLocalStorage() {
    if (localStorage.getItem("data") === null) {
        // Set default values
        cards = [];
        nextInLine.paused = false;
        nextInLine.on = true;
        nextInLine.index = 0;
        nameInput.focus();
        nameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && e.ctrlKey === true) generateCards();
        });
    } else {
        // Load stored data
        const data = JSON.parse(localStorage.getItem("data"));
        cards = data.cards.map(
            (card) => new Card(card.name, card.index, card.count)
        );
        nextInLine.index = data.nextInLine.index;
        setNextInLineOnTo(data.nextInLine.on);
        setNextInLinePausedTo(data.nextInLine.paused);
        setLeftBottomButtonsDisabledTo(false);
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

    nextInLine.index = 0;
    setNextInLineOnTo(nextInLine.on);
    updateLocalStorage();
    setLeftBottomButtonsDisabledTo(false);
}

function setNextInLineOnTo(value) {
    nextInLine.on = value;
    pauseNextInLineButton.disabled = !nextInLine.on;
    if (value) {
        for (let card of cards) {
            if (nextInLine.index === card.index) {
                card.highlight();
                if (nextInLine.paused) card.pause(); // Bruh
            } else {
                card.unhighlight();
            }
        }
    } else {
        for (let card of cards) {
            card.unhighlight();
            card.unpause();
        }
    }
    updateLocalStorage();
}

function toggleNextInLine() {
    setNextInLineOnTo(!nextInLine.on);
}

function resetCounters() {
    for (let card of cards) {
        card.resetCount();
    }
}

function delegateLeftBottomButtons(e) {
    switch (e.target.id) {
        case "add-participant":
            addParticipant();
            break;
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
            clearLocalStorage();
            break;
    }
}

function clearLocalStorage() {
    const modalBackground = document.createElement("div");
    modalBackground.setAttribute("class", "modal-background");

    modalBackground.innerHTML = `<div class="modal">
        <div class="modal-text">
            <div>Are you sure you want to clear local storage?</div>
            <div>Note: after clearing, any further actions may cause a re-save.</div>
        </div>
        <div class="modal-buttons">
            <button class="modal-cancel-button">Cancel</button>
            <button class="modal-ok-button">Okay</button>
        </div>
    </div>`;

    body.appendChild(modalBackground);
    document.querySelector(".modal-ok-button").focus();

    modalBackground.addEventListener("click", (e) => {
        classList = e.target.classList;
        if (classList.contains("modal-ok-button")) {
            localStorage.clear();
            modalBackground.remove();
        } else if (
            classList.contains("modal-background") ||
            classList.contains("modal-cancel-button")
        )
            modalBackground.remove();
    });

    modalBackground.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "Enter":
                localStorage.clear();
                modalBackground.remove();
                break;
            case "Escape":
                modalBackground.remove();
                break;
        }
    });
}

function setNextIndex(val) {
    if (!nextInLine.paused) nextInLine.index = val % cards.length;
}

function togglePauseNextInLine() {
    setNextInLinePausedTo(!nextInLine.paused);
}

function setNextInLinePausedTo(value) {
    pauseNextInLineButton.textContent = value
        ? "Resume next-in-line"
        : "Pause next-in-line";
    if (value) cards[nextInLine.index].pause();
    else cards[nextInLine.index].unpause();
    nextInLine.paused = value;
    updateLocalStorage();
}

function removeCard(cardIndex) {
    cards[cardIndex].cardElement.remove();
    cards.splice(cardIndex, 1);

    // fix indices
    for (let i = cardIndex; i < cards.length; ++i) {
        cards[i].index -= 1;
    }

    // fix next in line
    if (nextInLine.index > cardIndex) {
        nextInLine.index -= 1;
    } else if (nextInLine.index === cardIndex) {
        nextInLine.index %= cards.length; // accounts for deleting last card
        cards[nextInLine.index].highlight();
    }

    if (nextInLine.paused) {
        cards[nextInLine.index].pause();
    }

    updateLocalStorage();
}

function setLeftBottomButtonsDisabledTo(value) {
    for (const child of leftBottom.children) child.disabled = value;
}

function addParticipant() {
    const modalBackground = document.createElement("div");
    modalBackground.setAttribute("class", "modal-background");

    modalBackground.innerHTML = `<div class="modal">
        <input type="text" name="modal-name-input" class="modal-name-input" placeholder="Enter participant name here" />
        <div class="modal-buttons">
            <button class="modal-cancel-button">Cancel</button>
            <button class="modal-add-button">Add</button>
        </div>
    </div>`;

    body.appendChild(modalBackground);

    const newIndex = cards.length;
    const nameInput = document.querySelector(".modal-name-input");
    nameInput.focus();

    function addNewCard() {
        cards.push(new Card(nameInput.value, newIndex));
        updateLocalStorage();
        modalBackground.remove();
    }

    modalBackground.addEventListener("click", (e) => {
        const classList = e.target.classList;
        if (classList.contains("modal-add-button")) {
            addNewCard();
        } else if (
            classList.contains("modal-cancel-button") ||
            classList.contains("modal-background")
        )
            modalBackground.remove();
    });

    modalBackground.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "Enter":
                addNewCard();
                break;
            case "Escape":
                modalBackground.remove();
                break;
        }
    });
}

setLeftBottomButtonsDisabledTo(true);

let cards;
let nextInLine = {
    index: undefined,
    on: undefined,
    paused: undefined,
};

tryLoadLocalStorage();

generateButton.addEventListener("click", generateCards);

leftBottom.addEventListener("click", delegateLeftBottomButtons);

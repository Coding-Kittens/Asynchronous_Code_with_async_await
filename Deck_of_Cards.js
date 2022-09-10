const body = document.querySelector("body");
const cardForm = document.querySelector(".cardForm");
const cardsArea = document.querySelector("#cardsArea");
const btn = document.querySelector("button");
let currentDeck;

function randomRange(min, max) {
  let isrand = false;
  let num = 0;
  while (!isrand) {
    num = Math.floor(Math.random() * max);
    isrand = num >= min;
  }
  return num;
}

class CardDeck {
  constructor() {
    this.remainingCards = 0;
    this.deckId;
  }

  async setDeck() {
    let res = await axios.get(
      "http://deckofcardsapi.com/api/deck/new/shuffle/"
    );
    this.deckId = res.data.deck_id;
    this.remainingCards = res.data.remaining;
  }

  async getCard() {
    let res = await axios.get(
      `http://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`
    );
    CardDeck.addCard(res.data.cards[0].image);
    this.remainingCards = res.data.remaining;
  }

  static addCard(img) {
    let newdiv = document.createElement("div");
    let newImg = document.createElement("img");
    newImg.setAttribute("src", img);
    newdiv.style.transform = `rotate(${randomRange(-90, 90)}deg)`;
    newdiv.style.top = `${randomRange(-10, 15)}px`;
    newdiv.style.left = `${randomRange(38, 48)}%`;
    newdiv.append(newImg);
    cardsArea.append(newdiv);
  }
}

cardForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (!currentDeck || currentDeck.remainingCards <= 0) {
    cardsArea.innerHTML = "";
    currentDeck = new CardDeck();
    await currentDeck.setDeck();
    await currentDeck.getCard();
    btn.innerText = "Gimme A Card!";
  } else {
    await currentDeck.getCard();
    if (currentDeck.remainingCards === 0) {
      btn.innerText = "New Deck";
      alert("No more cards in this deck!");
    }
  }
});

async function deckOfCards() {
  let newCard = await axios.get(
    "http://deckofcardsapi.com/api/deck/new/draw/?count=1"
  );
  console.log(
    `${newCard.data.cards[0].value} of ${newCard.data.cards[0].suit}`
  );
  let newDeck = await axios.get(
    "http://deckofcardsapi.com/api/deck/new/draw/?count=1"
  );
  let sameDeck = await axios.get(
    `http://deckofcardsapi.com/api/deck/${newDeck.data.deck_id}/draw/?count=1`
  );
  console.log(
    `${newDeck.data.cards[0].value} of ${newDeck.data.cards[0].suit}`
  );
  console.log(
    `${sameDeck.data.cards[0].value} of ${sameDeck.data.cards[0].suit}`
  );
}

deckOfCards();

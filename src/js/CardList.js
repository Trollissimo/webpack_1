import Card from "./Card";

export default class CardList {
    constructor(container, arr) {
        this.container = container;
        this.arr = arr;
    }
    addCard(name, link) {
      const cardElement = new Card (name, link);
      this.container.appendChild(cardElement.placeCard);
    }
  }
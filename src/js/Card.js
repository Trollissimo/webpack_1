import Popup from "./Popup";
import placesList from "./PL"
const popupImage = document.querySelector('.popup__image');
const popupImg = new Popup (popupImage, 'open-image');
export default class Card {
    constructor (name, link) {
      this.name = name;
      this.link = link;
      this.placeCard = this.create(name, link);
      this.like = this.like.bind(this);
      this.remove = this.remove.bind(this);
      this.openImage = this.openImage.bind(this);
      this.placeCard.querySelector('.place-card__like-icon').addEventListener('click', this.like);
      this.placeCard.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
      this.placeCard.addEventListener('click', this.openImage);    
    }
  
    like () {
      this.placeCard.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
    }
  
    remove () {   
      this.placeCard.parentNode.removeChild(this.placeCard);
    }
   
    create () {
      const placeCard = document.createElement('div')
      placeCard.classList.add('place-card');
  
      const cardImage = document.createElement('div'); 
      cardImage.classList.add('place-card__image');
      placeCard.appendChild(cardImage);
      cardImage.setAttribute('style','background-image: url('+ this.link +')');
    
      const cardDescription = document.createElement('div');
      cardDescription.classList.add('place-card__description');
      placeCard.appendChild(cardDescription);
    
      const cardName = document.createElement('h3');
      cardName.classList.add('place-card__name');
      cardName.textContent = this.name;
      cardDescription.appendChild(cardName);
  
      let likeButton = document.createElement('button');
      likeButton.classList.add('place-card__like-icon');
      cardDescription.appendChild(likeButton);
  
      let delButton = document.createElement('button');
      delButton.classList.add('place-card__delete-icon');
      cardImage.appendChild(delButton);
    
      return placeCard;
    }
    openImage(imageLink) {      
    imageLink = event.target.closest('.place-card__image');
    if (!imageLink) return; 
        if (!placesList.contains(imageLink)) return; 
        imageLink=imageLink.getAttribute('style').slice(22, -1); 
        const img = document.querySelector('.popup__content_img');
        img.setAttribute('src', imageLink);
        popupImg.open();
    }
  }
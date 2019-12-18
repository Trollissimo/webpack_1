import "./style.css";
const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort5' : 'https://praktikum.tk/cohort5'

const placesList = document.querySelector('.places-list');
const delButton = placesList.querySelector('.place-card__delete-icon');
const popup = document.querySelector('.popup');
const popupEdit = document.querySelector('.popup__edit');
const popupImage = document.querySelector('.popup__image');
const openButtonPopup = document.querySelector('.user-info__button')
const form = document.forms.new;
const name = form.elements.name;
const link = form.elements.link;
const formEdit = document.forms.newEdit;
const nameEdit = formEdit.elements.nameEdit;
const edit = formEdit.elements.edit;
const userPhoto = document.querySelector('.user-info__photo');
const userName = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job');

function openImagePopup(imageLink) {
  imageLink = event.target.closest('.place-card__image');
  if (!imageLink) return; 
    if (!placesList.contains(imageLink)) return; 
    imageLink=imageLink.getAttribute('style').slice(22, -1); 
    const img = document.querySelector('.popup__content_img');
    img.setAttribute('src', imageLink);
    popupImg.open();
}
class Card {
  constructor (name, link, openImageCallback) {
    this.name = name;
    this.link = link;
    this.openImageCallback = openImageCallback;
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

  openImage() {
    this.openImageCallback(this.link);
  }
}

class CardList {
  constructor(container, arr) {
      this.container = container;
      this.arr = arr;
     // this.render();
  }
  // render() {
  //   this.arr.forEach((item) => {
  //     this.addCard(item.name, item.link);
  //   });
  // }

  addCard(name, link) {
    const cardElement = new Card (name, link, openImagePopup);
    this.container.appendChild(cardElement.placeCard);
  }
}
const cardList = new CardList(placesList);

class Popup {
  constructor(element, openClassName) {
    this.element = element;  
    this.openClassName = openClassName; 
    const closeButton = this.element.querySelector('.popup__close');
    this.close = this.close.bind(this);
    closeButton.addEventListener('click', this.close);
  }
  open() {
    this.element.classList.add(this.openClassName);
  }
  close() {
    this.element.classList.remove(this.openClassName);
  }
}

const popupForm = new Popup (popup, 'popup_is-opened')
openButtonPopup.addEventListener('click', function () {
  popupForm.open();
});
const popupEditt = new Popup (popupEdit, 'open-edit')
document.querySelector('.user-info__edit').addEventListener('click',function () {
  popupEditt.open();
});
const popupImg = new Popup (popupImage, 'open-image')


class Api {
  constructor(options) {
    this.options = options;
    this.baseUrl = this.options.baseUrl;
    this.headers = this.options.headers;
  }
  getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  getInitialName() {
    return fetch(`${this.baseUrl}/users/me`,{
      headers: this.headers
    })
    .then((res) => this.getResponseData(res)
    )    
  }
  
  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
    headers: this.headers
    })
    .then(res => this.getResponseData(res)
    )
  }

  changeName(name, about){ 
    return fetch(this.baseUrl + '/users/me', {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
          name: name,
          about: about,
      })
  })  
}
  sendCard(name, link){
    return fetch(this.baseUrl + '/cards', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
          name: name,
          link: link,
      })
  })
}
}

const api = new Api({
  baseUrl: serverUrl,
  headers: {
    authorization: '704567c6-d0eb-4828-acf4-3297a3ada390',
    'Content-Type': 'application/json'
  }
});

api.getInitialName()
  .then((data) => {
    nameEdit.value = data.name;
    edit.value = data.about;
    userName.textContent = data.name;
    userJob.textContent = data.about;
    userPhoto.setAttribute('style','background-image: url('+ data.avatar +')');
  })
  .catch((err) => console.log(err));
    
api.getInitialCards()
  .then((data) => {
    data.forEach((item) => {
      cardList.addCard(item.name, item.link);
  })
})
  .catch((err) => console.log(err)); 

//добавляем карточку

form.addEventListener('submit', function addCard(event) {
  event.preventDefault();
  nameForm = name.value;
  linkForm = link.value;
  if (!(nameForm.length === 0 || linkForm.length === 0)) {
    api.sendCard(name.value, link.value)
    .then((res) => {
    cardList.addCard(nameForm, linkForm);
    form.reset();
    popup.classList.remove('popup_is-opened');
    })
    .catch((err) => console.log(err)); 
  }
})


//редактируем Имя

formEdit.addEventListener('submit', function createEdit(event) {
  event.preventDefault();
  let userName = document.querySelector('.user-info__name');
  let userJob = document.querySelector('.user-info__job');

  api.changeName(nameEdit.value, edit.value)
    .then((res) => {
      userName.textContent = nameEdit.value;
      userJob.textContent = edit.value;
      form.reset();
      popupEdit.classList.remove('open-edit');
    })
    .catch((err) => console.log(err)); 
});



//кнопка в попапах
const popup__button = form.elements.button;
const saveButton = formEdit.elements.saveButton;

formEdit.addEventListener('input', function () {

  if (nameEdit.value.length === 0 || edit.value.length === 0) {
    saveButton.setAttribute('disabled', true);
    saveButton.classList.add('popup__button_disabled');
  } else {
    saveButton.removeAttribute('disabled', true);
    saveButton.classList.remove('popup__button_disabled');
  }
});

form.addEventListener('input', function () {
  if (name.value.length === 0 || link.value.length === 0) {
    popup__button.setAttribute('disabled', true);
    popup__button.classList.add('popup__button_disabled');
  } else {
    popup__button.removeAttribute('disabled', true);
    popup__button.classList.remove('popup__button_disabled');
  }
});

//Валидация
form.addEventListener("click", event => {
  if (validateForm(form)) {
    console.log();
  }
});

function validateForm(elem) {
  let valid = true;
  if (!vilidateField(elem.elements.name)) {
    valid = false;
  }
  if (!vilidateField(elem.elements.link)) {
    valid = false;
  }
  return valid;
}

function vilidateField(field) {
  field.nextElementSibling.textContent = field.validationMessage;
  return field.checkValidity();
}
formEdit.addEventListener("click", event => {
  if (validateFormEdit(formEdit)) {
    console.log();
  }
});

function validateFormEdit() {
  let valid = true;
  if (!vilidateField(nameEdit)) {
    valid = false;
  }
  if (!vilidateField(edit)) {
    valid = false;
  }
  return valid;
}

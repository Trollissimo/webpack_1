import "./style.css";
import Popup from "./js/Popup";
import Api from "./js/Api";
import CardList from "./js/CardList";
import placesList from "./js/PL";
const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort5' : 'https://praktikum.tk/cohort5';

const popup = document.querySelector('.popup');
const popupEdit = document.querySelector('.popup__edit');
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


const cardList = new CardList(placesList);


const popupForm = new Popup (popup, 'popup_is-opened')
openButtonPopup.addEventListener('click', function () {
  popupForm.open();
});
const popupEditt = new Popup (popupEdit, 'open-edit')
document.querySelector('.user-info__edit').addEventListener('click',function () {
  popupEditt.open();
});

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

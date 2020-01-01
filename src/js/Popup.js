export default class Popup {
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



 
export default class Api {
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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get('/all');
  }

  displayContact(id) {
    return this._http.get('/' + id);
  }

  addContact(newcontact) {
    return this._http.post('/new', newcontact);
  }

  updateContact(id, updatecontact) {
    return this._http.put('/update/' + id, updatecontact);
  }

  deleteContact(id) {
    return this._http.delete('/delete/' + id);
  }

  addBday(id, updatecontact) {
    return this._http.put('/addbd/' + id, updatecontact);
  }

  addAnv(id, updatecontact) {
    return this._http.put('/addanv/' + id, updatecontact);
  }

  addXmas(id, updatecontact) {
    return this._http.put('/addxmas/' + id, updatecontact);
  }

  register(newuser) {
    return this._http.post('/reg', newuser);
  }
  login(newuser) {
    return this._http.post('/login', newuser);
  }
  home() {
    return this._http.get('/home');
  }

  add() {
    return this._http.get('/new');
  }
  list() {
    return this._http.get('/list');
  }


  // end of file
}

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

  generateLabel(id) {
    return this._http.get('/label/' + id);
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

  addBday(id, bdinfo) {
    return this._http.put('/addbd/' + id, bdinfo);
  }

  addAnv(id, aninfo) {
    return this._http.put('/addanv/' + id, aninfo);
  }

  addXmas(id, xmasinfo) {
    return this._http.put('/addxmas/' + id, xmasinfo);
  }

  register(newuser) {
    return this._http.post('/reg', newuser);
  }
  login(newuser) {
    return this._http.post('/login', newuser);
  }
  // front end routes
  home() {
    return this._http.get('/home');
  }
  add() {
    return this._http.get('/new');
  }
  list() {
    return this._http.get('/list');
  }
  edit(id) {
    return this._http.get('/edit/' + id);
  }
  label(id) {
    return this._http.get('/label/' + id);
  }
  tracking(id) {
    return this._http.get('/tracking/' + id);
  }

  // end of file
}

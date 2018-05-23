import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: any;
  message: any;
  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.contacts = [];
    this.message = [];
    this.setPage();
  }

  setPage() {
    const observable = this._httpService.getUsers();
    observable.subscribe(data => {
      console.log('users', data);
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        this.contacts = data['users'][0];
        console.log('this.contacts', this.contacts);
      }
    });
  }

  destroyUser(id: String) {
    console.log('id', id);
    const observable = this._httpService.deleteContact(id);
    observable.subscribe(data => {
      console.log('Deleted Contact', data);
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        this.setPage();
      }
    });
  }

}

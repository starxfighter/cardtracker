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
  users: any;
  dcontacts: any;
  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.contacts = {
      name: '',
      id: '',
      status: '',
    };
    this.message = [];
    this.users = [];
    this.dcontacts = [];
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
        this.dcontacts = [];
        this.users = data['users'][0];
        console.log('this.contacts', this.contacts);
        for (let x = 0; x < this.users.contacts.length; x++) {
          console.log('in contacts for loop');
          const temp = { name: '', id: '', status: ''};
          temp.name = this.users.contacts[x].cname;
          temp.id = this.users.contacts[x]._id;
          temp.status = this.users.contacts[x].validation;
          this.dcontacts.push(temp);
          console.log('dcontacts', this.dcontacts);
        }
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

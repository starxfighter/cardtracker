import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  newcontact: any;
  message: any;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.newcontact = {
      mrfname: '',
      msfname: '',
      lastname: '',
      streetaddr: '',
      city: '',
      state: '',
      postalcode: '',
      conuntry: '',
      mrdob: '',
      msdob: '',
      anidate: ''
    };
    this.message = [];
  }

  addNewContact() {
    console.log('newcontact', this.newcontact);
    const observable = this._httpService.addContact(this.newcontact);
    observable.subscribe(data => {
      if (data['error'] || data['message']) {
        console.log('data', data);
        if (data['error']) {
          console.log('pushing error');
          this.message.push(data['error'].message);
        }
        if (data['message']) {
          console.log('pushing message');
          this.message.push(data['message']);
        }
        console.log('this message', this.message);
      } else {
        return this.router.navigate(['/home/list/contacts']);
      }
    });
  }

}

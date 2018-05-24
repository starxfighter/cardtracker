import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addbd',
  templateUrl: './addbd.component.html',
  styleUrls: ['./addbd.component.css']
})
export class AddbdComponent implements OnInit {
  id: String;
  contact: any;
  message: any;
  bdinfo: any;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params) => {
      this.id = params.id;
    });
    this.contact = {
      name: '',
      streetaddr: '',
      city: '',
      state: '',
      postalcode: '',
      country: '',
      bdaytrk: ''
    };
    this.bdinfo = {
      status: '',
      trkdate: ''
    };
    this.message = [];
    this.displayContact(this.id);
  }

  displayContact(id: String) {
    console.log('display contact', id);
    const observable = this._httpService.displayContact(this.id);
    observable.subscribe(data => {
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        console.log('display data', data);
        console.log('display data', data['contact'].cname);
        this.contact.name = data['contact'].cname;
        this.contact.streetaddr = data['contact'].cstreet_addr;
        this.contact.city = data['contact'].city_locality;
        this.contact.state = data['contact'].cstate;
        this.contact.postalcode = data['contact'].cp_code;
        this.contact.country = data['contact'].cc_code;
        this.contact.bdaytrk = data['contact'].bday_track;
      }
    });
  }

  addBdtrack(id: String) {
    console.log('update bd info', this.bdinfo);
    console.log('bd update id', id);
    const observable = this._httpService.addBday(id, this.bdinfo);
    observable.subscribe(data => {
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        console.log('add bd track', data);
        return this.router.navigate(['/home/list/contacts']);
      }
    });
  }

}

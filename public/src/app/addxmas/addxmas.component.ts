import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addxmas',
  templateUrl: './addxmas.component.html',
  styleUrls: ['./addxmas.component.css']
})
export class AddxmasComponent implements OnInit {
  id: String;
  contact: any;
  message: any;
  xmasinfo: any;
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
    this.xmasinfo = {
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

  addXmastrack(id: String) {
    console.log('update xmas info', this.xmasinfo);
    console.log('xmas update id', id);
    const observable = this._httpService.addXmas(id, this.xmasinfo);
    observable.subscribe(data => {
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        console.log('add xmas track', data);
        return this.router.navigate(['/home/list/contacts']);
      }
    });
  }

}

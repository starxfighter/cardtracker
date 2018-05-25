import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  id: String;
  updatecontact: any;
  message: any;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });
    this.updatecontact = {
      name: '',
      streetaddr: '',
      city: '',
      state: '',
      postalcode: '',
      country: '',
      mrdob: '',
      msdob: '',
      anidate: ''
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
        this.updatecontact.name = data['contact'].cname;
        this.updatecontact.streetaddr = data['contact'].cstreet_addr;
        this.updatecontact.city = data['contact'].city_locality;
        this.updatecontact.state = data['contact'].cstate;
        this.updatecontact.postalcode = data['contact'].cp_code;
        this.updatecontact.country = data['contact'].cc_code;
        if (data['contact'].mister_dob != null) {
          const tempmr = moment(data['contact'].mister_dob).add(1, 'd').format('YYYY-MM-DD');
          this.updatecontact.mrdob = tempmr;
        }
        if (data['contact'].misses_dob != null ) {
          const tempms = moment(data['contact'].misses_dob).add(1, 'd').format('YYYY-MM-DD');
          this.updatecontact.msdob = tempms;
        }
        if (data['contact'].anni_date != null) {
          const tempan = moment(data['contact'].anni_date).add(1, 'd').format('YYYY-MM-DD');
          this.updatecontact.anidate = tempan;
        }
      }
    });
  }

  updateContact(id: String) {
    console.log('update contact info', this.updatecontact);
    console.log('update id', id);
    const observable = this._httpService.updateContact(id, this.updatecontact);
    observable.subscribe(data => {
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        console.log('update contact response', data);
        return this.router.navigate(['/home/list/contacts']);
      }
    });
  }

}

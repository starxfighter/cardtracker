import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  contacts: any;
  message: any;
  users: any;
  dcontacts: any;
  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.message = [];
    this.users = [];
    this.dcontacts = [];
    this.contacts = {
      name: '',
      streetaddr: '',
      city: '',
      state: '',
      postalcode: '',
      country: '',
      status: '',
      bdtracking: '',
      antracking: '',
      xmtracking: ''
    };
    this.setPage();
  }

  setPage() {
    let tempbd: any;
    let tempan: any;
    let tempxm: any;
    const observable = this._httpService.getUsers();
    observable.subscribe(data => {
      // console.log('report', data);
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        this.dcontacts = [];
        this.users = data['users'][0];
        for (let x = 0; x < this.users.contacts.length; x++) {
          console.log('in contacts for loop');
          console.log('user', this.users);
          const temp = {
            name: '',
            streetaddr: '',
            city: '',
            state: '',
            postalcode: '',
            country: '',
            status: '',
            bdtracking: [],
            antracking: [],
            xmtracking: []};
          temp.name = this.users.contacts[x].cname;
          temp.streetaddr = this.users.contacts[x].cstreet_addr;
          temp.city = this.users.contacts[x].city_locality;
          temp.state = this.users.contacts[x].cstate;
          temp.postalcode = this.users.contacts[x].cp_code;
          temp.country = this.users.contacts[x].cc_code;
          temp.status = this.users.contacts[x].validation;
          tempbd = this.users.contacts[x].bday_track;
          console.log('tempbd', tempbd);
          for (let z = 0; z < tempbd.length; z++) {
            console.log('bd loop');
            const btemp = {status: '', date: ''};
            btemp.status = tempbd[z].bdstatus;
            console.log('btemp status', btemp.status);
            btemp.date = tempbd[z].bd_date;
            console.log('btemp', btemp);
            temp.bdtracking.push(btemp);
          }
          tempan = this.users.contacts[x].anniversary_track;
          for (let z = 0; z < tempan.length; z++) {
            const atemp = {status: '', date: ''};
            atemp.status = tempan[z].anstatus;
            atemp.date = tempan[z].an_date;
            temp.antracking.push(atemp);
          }
          tempxm = this.users.contacts[x].xmas_track;
          for (let z = 0; z < tempxm.length; z++) {
            const xtemp = {status: '', date: ''};
            xtemp.status = tempxm[z].xmasstatus;
            xtemp.date = tempxm[z].xmas_date;
            temp.xmtracking.push(xtemp);
          }
          console.log('temp', temp);
          this.dcontacts.push(temp);
          console.log('dcontacts', this.dcontacts);
        }
      }
    });
  }

}

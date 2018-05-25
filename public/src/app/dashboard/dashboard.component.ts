import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  uevents: any;
  message: any;
  users: any;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.uevents = [];
    this.message = [];
    this.users = [];

    console.log(this.uevents);
    this.setPage();

  }

  setPage() {

    const observable = this._httpService.getUsers();
    observable.subscribe(data => {
      console.log('got our users', data);
      if (data['error']) {
        this.message.push(data['error'].message);
      } else {
          this.users = data['users'][0];
          console.log('dashboard', this.users);
          for (let x = 0; x < this.users.contacts.length; x++) {
            console.log('in dash for loop');
            // if dob > today & < today + 3mos
            const curdate = moment().format('YYYY-MM-DD');
            console.log('curdate', curdate);
            const year = moment(curdate).year();
            const futdate = moment().add(3, 'M').format('YYYY-MM-DD');
            console.log('futuredate', futdate);
            if (this.users.contacts[x].mister_dob !== null) {
              const tmpmrdob = moment(this.users.contacts[x].mister_dob).year(year).format('YYYY-MM-DD');
              console.log('tempmrdob', tmpmrdob);
              const inrange = moment(tmpmrdob).isBetween(curdate, futdate);
              console.log('in range', inrange);
              if (inrange === true) {
                const temp = { name: '', date: '', event: ''};
                temp.name = this.users.contacts[x].cname;
                temp.date = this.users.contacts[x].mister_dob;
                temp.event = 'Mister Birthday';
                this.uevents.push(temp);
                console.log('uevents', this.uevents);
              }
            // date check end
            }
            if (this.users.contacts[x].misses_dob !== null) {
              const tmpmsdob = moment(this.users.contacts[x].misses_dob).year(year).format('YYYY-MM-DD');
              console.log('tempmrdob', tmpmsdob);
              const inrange = moment(tmpmsdob).isBetween(curdate, futdate);
              console.log('in range', inrange);
              if (inrange === true) {
                const temp = { name: '', date: '', event: ''};
                temp.name = this.users.contacts[x].cname;
                temp.date = this.users.contacts[x].misses_dob;
                temp.event = 'Misses Birthday';
                this.uevents.push(temp);
                console.log('uevents', this.uevents);
              }
            // date check end
            }
            if (this.users.contacts[x].anni_date !== null) {
              const tmpandob = moment(this.users.contacts[x].anni_date).year(year).format('YYYY-MM-DD');
              console.log('tempmrdob', tmpandob);
              const inrange = moment(tmpandob).isBetween(curdate, futdate);
              console.log('in range', inrange);
              if (inrange === true) {
                const temp = { name: '', date: '', event: ''};
                temp.name = this.users.contacts[x].cname;
                temp.date = this.users.contacts[x].anni_date;
                temp.event = 'Anniversary';
                this.uevents.push(temp);
                console.log('uevents', this.uevents);
              }
            // date check end
            }
          }
      }
    });
  }

}
​

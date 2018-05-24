import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';

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
            console.log('x value', x);
            // if dob > today & < today + 3mos
            const temp = { name: ''};
            temp.name = this.users.contacts[x].cname;
            this.uevents.push(temp);
             console.log('uevents', this.uevents);
          }
      }
    });
  }

}



// var selecteddate = '07/29/1990';
// var datestr = selecteddate.split('/');

// var month = datestr[0];
// var day = datestr[1];
// var year = datestr[2];

// var currentdate = new Date();
// var cur_month = currentdate.getMonth() + 1;
// var cur_day =currentdate.getDate();
// var cur_year =currentdate.getFullYear();

// if(cur_month==month && day >= cur_day)
// {
//  alert("in this month");
// }

//    else
//    {
//   alert("not in this month");
//    }    ​

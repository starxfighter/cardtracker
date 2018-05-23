import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  newuser: any;
  message: any;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.newuser = {
      name: '',
      street_addr: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      email: '',
      password: '',
      pass_conf: '',
    };
    this.message = [];
  }

  registerUser() {
    console.log('new user', this.newuser);
    const observable = this._httpService.register(this.newuser);
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
          console.log('doing reg redirect');
          return this.router.navigate(['/home/login']);
      }
    });
  }

}

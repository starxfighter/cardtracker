import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  newuser: any;
  message: any;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.newuser = {
      email: '',
      password: '',
    };
    this.message = [];
  }

  loginUser() {
    console.log('login user', this.newuser);
    const observable = this._httpService.login(this.newuser);
    observable.subscribe(data => {
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this message', this.message);
      } else {
        return this.router.navigate(['/home/dashboard']);
      }
    });
  }

}

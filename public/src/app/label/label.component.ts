import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {
  id: String;
  user: any;
  contact: any;
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
    this.message = [];
    this.user = [];
    this.contact = [];
    this.getLabel(this.id);
  }

  getLabel(id: String) {
    console.log('label contact', id);
    const observable = this._httpService.generateLabel(this.id);
    observable.subscribe(data => {
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        console.log('display data', data);
        this.user = data['user'];
        this.contact = data['contact'];
      }
    });
  }

}

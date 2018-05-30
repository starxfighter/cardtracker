import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addanv',
  templateUrl: './addanv.component.html',
  styleUrls: ['./addanv.component.css']
})
export class AddanvComponent implements OnInit {
  id: String;
  contact: any;
  message: any;
  aninfo: any;
  tracking: any;
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
      status: '',
      anvtrk: ''
    };
    this.aninfo = {
      status: '',
      trkdate: ''
    };
    this.message = [];
    this.tracking = [];
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
        this.contact.status = data['contact'].validation;
        this.contact.anvtrk = data['contact'].anniversary_track;
        for (let x = 0; x < this.contact.anvtrk.length; x++) {
          const temp = {status: '', date: ''};
          temp.status = this.contact.anvtrk[x].anstatus;
          temp.date = this.contact.anvtrk[x].an_date;
          this.tracking.push(temp);
        }
      }
    });
  }

  addAntrack(id: String) {
    console.log('update bd info', this.aninfo);
    console.log('bd update id', id);
    const observable = this._httpService.addAnv(id, this.aninfo);
    observable.subscribe(data => {
      if (data['error']) {
        this.message.push(data['error'].message);
        console.log('this.message', this.message);
      } else {
        console.log('add an track', data);
        return this.router.navigate(['/home/list/contacts']);
      }
    });
  }

}

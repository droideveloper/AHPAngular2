import { Component, OnInit } from '@angular/core';

import { EndpointService } from './nets/endpoint.service';
import { Response } from './entities/entity';

import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import 'rxjs/Rx';

@Component({
  selector: 'boilers',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private endpointService: EndpointService) { }

  ngOnInit() {
   
  }
}

import { Component, OnInit } from '@angular/core';

import { EndpointService } from '../nets/endpoint.service';

import { Boiler } from '../entities/entity';

@Component({
  selector: 'showcase',
  templateUrl: '../views/showcase.component.html',
  styleUrls: ['../views/showcase.component.css']
})
export class ShowcaseComponent implements OnInit {

  title: string = 'Boiler Database';
  description: string = 'Search through our database using your filters.';

  data: Pair[];

  constructor(private endpointService: EndpointService) {}

  ngOnInit() {
    this.endpointService.showcase(6)
      .map(r => r as Boiler[]) 
      .subscribe(r => {
        this.data = [];
        for(var i = 0; i < r.length; i += 3) {
          this.data.push({ 
            first: r[i], fon: false, 
            second: r[i + 1], son: false,
            third: r[i + 2], thon: false
          });
        } 
      }, 
      error => console.info(error));
  }
}

interface Pair {
  fon: boolean;// first mouse on ( TODO )
  first: Boiler;

  son: boolean;// second mouse on ( TODO )
  second: Boiler;

  thon: boolean;// third mouse on ( TODO )
  third: Boiler;
}
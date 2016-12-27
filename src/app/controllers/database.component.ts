import { Component, OnInit } from '@angular/core';

import { EndpointService } from '../nets/endpoint.service';

import { Boiler, Filter } from '../entities/entity';

@Component({
  selector: 'database',
  templateUrl: '../views/database.component.html',
  styleUrls: ['../views/database.component.css']
})
export class DatabaseComponent implements OnInit {

  filter: Filter;
  data: Boiler[];

  constructor(private endpointService: EndpointService) { }

  ngOnInit() {
   //default search params 
   this.filter = {
     priceMore: 2500,
     powerMore: 25,
     type: null
   };
   this.notifyFilterChange();
  }

  priceChanged(event) {
    this.createFilterIfNull();
    this.filter.priceMore = parseInt(event.target.value);
    this.notifyFilterChange();
  }

  powerChanged(event) {
    this.createFilterIfNull();
    this.filter.powerMore = parseInt(event.target.value);
    this.notifyFilterChange();
  }

  typeChanged(event) {
    this.createFilterIfNull();
    this.filter.type = event.target.value;
    this.notifyFilterChange();
  }

  clearFilter() {
    this.filter = null;
    this.notifyFilterChange();
  }

  private createFilterIfNull() {
    if(!this.filter) {
      this.filter = { priceMore: 0, powerMore: 0, type: null };
    }
  }

  private notifyFilterChange() {
    this.endpointService.filter(this.filter)
      .map(data => data as Boiler[])
      .subscribe(data => this.data = data, error => console.log(error));
  }
}
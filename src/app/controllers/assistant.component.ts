import { Component } from '@angular/core';

import { EndpointService } from '../nets/endpoint.service';

import { Boiler } from '../entities/entity';

@Component({
  selector: 'assistant',
  templateUrl: '../views/assistant.component.html',
  styleUrls: ['../views/assistant.component.css']
})
export class AssistantComponent {

  title: string = 'Find your boiler';
  description: string = 'Using this tab you will find the best fitting boiler. Start by entering the area of your apartment.';

  square: string;

  constructor(private endpointService: EndpointService) { }
}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { EndpointService } from '../nets/endpoint.service';
import { Boiler, Entry, Node, Pairwise, History, Result } from '../entities/entity';

@Component({
  selector: 'ahp',
  templateUrl: '../views/ahp.component.html',
  styleUrls: ['../views/ahp.component.css']
})
export class AhpComponent implements OnInit {

  dataSet: Boiler[];
  //these are the boilers that we get from system (filtered)
  data: Boiler[] = [];

  //our AHP model
  decision: Node[] = [
    { name: 'General Cost', 
      subnodes: [ 
        { name: 'Price Cost'}, 
        { name: 'Maintenance Cost' }, 
        { name: 'Fuel Efficency' } 
      ] 
    },
    { name: 'Boiler Style' },
    { name: 'Boiler Safety' },
    { name: 'Boiler Warranty' }
  ];

  //title and entries used in 
  titles: string[];
  entires: Entry[];

  //availlable values
  values = [ 
    { key: "9", value: 9 },
    { key: "8", value: 8 },
    { key: "7", value: 7 },
    { key: "6", value: 6 },
    { key: "5", value: 5 },
    { key: "4", value: 4 },
    { key: "3", value: 3 },
    { key: "2", value: 2 },
    { key: "1", value: 1 },
    { key: "1/2", value: 1/2 },
    { key: "1/3", value: 1/3 },
    { key: "1/4", value: 1/4 },
    { key: "1/5", value: 1/5 },
    { key: "1/6", value: 1/6 },
    { key: "1/7", value: 1/7 },
    { key: "1/8", value: 1/8 },
    { key: "1/9", value: 1/9 }
   ];

   stage = {
     index: 0,
     end: 4,
     start: 0,
     history: Array<History>() //push matrixes in here
  };

  //result of ahp will be hold here
  set: Result[] = [];

  //first and second for style comparision screen to use them in image show etc.
  first: Boiler;
  second: Boiler;

  result: boolean; // this will be changed if the calculation is present

  state: number = -1;

  //change things
  contentTitle: string;

  contentTitles = [
    'Select at least 2 and at most 7 boiler from list below.',
    'Please fill main criteria for calculation using dropboxes.', 
    'Please fill sub criteria of cost for calculation using dropboxes.', 
    'Compare boilers consider their style by using images or leave as they are if not important.',
    'Results are listed in order with their percentages showing their compliance with your choices the biggest is being the most fitting one.'
  ];  

  //constants
  private MAX_PRICE = 4000;
  private MAX_MAINTENANCE = 200;
  private MAX_FUEL = 50;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private endpointService: EndpointService) { }

  //lifecycle of angular2 component  
  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        let square = +params['id'];//converts it to int
        return this.endpointService.filterBySquare({ square: square });  
      })
      .map(x => x as Boiler[])
      .subscribe(data => this.dataSet = data, error => console.log(error));

      this.notifyTitle();
  }

  //gets values of them by index means y of every x1...xn element
  toEntries(index: number) {
    return this.entires.filter(e => e.y == index);
  }

  //turned into text by using those data (TODO change this with proper style parameters)
  toText(t1: string, t2: string, value: number): string {
    if(this.isStyleMatrix()) {
      if(value < 1) {
        return t2 + ' is ' + (1 / value) + ' times better in style than ' + t1;
      } else if(value > 1) {
        return t1 + ' is ' + value + ' times better in style than ' + t2;  
      } else {
        return t1 + ' is equal in style with ' + t2;
      }      
    } else {
      if(value < 1) {
        return t2 + ' is ' + (1 / value) + ' times more important than ' + t1;
      } else if(value > 1) {
        return t1 + ' is ' + value + ' times more important than ' + t2;
      } else {
        return t1 + ' is equally important as ' + t2;
      }
    }
  }

  //focus lose on-blur of html node
  lose(x: number, y: number) {
    this.first = null;
    this.second = null;
  }

  //focus gain on-focus of html node
  gain(x: number, y: number) {
    this.first = this.data[y];
    this.second = this.data[x];
  }

  //change when selecting chage event on html element
  updateReverseEntry(x: number, y: number) {
    let size = Math.sqrt(this.entires.length);

    let m = y * size + x;
    let n = x * size + y;

    let value = this.entires[m].factor;
    this.entires[n].factor = 1 / value;
  }

  // create table matrix (NxN)
  toMatrix(count: number) {
    return Observable.range(0, Math.pow(count, 2))
      .map(index => {
        let x = index % count;
        let y = Math.floor(index / count);
        return {
          x: x, y: y, factor: 1 
        };
      })
      .map(a => a as Entry)
      .toArray();
  }

  toReset() {
    this.stage.history = [];
    this.stage.index = 0;

    this.state = -1; // go zero

    //it might be there
    this.result = false;
    this.set = [];

    this.data = [];

    this.toMoveNext();
    this.notifyTitle();
  } 

  toNext() {
    if(this.stage.index < this.stage.end) {
      if(this.isSelectState()) {
        let size = this.data.length;
        if(this.isSizeValid(size)) {
          this.state = 0; //vectorState
          this.stage.index += 1;

          this.clearTitleAndEntries();
          this.toMoveNext();
          this.notifyTitle();       
        } else {
           let msg = size < 2 ? 'you should select at least 2 or more boilers.' : size > 7 ? 'you should select at most 7 or less boilers.' : '';
           alert(msg);
        }
      } else {
        let matrix = {
          n: Math.sqrt(this.entires.length),
          matrix: this.entires.map(x => x.factor)
        };
        this.endpointService.pairwise(matrix)
          .map(r => r as Pairwise)
          .subscribe(r => {        
            if(r.consistency) {
              //cache those values if we need them back and forth movements
              this.toStore(this.stage.index, this.entires, this.titles, r);
              this.toMoveNext();   
              this.notifyTitle();       
            } else {
              //might want to use snackbar
              alert('There is in consistencity in your answer, please check your ratios and try later.');
            }
          }, error => console.log(error));
      } 
    }
  }

  toBack() {
    if(this.stage.index > this.stage.start) {
      
      let histories =  this.stage.history;
      let previousPosition = histories.length - 1;

      let previous = histories[previousPosition]; 
      //load those old values on tables.
      if(previous) {
        this.entires = previous.entries;
        this.titles = previous.titles;
      }
      //remove it from our history.
      this.stage.index -= 1;
      if(this.isResultState()) {
        this.state = 0;//make it vectorState
      } else if(this.isVectorState()) {
        if(this.stage.index == 0) {
          this.state = -1;//make it selectState
        }
      }
      histories.splice(previousPosition);// remove last item from history collection
    } 
    this.notifyTitle();
  }

  notifyChangeSelection(boiler: Boiler) {
    let position = this.data.indexOf(boiler);
    if(position != -1) {
      this.data.splice(position, 1);
    } else {
      this.data.push(boiler);
    }
  }

  isSelected(boiler: Boiler) {
    return this.data.indexOf(boiler) != -1;
  }

  isStyleMatrix(): boolean {
    return this.stage.index == (this.stage.end - 1);//if it's last we call it true
  }

  isSelectState() {
    return this.state == -1;
  }

  isVectorState() {
    return this.state == 0;
  }

  isResultState() {
    return this.state == 1;
  }

  //store move for going back
  private toStore(index: number, entries: Entry[], titles: string[], pairwise: Pairwise) {
    this.stage.history.push({
        index: index,
        entries: entries,
        titles: titles,
        pairwise: pairwise
    });
    this.stage.index += 1;    
    this.clearTitleAndEntries();
  }

  //next operation and what we do.
  private toMoveNext() {
    if(this.stage.index == 1) {
      //start for creteria
      this.decision.forEach(n => {
        this.titles.push(n.name);
      });  
      //and create new matrix
      this.toMatrix(this.decision.length)
        .subscribe(entries => this.entires = entries, error => console.log(error));
    } else if(this.stage.index == 2) {
      //start for sub-creteria
      let nodes = this.decision[0].subnodes;
      nodes.forEach(n => {
        this.titles.push(n.name);
      });
      //and create new matrix
      this.toMatrix(nodes.length)
        .subscribe(entries => this.entires = entries, error => console.log(error));
    } else if(this.stage.index == 3) {
      //load names from data
      this.data.forEach(n => {
        this.titles.push(n.brand + '-' + n.model);
      });
      //and create new matrix
      this.toMatrix(this.data.length)
        .subscribe(entries => this.entires = entries, error => console.log(error));
    } else if(this.stage.index == 4) {
      this.set = this.toResultSet();
      if(!this.isResultState()) {
        this.state = 1;
      }      
    }
  }

  //clear title and crap
  private clearTitleAndEntries() {
    this.titles = [];
    this.entires = [];
  }

  private toResultSet() {
    let vectors = [];
    var globals = [];
    let histories = this.stage.history;

    let normalized_price = this.normalize(this.data.map(x => x.price), this.MAX_PRICE);
    vectors.push(normalized_price);
    let normalized_maintenance = this.normalize(this.data.map(x => x.maintenance), this.MAX_MAINTENANCE);
    vectors.push(normalized_maintenance);
    let normalized_fuel = this.normalize(this.data.map(x => x.power), this.MAX_FUEL);
    vectors.push(normalized_fuel);
    vectors.push(histories[2].pairwise.vector);//last one is the style matrix.
    let normalized_safety = this.normalize(this.data.map(x => x.safety));
    vectors.push(normalized_safety);
    let normalized_reliability = this.normalize(this.data.map(x => x.warranty));
    vectors.push(normalized_reliability);

    //globals
    let node_vector = histories[0].pairwise.vector;
    let subnode_vector = histories[1].pairwise.vector;

    subnode_vector.forEach(v => globals.push(v));
    node_vector.forEach((v, i) => {
      if(i == 0) {
        globals = globals.map(x => x * v);
      } else {
        globals.push(v);
      }
    });

    //calc percentage
    return this.data.map((entry, index) => {
        let cols = globals.map((g, i) => g * vectors[i][index]);
        return { 
          percentage: this.sum(cols) * 100, 
          boiler: entry 
        };
      }).sort((a, b) => a.percentage - b.percentage)
      .reverse();    
  }
 
  /* These are the normalization parameters */
  private normalize(nums: number[], max?: number) {
    let data = max ? this.reverse(nums, max) : nums;//if we have to reverse values we need to pass max else we use normally
    let sum = this.sum(data);
    return data.map(v => v / sum);
  }

  private sum(nums: number[]): number {
    var sum = 0;
    nums.forEach(n => sum += n);
    return sum;
  }

  private reverse(nums: number[], max: number) {
    return nums.map(v => max - v);
  }

  private isSizeValid(count: number) {
    return count >= 2 && count <= 7;
  }

  private notifyTitle() {
    this.contentTitle = this.contentTitles[this.stage.index];
  }
}
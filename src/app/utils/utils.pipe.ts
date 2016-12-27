import { Pipe, PipeTransform } from '@angular/core';

/**
 * defaults is 3 
 * Usage: 
 *  {{ 0.33333333 | toDecimal }}
 *  0.333
 */
@Pipe({
  name: 'toDecimal'
})
export class DecimalPipe implements PipeTransform {

  private defaults = 3;

  transform(value: number, format: string): string {
    let f = parseInt(format);
    let floating = isNaN(f) || f < 0 ? this.defaults : f;
    return value.toFixed(floating);
  }
}

/**
 * defaults is 2 
 * Usage: 
 *  {{ 100 | toPercent:0 }}
 *  % 100
 */
@Pipe({
  name: 'toPercent'
})
export class PercentagePipe implements PipeTransform {

  private defaults = 2;

  transform(value: number, format: string): string {
    let f = parseInt(format);
    let floating = isNaN(f) || f < 0 ? this.defaults : f ;
    return '%' + value.toFixed(floating);
  }

}
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nc-viewport',
  template: ` <p>ng-cornerstone works!!!</p> `,
  styles: [],
})
export class ViewportComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {
    console.log('');
  }
}

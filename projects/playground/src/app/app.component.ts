import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    console.log('Isolate:' + window.crossOriginIsolated);
  }
}

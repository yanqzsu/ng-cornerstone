import initProviders from './initProviders';
import initCornerstoneDICOMImageLoader from './initCornerstoneDICOMImageLoader';
import initVolumeLoader from './initVolumeLoader';
import { init as csRenderInit } from '@cornerstonejs/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CornerstoneInitService {
  private readySubject = new BehaviorSubject<boolean>(false);
  ready$: Observable<boolean>;

  constructor() {
    this.ready$ = this.readySubject.asObservable();
  }

  init() {
    initProviders();
    initCornerstoneDICOMImageLoader();
    initVolumeLoader();
    csRenderInit().then((value) => {
      this.readySubject.next(true);
    });
  }
}

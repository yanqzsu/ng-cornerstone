import { InjectionToken } from '@angular/core';
import { Inject } from '@angular/core';
import { Component } from '@angular/core';

export const PORTAL_TEXT = new InjectionToken<string>('PORTAL_TEXT');

@Component({
  selector: 'app-text-portal',
  template: '{{text}}',
})
export class TextPortalComponent {
  constructor(@Inject(PORTAL_TEXT) public text: string) {}
}

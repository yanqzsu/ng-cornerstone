import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgCornerstoneComponent } from './ng-cornerstone.component';

describe('NgCornerstoneComponent', () => {
  let component: NgCornerstoneComponent;
  let fixture: ComponentFixture<NgCornerstoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgCornerstoneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCornerstoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

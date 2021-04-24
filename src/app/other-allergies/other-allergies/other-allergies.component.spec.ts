import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherAllergiesComponent } from './other-allergies.component';

describe('OtherAllergiesComponent', () => {
  let component: OtherAllergiesComponent;
  let fixture: ComponentFixture<OtherAllergiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherAllergiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

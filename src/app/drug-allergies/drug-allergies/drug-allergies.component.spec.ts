import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugAllergiesComponent } from './drug-allergies.component';

describe('DrugAllergiesComponent', () => {
  let component: DrugAllergiesComponent;
  let fixture: ComponentFixture<DrugAllergiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugAllergiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

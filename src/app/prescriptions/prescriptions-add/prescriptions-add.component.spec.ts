import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionsAddComponent } from './prescriptions-add.component';

describe('PrescriptionsAddComponent', () => {
  let component: PrescriptionsAddComponent;
  let fixture: ComponentFixture<PrescriptionsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

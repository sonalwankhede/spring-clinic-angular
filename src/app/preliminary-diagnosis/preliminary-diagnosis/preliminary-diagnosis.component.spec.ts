import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminaryDiagnosisComponent } from './preliminary-diagnosis.component';

describe('PreliminaryDiagnosisComponent', () => {
  let component: PreliminaryDiagnosisComponent;
  let fixture: ComponentFixture<PreliminaryDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreliminaryDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliminaryDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

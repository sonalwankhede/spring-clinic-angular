import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnownCaseComponent } from './known-case.component';

describe('KnownCaseComponent', () => {
  let component: KnownCaseComponent;
  let fixture: ComponentFixture<KnownCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnownCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnownCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

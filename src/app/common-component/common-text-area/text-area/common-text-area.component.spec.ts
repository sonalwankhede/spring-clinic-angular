import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTextAreaComponent } from './common-text-area.component';

describe('CommonTextAreaComponent', () => {
  let component: CommonTextAreaComponent;
  let fixture: ComponentFixture<CommonTextAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonTextAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

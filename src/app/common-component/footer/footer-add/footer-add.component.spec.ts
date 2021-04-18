import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAddComponent } from './footer-add.component';

describe('FooterAddComponent', () => {
  let component: FooterAddComponent;
  let fixture: ComponentFixture<FooterAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

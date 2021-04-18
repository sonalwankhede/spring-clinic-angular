import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsAddComponent } from './chips-add.component';

describe('ChipsAddComponent', () => {
  let component: ChipsAddComponent;
  let fixture: ComponentFixture<ChipsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChipsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

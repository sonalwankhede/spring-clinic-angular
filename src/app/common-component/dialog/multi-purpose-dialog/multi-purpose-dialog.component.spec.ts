import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPurposeDialogComponent } from './multi-purpose-dialog.component';

describe('MultiPurposeDialogComponent', () => {
  let component: MultiPurposeDialogComponent;
  let fixture: ComponentFixture<MultiPurposeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiPurposeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPurposeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

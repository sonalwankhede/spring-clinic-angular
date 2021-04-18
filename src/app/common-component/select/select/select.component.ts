import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormControl, FormGroup} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  myControl = new FormControl();

  form: any;

  control: any;

  @Input()
  options: string[];

  @Input()
  selectLabel: string;

  @Input()
  customClass: string;

  @Output() result = new EventEmitter();

  filteredOptions: Observable<string[]>;

  @Input()
  selectedOption: string;

  
  @Input()
  formCtrlName: any;

  constructor(private controlContainer: ControlContainer) {
  }

  ngOnInit() {
    this.myControl.setValue(this.selectedOption);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.form = <FormGroup>this.controlContainer.control;
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.myControl.setValue(event.option.viewValue);
    this.result.emit(event.option.viewValue);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) >= 0);
  }
  onChange(value: string) {
    value = value.trim(); 
    this.result.emit(value);
  }
}

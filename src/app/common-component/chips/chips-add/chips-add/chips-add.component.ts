import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Output } from '@angular/core';
import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/internal/operators';

@Component({
  selector: 'app-chips-add',
  templateUrl: './chips-add.component.html',
  styleUrls: ['./chips-add.component.css']
})
export class ChipsAddComponent implements OnInit {
  @Input()
  public form: FormGroup;

  public control: FormControl;

  @Input()
  chipLabel: string;

  @Input()
  chipsList: any;

  @Input()
  selectable: boolean;

  @Input()
  removable: boolean;

  @Input()
  placeholder: string;

  filteredChips: Observable<string[]>;

  @Input() 
  selectedChipsList: string[];

  @Input()
  formCtrlName: any;

  chipsCtrl = new FormControl();

  @Input()
  isMandatory: boolean;

  @ViewChild('chipsInput', { static: true }) chipsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  @Output() onchange: EventEmitter<Boolean> = new EventEmitter(false);

  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private controlContainer: ControlContainer) {
    this.selectedChipsList = [];
  }
  
  ngOnInit() {
    this.filteredChips = this.chipsCtrl.valueChanges.pipe(
      startWith(null),
      map((chip: string | null) => chip ? this._filter(chip) : this.chipsList.slice()));
    this.form = <FormGroup>this.controlContainer.control;
    this.control = <FormControl>this.form.get(this.formCtrlName);
    if(this.isMandatory && this.selectedChipsList.length == 0) {
      this.onchange.emit(false);
    }
  }

  remove(diagnosis: string): void {
    const index = this.selectedChipsList.indexOf(diagnosis);

    if (index >= 0) {
      this.selectedChipsList.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {

      this.selectedChipsList.push(value.trim());

    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.chipsCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedChipsList.push(event.option.viewValue);
    this.chipsInput.nativeElement.value = '';
    this.chipsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.chipsList.filter(chip => chip.toLowerCase().indexOf(filterValue) >= 0 );
  }
}

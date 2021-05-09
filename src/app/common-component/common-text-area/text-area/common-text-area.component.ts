import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/common.service';

@Component({
  selector: 'app-common-text-area',
  templateUrl: './common-text-area.component.html',
  styleUrls: ['./common-text-area.component.css']
})
export class CommonTextAreaComponent implements OnInit {

  @Input()
  textarea: any;

  @Input()
  title: string;

  @Input()
  indicativeMessage: string;

  @Input()
  errorMessage: string;

  @Output()
  newValues: EventEmitter<any> = new EventEmitter();

  loader: boolean;
  editable: boolean;
  currentList: string;

  showError: boolean;

  constructor(private commonService: CommonService) {
    this.loader = false;
    this.editable = false;
    this.showError = false;
    this.currentList = '';
  }

  ngOnInit() {
  }
  click() {
    if (this.textarea.disabled) {
      this.textarea.enable();
    } else {
      this.textarea.disable();
    }
  }
  save() {
    if (this.textarea && this.textarea.value && this.textarea.value !== null) {
      this.loader = true;
      this.textarea.disable();
      this.newValues.emit(this.textarea.value);
    } else {
      this.showError = true;
    }
  }

}

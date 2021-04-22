import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, Input } from '@angular/core';

@Component({
  selector: 'app-multi-purpose-dialog',
  templateUrl: './multi-purpose-dialog.component.html',
  styleUrls: ['./multi-purpose-dialog.component.css']
})
export class MultiPurposeDialogComponent implements OnInit {
  title: string;
  message: string;
  listOfFields: any;
  selectedField: string;
  enteredValue: string;
  
  constructor(public dialogRef: MatDialogRef<MultiPurposeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MultiPurposeConfirmDialogModel) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.listOfFields = data.listOfFields;
  }

  ngOnInit() {
  }
  onChange(selected) {
    this.selectedField = selected;
  }
  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close([true,this.selectedField, this.enteredValue]);
  }
  enterValue(value) {
    this.enteredValue = value;
  }
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close([false]);
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class MultiPurposeConfirmDialogModel {

  constructor(public title: string, public message: string, public listOfFields: string[]) {
  }
}

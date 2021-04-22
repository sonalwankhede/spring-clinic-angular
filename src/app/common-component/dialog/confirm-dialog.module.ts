import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { MatDialogModule, MatButtonModule, MatIconModule, MatSelectModule } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MultiPurposeDialogComponent } from './multi-purpose-dialog/multi-purpose-dialog.component';
@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule
    ],
    declarations: [
        ConfirmDialogComponent,
        MultiPurposeDialogComponent
    ],
    exports: [ConfirmDialogComponent, MultiPurposeDialogComponent],
    entryComponents: [ConfirmDialogComponent, MultiPurposeDialogComponent],
    providers: []
  })
  export class ConfirmDialogModule {
  }
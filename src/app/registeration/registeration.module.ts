import { NgModule } from '@angular/core';
import {
    MatInputModule, MatSliderModule, MatFormFieldModule, MatButtonModule,  MatProgressSpinnerModule,
    MatSelectModule, MatIconModule, MatCardModule, MatDatepickerModule, MatRadioModule
} from '@angular/material';
import { MatTableModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterationComponent } from './registeration/registeration.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule ,
        MatSliderModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatCardModule,
        MatDatepickerModule,
        MatRadioModule,
        MatTableModule,
        MatProgressSpinnerModule
    ],
    declarations: [
       RegisterationComponent
    ],
    exports: [
        RegisterationComponent
    ]
})
export class RegisterationModule {
}

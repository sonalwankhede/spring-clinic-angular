import { NgModule } from '@angular/core';
import {
    MatInputModule, MatSliderModule, MatFormFieldModule, MatButtonModule,  MatProgressSpinnerModule,
    MatSelectModule, MatIconModule, MatCardModule, MatDatepickerModule, MatRadioModule
} from '@angular/material';
import { MatTableModule } from '@angular/material';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
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
        LoginComponent
    ],
    exports: [
        LoginComponent
    ]
})
export class LoginModule {
}

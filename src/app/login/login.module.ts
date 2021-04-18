import { NgModule } from '@angular/core';
import {
    MatInputModule, MatSliderModule, MatFormFieldModule, MatButtonModule,
    MatSelectModule, MatIconModule, MatCardModule, MatDatepickerModule, MatRadioModule
} from '@angular/material';
import { MatTableModule } from '@angular/material';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
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
        MatTableModule
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

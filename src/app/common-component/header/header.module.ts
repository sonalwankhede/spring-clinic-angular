import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule, MatIconModule } from '@angular/material';
import { AppRoutingModule } from 'app/app-routing.module';
import { HeaderAddComponent } from './header-add/header-add.component';

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        MatCardModule,
        MatIconModule
    ],
    declarations: [
        HeaderAddComponent
    ],
    exports: [
        HeaderAddComponent
    ],
    providers: []
})
export class HeaderModule {
}
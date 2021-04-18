import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FooterAddComponent } from './footer-add/footer-add.component';
import { MatCardModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule
    ],
    declarations: [
        FooterAddComponent
    ],
    exports: [
        FooterAddComponent
    ],
    providers: []
})
export class FooterModule {
}
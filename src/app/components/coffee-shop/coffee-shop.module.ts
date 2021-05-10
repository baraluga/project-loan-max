import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CoffeeShopComponent } from './coffee-shop.component';

@NgModule({
  declarations: [CoffeeShopComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class CoffeeShopModule {}

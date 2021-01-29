import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaOfertaPageRoutingModule } from './nueva-oferta-routing.module';

import { NuevaOfertaPage } from './nueva-oferta.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    //FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NuevaOfertaPageRoutingModule,
    SharedModule
  ],
  declarations: [NuevaOfertaPage]
})
export class NuevaOfertaPageModule {}

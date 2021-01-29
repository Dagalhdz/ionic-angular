import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleLugarPageRoutingModule } from './detalle-lugar-routing.module';

import { DetalleLugarPage } from './detalle-lugar.page';
import { NuevaReservacionComponent } from 'src/app/reservaciones/nueva-reservacion/nueva-reservacion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleLugarPageRoutingModule,
    SharedModule
  ],
  declarations: [DetalleLugarPage, NuevaReservacionComponent],
  entryComponents: [NuevaReservacionComponent]
})
export class DetalleLugarPageModule {}

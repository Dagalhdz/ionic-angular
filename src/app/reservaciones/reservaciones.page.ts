import { Reservacion } from './reservacion.model';
import { ReservacionService } from './reservacion.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit, OnDestroy {

  reservacionesCargadas: Reservacion[];
  private reservacionesSub: Subscription;
  isLoading = false;

  constructor(private reservacioneService: ReservacionService, private loadCtrl: LoadingController) { }

  ngOnInit() {
    this.reservacionesSub = this.reservacioneService.reservaciones.subscribe(rsvs => {
      this.reservacionesCargadas = rsvs;
    })
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.reservacioneService.fetchReservacion().subscribe(() => {
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    if(this.reservacionesSub){
      this.reservacionesSub.unsubscribe();
    }
  }

  onRemoveReservaciones(firebaseId: string , slidignEl: IonItemSliding){
    slidignEl.close();
    this.loadCtrl.create({message: 'cancelando reservaciones ...'}).then(loadignEl => {
      loadignEl.present();
      this.reservacioneService.cancelarReservacion(firebaseId).subscribe(() => {
        loadignEl.dismiss();
      });
    });
    //ELIMINAR RESERVACION
  }
}

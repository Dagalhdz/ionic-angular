import { ReservacionService } from './../../../reservaciones/reservacion.service';
import { NuevaReservacionComponent } from './../../../reservaciones/nueva-reservacion/nueva-reservacion.component';
import { LugaresService } from './../../lugares.service';
import { Lugar } from './../../lugar.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';

@Component({
  selector: 'app-detalle-lugar',
  templateUrl: './detalle-lugar.page.html',
  styleUrls: ['./detalle-lugar.page.scss'],
})
export class DetalleLugarPage implements OnInit, OnDestroy {

  lugarActual: Lugar;
  lugarSub: Subscription;
  isLoading = false;

  constructor(
    //private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private lugarService: LugaresService,
    private actionSheetCtrl: ActionSheetController,
    private reservacionService: ReservacionService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ){}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('lugarId')){
        this.navCtrl.navigateBack('lugares/tabs/busqueda');
        return;
      }
      this.isLoading = true;
      
      this.lugarSub = this.lugarService.getLugar(paramMap.get('lugarId')).subscribe(lugar =>{
        this.lugarActual = lugar;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'Error',
          message: 'Error al obtener el lugar !',
          buttons: [
            {text: 'Ok', handler: () => {
              this.router.navigate(['lugares/tabs/busqueda']);
            }}
          ]
        }).then(alertEl => {
          alertEl.present();
        })
      });
    });
  }

  ngOnDestroy() {
    if(this.lugarSub){
      this.lugarSub.unsubscribe();
    }
  }

  onReservarLugar(){
    //this.router.navigateByUrl('lugares/tabs/busqueda');
    //this.navCtrl.pop();
    //this.navCtrl.navigateBack('lugares/tabs/busqueda');
    this.actionSheetCtrl.create({
      header: 'Selecciona accion',
      buttons: [
        {text: 'Seleccionar Fecha', handler: () => {
          this.openReservarModal('select');
        }},
        {text: 'Fecha al azar', handler: () => {
          this.openReservarModal('random');
        }},
        {text: 'Cancelar', role: 'cancel'}
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openReservarModal(mode: 'select' | 'random'){
    console.log(mode);

    this.modalCtrl.create({component: NuevaReservacionComponent, componentProps: {lugar: this.lugarActual, mode: mode}}).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData);
      if(resultData.role === 'confirm'){
        this.loadingCtrl.create({message: 'haciendo reservacion ...'}).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.reservacion;
          this.reservacionService.addReservacion(
            this.lugarActual.id,
            this.lugarActual.titulo,
            this.lugarActual.iamgeUrl,
            data.nombre,
            data.apellido,
            data.numeroHuespedes,
            data.desde,
            data.hasta
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }

  onMostrarMapa() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.lugarActual.ubicacion.lat, lng: this.lugarActual.ubicacion.lng},
      selectable: false,
      closeButtonText: 'Close',
      title: ''
    }}).then(modalEl => {
      modalEl.present();
    })
  }

}

import { LugaresService } from './../../lugares.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Lugar } from '../../lugar.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar-oferta',
  templateUrl: './editar-oferta.page.html',
  styleUrls: ['./editar-oferta.page.scss'],
})
export class EditarOfertaPage implements OnInit, OnDestroy {

  lugar: Lugar;
  form: FormGroup;
  lugarSub: Subscription;
  isLoading = false;
  lugarFirebaseId: string;

  constructor(
    private route: ActivatedRoute,
    private lugarService: LugaresService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      if(!param.has('lugarId')){
        this.navCtrl.navigateBack('luagres/tabs/ofertas');
        return;
      }
      this.lugarFirebaseId = param.get('lugarId')
      this.isLoading = true;

      this.lugarSub = this.lugarService.getLugar(param.get('lugarId')).subscribe(lugar => {
        this,lugar = lugar;
        this.form = new FormGroup({
          titulo: new FormControl(this.lugar.titulo, {
            updateOn: 'blur', validators: [Validators.required]
          }),
          descripcion: new FormControl(this.lugar.descripcion, {
            updateOn: 'blur', validators: [Validators.required,
            Validators.maxLength(180)]
          })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'Error',
          message: 'Error al obtener el ligar !',
          buttons: [
            {text: 'Ok', handler: () => {
              this.router.navigate(['lugares/tabs/ofertas']);
            }}
          ]
        }).then(alertEl => {
          alertEl.present();
        })
      });
    });
  }

  ngOnDestroy(){
    if(this.lugarSub){
      this.lugarSub.unsubscribe();
    }
  }

  onUpdateOffer(){
    if(!this.form.valid){
      return;
    }

    this.loadingCtrl.create({
      message: 'Actualizando lugar ...'
    }).then(loadEl => {
      loadEl.present();
      this.lugarService.updateLugar(this.lugar.firebaseId, this.form.value.titulo, this.form.value.descripcion).subscribe( () => {
        loadEl.dismiss();
        this.form.reset();
        this.router.navigate(['/lugares/tabs/ofertas']);
      });
    });
  }

}

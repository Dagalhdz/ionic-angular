import { LugaresService } from './../../lugares.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lugar } from '../../lugar.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservar-oferta',
  templateUrl: './reservar-oferta.page.html',
  styleUrls: ['./reservar-oferta.page.scss'],
})
export class ReservarOfertaPage implements OnInit, OnDestroy {

  lugar: Lugar;
  lugarSub: Subscription;
  isLoading = false;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private lugaresService: LugaresService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('lugarId')){
        this.navCtrl.navigateBack('/lugares/tabs/ofertas');
        return;
      }
      this.isLoading = true;
      this.lugarSub = this.lugaresService.getLugar(paramMap.get('lugarId')).subscribe(lugar => {
        this.lugar = lugar;
      });
    });
  }

  ngOnDestroy(){
    if(this.lugarSub){
      this.lugarSub.unsubscribe();
    }
  }

}

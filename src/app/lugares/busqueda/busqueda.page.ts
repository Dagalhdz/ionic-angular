import { LugaresService } from './../lugares.service';
import { Lugar } from './../lugar.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.page.html',
  styleUrls: ['./busqueda.page.scss'],
})
export class BusquedaPage implements OnInit, OnDestroy {

  lugaresCargados: Lugar[];
  lugaresListados: Lugar[];
  lugaresRelevantes: Lugar[];
  private lugaresSub: Subscription;
  isLoading = false;

  constructor(private lugaresService: LugaresService, private menuCtrl: MenuController, private loginService: LoginService) {  }

  ngOnInit() {
    this.lugaresSub = this.lugaresService.lugares.subscribe(lugares => {
      this.lugaresCargados = lugares;
      this.lugaresRelevantes = this.lugaresCargados;
      this.lugaresListados = this.lugaresRelevantes;
    });
  }

  ionViewDidEnter(){
    this.isLoading = true;
    this.lugaresService.fetchLugares().subscribe(() => {
      this.isLoading = false;
    })
  }

  ngOnDestroy(){
    if(this.lugaresSub){
      this.lugaresSub.unsubscribe();
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);

    if(event.detail.value === 'todos'){
      this.lugaresRelevantes = this.lugaresCargados;
      this.lugaresListados = this.lugaresRelevantes.slice(1);
    }
    else{
      this.lugaresRelevantes = this.lugaresCargados.filter(lugar => lugar.usuarioId !== this.loginService.usuarioId);
      this.lugaresListados = this.lugaresRelevantes.slice(1);
    }

  }

  openSideMenu(){
    this.menuCtrl.open();
  }

}

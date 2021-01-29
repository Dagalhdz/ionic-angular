import { LugarUbicacion, Coordenadas } from './../../../lugares/location.model';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Capacitor, Plugins } from '@capacitor/core'

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() ubicacionSelected = new EventEmitter<LugarUbicacion>();
  selectedLocationImage: string;

  constructor(
    private modalCtrl: ModalController, 
    private http: HttpClient, 
    private actionSheet: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  onPickLocation() {
    this.actionSheet.create({header: 'Selecciona', buttons: [
      {text: 'UbicacionActual', handler: () => {
        this.ubicacionUsuario();
      }},
      {text: 'Cancelar', role: 'cancel'}
    ]}).then(actionEl => {
      actionEl.present();
    })
  }

  showAlertLocationError(){
    this.alertCtrl.create({header: 'No se pudo acceder ala ubicacion,', message: 'Intentelo nuevamente', buttons: ['Ok']});
  }

  ubicacionUsuario(){
    if(!Capacitor.isPluginAvailable('Geolocation')){
      this.showAlertLocationError()
      return;
    }
    Plugins.Geolocation.getCurrentPosition().then(geoLocation => {
      const coords: Coordenadas = {
        lat: geoLocation.coords.latitude,
        lng: geoLocation.coords.longitude,
      };
      this.crearPunto(coords.lat, coords.lng);
    })
    .catch(err => {
      this.showAlertLocationError();
    })
  }

  openMap(){
    this.modalCtrl.create({component: MapModalComponent}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        console.log(modalData);
        if(!modalData){
          return;
        }
        else{
          this.crearPunto(modalData.data.lat, modalData.data.lng)
        }
      })
      modalEl.present();
    })
  }

  private crearPunto(lat: number, lng: number) {
    const pickedLocation: LugarUbicacion = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null
    }
    this.getAddress(lat, lng).pipe(switchMap(address => {
      pickedLocation.address = address;
      return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 16));
    })).subscribe(staticMap => {
      pickedLocation.staticMapImageUrl = staticMap;
      this.selectedLocationImage = staticMap;
      this.ubicacionSelected.emit(pickedLocation);
    });
  }

  getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json\latlng=${lat},$lng$key=${environment.googleMapsAPIKey}`).pipe(map(geoData => {
      console.log(geoData);
      if(!geoData || !geoData.results || geoData.results.length === 0){
        return null;
      }
      else{
        return geoData.results[0].formatted.address;
      }
    }));
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?cebter=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap&markers=color:red%7Clabel:Lugar%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }

}

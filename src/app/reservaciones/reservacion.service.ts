import { delay, take, tap, map, switchMap } from 'rxjs/operators';
import { LoginService } from './../login/login.service';
import { Reservacion } from './reservacion.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface ReservacionData{
  apellido: string,
  desde: string,
  hasta: string,
  huespedes: string,
  id: number,
  imageUrl: string,
  lugarId: number,
  lugarTitulo: string,
  nombre: string,
  usuarioId: number
}

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {
  
  
  private _reservaciones = new BehaviorSubject<Reservacion[]>([]);

  constructor(private loginService: LoginService, private http: HttpClient) { }
  
  get reservaciones(){
    return this._reservaciones.asObservable();
  }

  addReservacion(lugarId: number, description: string, imageUrl: string, nombre: string, apellido: string, huespedes: number, desde: Date, hasta: Date) {
    let firebaseId: string;
    const newReservacion = new Reservacion(Math.random()*100, lugarId, this.loginService.usuarioId, description, imageUrl, nombre, apellido, huespedes, desde, hasta, null);
    console.log(newReservacion);
    return this.http.post<{name: string}>(`https://fake-bnb-e0bf4.firebaseio.com/reservaciones.json`, {...newReservacion, firebaseId: null}).pipe(switchMap(resData => {
      firebaseId = resData.name;
      return this.reservaciones;
    }), take(1), tap(rsvs => {
      this._reservaciones.next(rsvs.concat(newReservacion));
    }))
    /* return this.reservaciones.pipe(take(1), delay(1000), tap( rsvs => {
      this._reservaciones.next(rsvs.concat(newReservacion));
    })); */
  }

  fetchReservacion(){
    let url: string = `https://fake-bnb-e0bf4.firebaseio.com/reservaciones.json?orderBy="usuarioId"&equalTo=${this.loginService.usuarioId}`;
    return this.http.get<{[key: string]: ReservacionData}>(url)
    .pipe(map(rsvDta => {
      const reservaciones = [];
      for(const key in rsvDta){
        if(rsvDta.hasOwnProperty(key)){
          reservaciones.push(new Reservacion(rsvDta[key].id, rsvDta[key].lugarId, rsvDta[key].usuarioId, rsvDta[key].lugarTitulo, rsvDta[key].imageUrl, rsvDta[key].nombre, rsvDta[key].apellido, +rsvDta[key].huespedes, new Date(rsvDta[key].desde), new Date(rsvDta[key].hasta), key))
        }
      }
      return reservaciones;
    }), tap(rsvs => {
      this._reservaciones.next(rsvs);
    }))
  }

  cancelarReservacion(firebaseId: string){
    return this.http.delete(`https://fake-bnb-e0bf4.firebaseio.com/${firebaseId}.json`).pipe(switchMap(() => {
      return this.reservaciones;
    }), take(1), tap(rsvs => {
      this._reservaciones.next(rsvs.filter(r => {
        r.firebaseId !== firebaseId;
      }))
    }))
  }
  
}

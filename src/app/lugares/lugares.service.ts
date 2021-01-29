import { Lugar } from './lugar.model';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { FnParam } from '@angular/compiler/src/output/output_ast';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { LugarUbicacion } from './location.model';

interface LugarData{
  descripcion: string;
  disponibleDesde: string;
  disponibleHasta: string;
  id: number;
  imageUrl: string;
  precio: number;
  titulo: string;
  usuarioId: number;
  ubicacion: LugarUbicacion;
}

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  private _lugares = new BehaviorSubject<Lugar[]> ([
    /*new Lugar(1, 'Depto. Las Torres', 'excelente ubicacion', 'https://static-mx.lamudi.com/static/media/cXVhbGl0eS83MA%3D%3D/2x2x2x700x340/b4da2d5486cb2b.jpg', 1200, new Date('2020-10-01'), new Date('2021-01-01'), 1),
    new Lugar(2, 'Depto. Cancun', 'exelencte ubicacion', 'https://static-mx.lamudi.com/static/media/cXVhbGl0eS83MA%3D%3D/2x2x2x700x340/771041d223fbe1.jpg', 3200, new Date('2020-10-01'), new Date('2021-01-01'), 1),
    new Lugar(3, 'Quinta Santa Rosa', 'exelencte ubicacion', 'https://cf.bstatic.com/images/hotel/max1280x900/135/135969274.jpg', 10000, new Date('2020-10-01'), new Date('2021-01-01'), 1),
    new Lugar(4, 'Casa San Roque', 'exelencte ubicacion', 'https://i.pinimg.com/originals/5d/7e/80/5d7e8095de543443153a701d2926710f.jpg', 8000, new Date('2020-10-01'), new Date('2021-01-01'), 1),*/
  ]);

get lugares(){
  return this._lugares.asObservable();
}

  constructor(private loginService: LoginService, private http: HttpClient) { }

  fetchLugares() {
    return this.http.get<{[key: string]: LugarData}>('https://fake-bnb-e0bf4.firebaseio.com/ofertas-lugares.json').pipe(map(dta => {
      const lugares = [];
      for(const key in dta){
        if(dta.hasOwnProperty(key)){
          lugares.push(
            //dta
            new Lugar(dta[key].id, dta[key].titulo, dta[key].descripcion, dta[key].imageUrl, dta[key].precio, new Date(dta[key].disponibleDesde), new Date(dta[key].disponibleHasta), dta[key].usuarioId, key, dta[key].ubicacion)
          )
        }
      }
      return lugares;
    }), tap(lugares => {
      this._lugares.next(lugares)
    })
    );
  }

  getLugar(firebaseId: string){
    return this.http.get<LugarData>(`https://fake-bnb-e0bf4.firebaseio.com/ofertas-lugares/${firebaseId}.json`)
    .pipe(map(dta => {
      return new Lugar(dta.id, dta.titulo, dta.descripcion, dta.imageUrl, dta.precio, new Date(dta.disponibleDesde), new Date(dta.disponibleHasta), dta.usuarioId, firebaseId, dta.ubicacion);
    }));
  }

  addLugar(titulo: string, descripcion: string, precio: number, disponibleDesde: Date, disponibleHasta: Date, ubicacion: LugarUbicacion){
    const newLugar = new Lugar(
      Math.random(),
      titulo,
      descripcion,
      'https://img10.naventcdn.com/avisos/18/00/53/55/97/00/720x532/144271181.jpg',
      precio,
      disponibleDesde,
      disponibleHasta,
      this.loginService.usuarioId,
      '',
      ubicacion
    );
    
    this.http.post<any>('https://fake-bnb-e0bf4.firebaseio.com/ofertas-lugares.json', {...newLugar, firebaseId: null}).subscribe(data => {
      console.log(data);
      return this._lugares.pipe(take(1)).subscribe(lugares => {
        this._lugares.next(lugares.concat(newLugar));
      });
    });
  }

  updateLugar(lugarId: string, titulo: string, descripcion: string){
  
    let nuevosLugares: Lugar[];
    return this.lugares.pipe(take(1),
    switchMap(lugares => {
      if(!lugares || lugares.length <= 0){
        return this.fetchLugares();
      }
      else{
        return of(lugares);
      }
    }), 
    switchMap(lugares => {
      const index = lugares.findIndex(lu => lu.firebaseId === lugarId);
      nuevosLugares = [...lugares];
      const old = nuevosLugares[index];
      nuevosLugares[index] = new Lugar(old.id, titulo, descripcion, old.iamgeUrl, old.precio, old.disponibleDesde, old.disponibleHasta, old.usuarioId, '', old.ubicacion);
      return this.http.put('https://fake-bnb-e0bf4.firebaseio.com/ofertas-lugares/${lugarId}.json', {...nuevosLugares[index]});
    }), tap(() => {
      this._lugares.next(nuevosLugares);
    })
    );
  }
}

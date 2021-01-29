import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { Router, UrlSegment, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {
  
  constructor(
    private loginService: LoginService, 
    private router: Router
  ){}
  
  canLoad(route: Route, segments: UrlSegment[]) : Observable<boolean> | Promise<boolean> | boolean{
    if(!this.loginService.usuarioLoggeado){
      this.router.navigateByUrl('/login');
    }
    return this.loginService.usuarioLoggeado;
  }

}

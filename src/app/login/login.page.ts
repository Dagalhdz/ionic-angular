import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoading: boolean = false;
  isLoginMode: boolean = true;

  constructor(
    private loginService: LoginService, 
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }

  onLogin(){
    this.isLoading = true;
    this.loginService.login();

    this.loadingCtrl.create({keyboardClose: true, message: 'Cargando ..'}).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/lugares/tabs/busqueda');
      }, 1000);
    });
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return false;
    }

    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode){
      //LLamada a WS De Login
    }
    else{
      //Llamada a WS DE REGISTRO
    }

  }

  onSwitchAuthMode(){
    this.isLoginMode = !this.isLoginMode;
  }


}

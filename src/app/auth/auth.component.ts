import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  isLogin = true;
  isLoading = false;

  constructor(private menu: MenuController,
              private activatedRoute: ActivatedRoute,
              private alert: AlertController,
              private auth: AngularFireAuth,
              private router: Router,
              private toast: ToastController,
              private authService: AuthService) { }

  ngOnInit() {
    const routeObs = this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('signup')) {
        return;
      }
      this.isLogin = false;
    });
  }

  openMenu() {
    this.menu.open();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    this.authService.authenticate(email, password, this.isLogin, name);
    form.reset();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
    // form.reset();
  }

  resetPassword() {
    this.alert.create({
      header: 'Reset Passowrd?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.alert.dismiss();
          }
        },
        {
          text: 'RESET',
          handler: () => {
            this.alert.create({
              header: 'Enter Email',
              inputs: [
                {
                  name: 'Email'
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  handler: () => {
                    this.alert.dismiss();
                  }
                },
                {
                  text: 'RESET',
                  handler: data => {
                    this.auth.sendPasswordResetEmail(data.Email);
                    const toast: any = this.toast.create({
                      header: 'Email Sent!',
                      duration: 3000,
                      position: 'top',
                      color: 'success'
                    }).then((toastEl) => {
                      toastEl.present();
                    });
                  }
                }
              ]

            }).then(alertEl => alertEl.present());
            // this.alert.dismiss();
          }
        }]
      }).then(alertEl => alertEl.present());
  }

  logoClicked() {
    this.router.navigate(['/home']);
  }


}

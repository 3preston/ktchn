import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  loggedIn = false;
  userInfo: any;
  userSub: Subscription;
  routeObs: Subscription;
  applyMode = false;

  constructor(private menu: MenuController,
              private firestore: AngularFirestore,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toast: ToastController,
              private authService: AuthService) { }

  ngOnInit() {
    this.routeObs = this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('apply')) {
        this.applyMode = true;
      }
      this.userSub = this.authService.userInfo.subscribe(userInfo => {
        if (userInfo == null) {
          this.loggedIn = false;
        } else {
          this.userInfo = userInfo;
          this.loggedIn = true;
        }
      });
    });
  }

  emailSubmitted(form: NgForm) {
    const contact = {
      application: this.applyMode,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
      date: new Date()
    };
    this.firestore.collection('contact').add(contact).then(() => {
      const toast: any = this.toast.create({
        header: 'Message Recieved!',
        message: 'Watch Out For a Reply',
        duration: 5500,
        position: 'top',
        color: 'success'
      }).then((toastEl) => {
        toastEl.present().then(() => {
          this.router.navigate(['/home']);
        });
      });
    });
  }

  openMenu() {
    this.menu.open();
  }

  ionViewDidLeave() {
    this.userSub.unsubscribe();
  }

  logoClicked() {
    this.router.navigate(['/home']);
  }

}

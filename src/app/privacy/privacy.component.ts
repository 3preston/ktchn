import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit, OnDestroy {

  loggedIn = false;
  userInfo: any;
  userSub: Subscription;

  constructor(private authService: AuthService,
              private menu: MenuController,
              private router: Router) { }

  ngOnInit() {
    this.userSub = this.authService.userInfo.subscribe(userInfo => {
      if (userInfo == null) {
        this.loggedIn = false;
      } else {
        this.userInfo = userInfo;
        this.loggedIn = true;
      }
    });
  }

  openMenu() {
    this.menu.open();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  logoClicked() {
    this.router.navigate(['/home']);
  }

}

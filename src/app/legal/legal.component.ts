import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
})
export class LegalComponent implements OnInit, OnDestroy {

  loggedIn = false;
  userInfo: any;
  userSub: Subscription;

  constructor(private menu: MenuController,
              private router: Router,
              private authService: AuthService) { }

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

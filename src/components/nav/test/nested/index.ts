import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, NavParams, NavController, ViewController, MenuController} from '../../../../../src';
import {Config, Nav} from '../../../../../src';


@Component({
  template: `
    <ion-navbar *navbar>
      <ion-title>Login</ion-title>
    </ion-navbar>
    <ion-content style="text-align:center;" padding>
      <button (click)="goToAccount()">Login</button>
    </ion-content>
  `
})
export class Login {
  constructor(private nav: NavController) {}

  goToAccount() {
    this.nav.push(Account);
  }
}


@Component({
  template: `
    <ion-menu [content]="content">
     <ion-toolbar secondary>
       <ion-title>Account Menu</ion-title>
     </ion-toolbar>
     <ion-content>
       <ion-list>
         <button ion-item (click)="goToProfile()">
           Profile
         </button>
         <button ion-item (click)="goToDashboard()">
           Dashboard
         </button>
         <button ion-item detail-none (click)="logOut()">
           Logout
         </button>
       </ion-list>
     </ion-content>
    </ion-menu>

    <ion-nav id="account-nav" [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>
  `
})
export class Account {
  @ViewChild('account-nav') accountNav: Nav;

  rootPage = Dashboard;

  constructor(private menu: MenuController, private nav: NavController) {

  }

  goToProfile() {
    this.accountNav.setRoot(Profile).then(() => {
      this.menu.close();
    });
  }

  goToDashboard() {
    this.accountNav.setRoot(Dashboard).then(() => {
      this.menu.close();
    });
  }

  logOut() {
    this.nav.parent.setRoot(Login, null, { animate: true });
  }
}


@Component({
  template: `
    <ion-navbar *navbar primary>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Account Dashboard</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p><button (click)="goToProfile()">Profile</button></p>
      <p><button (click)="logOut()">Logout</button></p>
    </ion-content>
  `
})
export class Dashboard {
  constructor(private nav: NavController) {}

  goToProfile() {
    this.nav.push(Profile);
  }
  logOut() {
    this.nav.parent.setRoot(Login, null, {
      animate: true,
      direction: 'back'
    });
  }
}


@Component({
  template: `
    <ion-navbar *navbar danger>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Account Profile</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p><button (click)="goToDashboard()">Dashboard</button></p>
      <p><button (click)="logOut()">Logout</button></p>
    </ion-content>
  `
})
export class Profile {
  constructor(private nav: NavController) {}

  goToDashboard() {
    this.nav.push(Dashboard);
  }

  logOut() {
    this.nav.parent.setRoot(Login, null, {
      animate: true,
      direction: 'back'
    });
  }
}


@Component({
  template: `<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>`
})
class E2EApp {
  rootPage = Login;
}

ionicBootstrap(E2EApp);

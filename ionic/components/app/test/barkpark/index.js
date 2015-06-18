//import {Router} from 'ionic/routing/router'
import {For, Parent} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Log} from 'ionic/util'

import {
  Router, Routable, List, Item, HeaderTemplate, Nav, NavController,
  Toolbar, Button, Input, Tabs,
  Tab, Content, Aside
} from 'ionic/ionic'

@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/login.html',
  directives: [FormDirectives, Button, Input, Content, HeaderTemplate, Toolbar]
})
class LoginPage {
  constructor( nav: NavController ) {

    this.nav = nav
    Log.log('LOGIN PAGE', this)

    var fb = new FormBuilder()

    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  doLogin(event) {
    Log.log('Doing login')
    event.preventDefault();
    console.log(this.loginForm.value);

    //this.viewport.push(SecondPage)
  }

  doSignup(event) {
    this.nav.push(SignupPage)
  }
}

new Routable(LoginPage, {
  url: '/login',
  tag: 'login'
})

@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/signup.html',
  directives: [FormDirectives, Button, Input]
})
export class SignupPage {
  constructor( nav: NavController ) { //, fb: FormBuilder ) {

    this.nav = nav

    Log.log('SIGNUP PAGE')

    var fb = new FormBuilder()

    this.signupForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  doLogin(event) {
    this.nav.pop()
  }
  doSignup(event) {
    Log.log('Doing signup')
    event.preventDefault();
    console.log(this.signupForm.value);

    this.nav.push(AppPage)
    //this.viewport.push(SecondPage)
  }
}



@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/app.html',
  directives: [FormDirectives, Button, Input, Tabs, Tab]
})
export class AppPage {
  constructor( nav: NavController ) { //, fb: FormBuilder ) {
    this.nav = nav;
    this.streamTab = StreamTab
  }
}

@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/tabs/home.html',
  directives: [For, Content, List, Item]
})
class StreamTab {
  constructor(nav: NavController) {
    this.nav = nav;
    this.posts = [
      {'title': 'Just barked my first bark'},
      {'title': 'Went poopy' }
    ];
  }
  selectPost(post) {
    console.log('Select post', post);
    this.nav.push(PostDetail, {
      post
    }, {
      transition: '3dflip'
    })
  }
}

@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/post/detail.html',
  directives: [Content]
})
class PostDetail {
  constructor(nav: NavController) {
    this.nav = nav;
    this.title = 'Hello'
  }
  selectItem() {
    this.nav.push(PostDetailTab)
  }
}

@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/splash.html',
  directives: [Content, Button]
})
export default class SplashPage {
  constructor(nav: NavController) {
    this.nav = nav;
    window.nav = nav;
  }
  doLogin() {
    this.nav.push(LoginPage);
  }
}


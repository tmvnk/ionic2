import {App,NavController,AlertController,ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';
import {UserData} from '../../providers/user-data';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  static get parameters() {
    return [[NavController], [UserData],[AlertController],[ToastController]];
  }

  constructor(nav, userData, alertCtrl, toastCtrl) {
    this.nav = nav;
    this.userData = userData;
    this.alertCtrl = alertCtrl;
    this.toastCtrl = toastCtrl;

    this.login = {
      password: '',
      email: '',
      username: ''
    };

    this.submitted = false;
  }

  onLogin(form) {
    console.log(form.value.email);
    console.log(form);
    this.submitted = true;

    if (form.valid) {
      this.userData.login(form.value).then((resp)=>{
       if(resp.status == 'ok' || resp.status == 'success'){
        // toast message is send via app.js
        this.nav.setRoot(TabsPage);
      }else if(resp.status == 'error'){
        this.messageToast('A error has occured. Please check your login credentials and try again.')
      }else{
        this.messageToast('A error has occured. Please try again later.')
      }
    });

    }
  }

  onSignup() {
    this.nav.push(SignupPage);
  }

  onForgotPassword() {
    let alert = this.alertCtrl.create({
    title: 'Reset Password',
    subTitle: 'We will send instructions to your email address.',
    inputs: [
    {
      name: 'email',
      placeholder: 'your email address',
      value: ''
    }
    ],
    buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: data => {
        console.log('Cancel clicked');
      }
    },
    {
      text: 'Send',
      handler: data => {
        let email = data.email;

        if(this.emailValidator(email)){
          this.requestReset(email);
          console.log('email ok')
          return true
        }else{
          this.messageToast('Please enter a valid email.');
          console.log('email invalid')
          return false
        }
      }
    },
    ]
  });
    //open alert
    alert.present();

  }

  emailValidator(value) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (!EMAIL_REGEXP.test(value)) {
      return false;
    }else{
      return true;
    }
  }

  requestReset(email){
   this.login = {};
   // send request and handle response
   this.userData.forgot(email).then((resp) => {
    if(resp.status == 'ok'){
      this.messageToast('A reset link is send to ' + email)
    }else if(resp.status == 'error'){
      this.messageToast('A error has occured. Please check your email and try again.')
    }else{
      this.messageToast('A error has occured. Please try again later.')
    }
  });
 };

 messageToast(message,duration,timeout){

  if(duration === undefined){
    var duration = 5000;
  }

  let toast = this.toastCtrl.create({
    message: message,
    duration: duration
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  if(timeout){
    setTimeout(() => {
      toast.present();
    }, 300);
  }else{
    toast.present();
  };

}


// class end
}

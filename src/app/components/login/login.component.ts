import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';


import { LoginService } from './services/login.service';
import { AccountService } from '../services/account-service/account.service';
import { DataStoreService } from 'src/app/store/data-store.service';
import { UserProfile } from '../user-account/models/user-profile.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public isLoading: boolean;

  constructor(
    private router: Router,
    private login: LoginService,
    private accountService: AccountService,
    private zone: NgZone,
    private store: DataStoreService
  ) { }

  ngOnInit() { }

  loginWithGoogle() {
    this.isLoading = true;

    this.login.loginWithGoogle()
      .then(() => {
        this.searchForUserProfile();
      })
      .catch((err) => {
        console.log('Error with Google auth login.' + JSON.stringify(err, null, 3));
        this.isLoading = false;
      });
  }

  searchForUserProfile() {
    console.log('Searching database for user.');

    return this.accountService.findUser(this.store.userEmail)
      .subscribe(
        (user) => {
          // Check if response object has an email property
          if (user.email) {
            console.log('User located in database.');
          // Cache user profile in the STORE
          this.store.profile = user;
          this.isLoading = false;
          this.navigateToUserPage();
          }
          console.log('User not found in database.');

        }, (err) => {
          console.log('Error occurred searching for user in database: ' + JSON.stringify(err, null, 2));
          this.isLoading = false;
        });
  }

  storeUserInDB() {
    console.log('Storing user in database');

    this.accountService.createUser(this.store.profile)
      .subscribe(
        (user: UserProfile) => {
          this.store.profile = user;
          this.isLoading = false;
          this.navigateToUserPage();
          console.log('User successful stored in database.');
        },
        (err) => {
          this.isLoading = false;
          console.log('Failed to store user in database.' + JSON.stringify(err, null, 2));
        },
        () => {
          this.cacheUserProfile();
        });
  }

  cacheUserProfile() {
    // TODO store the entire user profile object in local storage
    localStorage.setItem('mealVoteUserName', this.store.userName);
    localStorage.setItem('mealVoteUserEmail', this.store.userEmail);
  }

  navigateToUserPage() {
    this.zone.run(() => {
      this.router.navigate(['/user/' + this.store.userName]);
    });
  }

}

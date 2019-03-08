import { Component } from '@angular/core';
import { DataStoreService } from 'src/app/store/data-store.service';
import { UserProfile } from './models/user-profile.model';
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})

export class UserAccountComponent {

  public tribeMember: boolean;
  public profile: UserProfile;

  constructor(private store: DataStoreService) {
    this.store.profile.subscribe((profile: UserProfile) => {

      // Checking DataStore to see if profile exists. Needed for browser refresh
      if (!profile.userName) {
        console.log('No profile exists in DataStore.');

        // Get profile from Local Storage
        const cachedProfile = this.store.getProfileFromLocalStorage();
        this.store.updateProfile(cachedProfile);
        console.log('Successfully retrieved profile from local storage');
      }

      console.log('Profile found in DataStore');
      this.profile = profile;

      // Check if user belongs to a tribe
      this.tribeMember = (this.profile.tribe.length > 0);
    });
  }
}

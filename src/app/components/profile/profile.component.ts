import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

user: User | null = null;

constructor(private profileService: ProfileService){
  
}
  
ngOnInit(): void {
    const foundUser = this.profileService.getProfileFromLocalStorage();

  if(foundUser){
    this.user = JSON.parse(foundUser);
  }else{
    this.profileService.getProfileFromBackend().subscribe((data)=> {
      this.user = data;
    },
    (error) =>{
      console.log(error);
    }
  )
  }
  }

}

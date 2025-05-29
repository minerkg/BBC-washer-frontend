import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule,DialogModule, InputTextModule,PasswordModule,FormsModule,FloatLabelModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  visible: boolean = false;
  username: string = '';
  password: string = '';

  showDialog(){
    this.visible = true;
    console.log("clicked")
  }
  closeDialog(){
    this.visible = false;
  }

  logIn(){
    
    console.log({username: this.username, password: this.password})
    this.visible = false;
  }


}
